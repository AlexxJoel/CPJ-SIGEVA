import { DatabaseError } from "pg";
import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres";
import { TicketDto, Transaction } from "./transaction.dtos";
import { sendNotification, sendTicket, sendTicketLayaway } from "./utils/transactionFunctions";

const saveSell = async (payload: Transaction) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    let costumerType = '';
    try {
        await client.query('BEGIN');
        if (!payload.staffInfo?.id && !payload.clientInfo?.id) {
            costumerType = 'clients';
            const { rows: personRow } = await client.query(`insert into people (name, surname, lastname) 
            values($1, $2, $3) returning id;`, [
                payload.clientInfo!.person.name,
                payload.clientInfo!.person.surname,
                payload.clientInfo!.person.lastname,
            ]);
            if (!personRow[0]?.id) throw Error(Errors.ERROR_SAVING);
            payload.peopleId = personRow[0].id;
            const { rows: clientRows } = await client.query(`insert into clients(email, phone_number, people_id) 
            values($1, $2, $3) returning id;`, [
                payload.clientInfo!.email,
                payload.clientInfo?.phoneNumber,
                payload.peopleId,
            ]);
            if (!clientRows[0]?.id) throw Error(Errors.ERROR_SAVING);
        } else if (payload.clientInfo?.person.id) {
            costumerType = 'clients';
            payload.peopleId = payload.clientInfo.person.id;
        } else if (payload.staffInfo?.person?.id) {
            costumerType = 'staff';
            payload.peopleId = payload.staffInfo?.person.id;
        } else {
            throw Error(Errors.ERROR_SAVING);
        }
        const query = `insert into transactions(creation_date, payment_date, total_amount, transaction_types_id, staff_id, people_id) 
        values(CURRENT_TIMESTAMP AT TIME ZONE 'America/Mexico_City', CURRENT_TIMESTAMP AT TIME ZONE 'America/Mexico_City', $1, 1, $2, $3) returning id, creation_date;`;
        const { rows: transactionRow } = await client.query(query, [
            payload.totalAmount,
            payload.staffId,
            payload.peopleId
        ])
        if (!transactionRow[0]?.id) throw Error(Errors.ERROR_SAVING);
        for await (const product of payload.charge) {
            const { rows: sellRow } = await client.query(`insert into transactions_has_products(transactions_id, products_id, quantity) 
                values($1, $2, $3);`, [
                transactionRow[0].id,
                product.id,
                product.quantitySold,
            ]);
            const { rows: productRows } = await client.query(`update products set quantity = quantity - $1 where id = $2 returning id, quantity, name;`, [
                product.quantitySold,
                product.id
            ])
            if (!productRows[0]?.id) throw Error(Errors.ERROR_UPDATING);
            if (productRows[0]?.quantity < 4) {
                const { rows: managerRow } = await client.query(`select email from staff where is_manager = true;`)
                sendNotification(managerRow[0]?.email, productRows[0]?.name);
            }
        }
        await client.query('COMMIT');
        const { rows: costumerRow } = await client.query(`select email from ${costumerType} where people_id = $1;`, [
            payload.peopleId
        ])
        const ticketPayload: TicketDto = {
            costumerName: payload.clientInfo?.person.name ? `${payload.clientInfo!.person.name} ${payload.clientInfo!.person.surname} ${payload.clientInfo!.person.lastname || ``}` :
                `${payload.staffInfo!.person!.name} ${payload.staffInfo!.person!.surname} ${payload.staffInfo!.person!.lastname || ``}`,
            charge: payload.charge,
        }
        if (payload.sendEmail)
            sendTicket(ticketPayload, transactionRow[0].creation_date, payload.totalAmount, costumerRow[0].email);
        return !!transactionRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release;
    }
}

const saveReStock = async (payload: Transaction) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        if (!payload.supplierInfo?.id) {
            const { rows: personRow } = await client.query(`insert into people (name, surname, lastname) 
            values($1, $2, $3) returning id;`, [
                payload.supplierInfo!.person.name,
                payload.supplierInfo!.person.surname,
                payload.supplierInfo!.person.lastname,
            ]);
            if (!personRow[0]?.id) throw Error(Errors.ERROR_SAVING);
            payload.peopleId = personRow[0].id;
            const { rows: supplierRow } = await client.query(`insert into suppliers(contact, people_id) 
                values($1, $2) returning id;`, [
                payload.supplierInfo!.contact,
                payload.peopleId,
            ]);
            if (!supplierRow[0]?.id) throw Error(Errors.ERROR_SAVING);
        } else if (payload.supplierInfo?.person.id) {
            payload.peopleId = payload.supplierInfo?.person.id;
        } else {
            throw Error(Errors.ERROR_SAVING);
        }
        const query = `insert into transactions(creation_date, payment_date, total_amount, transaction_types_id, staff_id, people_id) 
        values(CURRENT_TIMESTAMP AT TIME ZONE 'America/Mexico_City', CURRENT_TIMESTAMP AT TIME ZONE 'America/Mexico_City', $1, 3, $2, $3) returning id;`;
        const { rows: transactionRow } = await client.query(query, [
            payload.totalAmount,
            payload.staffId,
            payload.peopleId
        ])
        if (!transactionRow[0]?.id) throw Error(Errors.ERROR_SAVING);
        for await (const product of payload.charge) {
            const { rows: sellRow } = await client.query(`insert into transactions_has_products(transactions_id, products_id, quantity) 
                values($1, $2, $3);`, [
                transactionRow[0].id,
                product.id,
                product.quantitySold,
            ]);
            const { rows: productRows } = await client.query(`update products set quantity = quantity + $1 where id = $2 returning id, quantity, name;`, [
                product.quantitySold,
                product.id
            ])
            if (!productRows[0]?.id) throw Error(Errors.ERROR_UPDATING);
            if (productRows[0]?.quantity < 4) {
                const { rows: managerRow } = await client.query(`select email from staff where is_manager = true;`)
                sendNotification(managerRow[0]?.email, productRows[0]?.name);
            }
        }
        await client.query('COMMIT');
        return !!transactionRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release;
    }
}

const saveLayaway = async (payload: Transaction) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        if (payload.clientInfo?.person.id) {
            payload.peopleId = payload.clientInfo.person.id;
        } else if (payload.staffInfo?.person?.id) {
            payload.peopleId = payload.staffInfo?.person.id;
        } else {
            throw Error(Errors.ERROR_SAVING);
        }
        const query = `insert into transactions(creation_date, payment_date, total_amount, transaction_types_id, staff_id, people_id) 
        values(CURRENT_TIMESTAMP AT TIME ZONE 'America/Mexico_City', null, $1, 2, $2, $3) returning id, creation_date;`;
        const { rows: transactionRow } = await client.query(query, [
            payload.totalAmount,
            payload.staffId,
            payload.peopleId
        ])
        if (!transactionRow[0]?.id) throw Error(Errors.ERROR_SAVING);
        for await (const product of payload.charge) {
            const { rows: sellRow } = await client.query(`insert into transactions_has_products(transactions_id, products_id, quantity) 
                values($1, $2, $3);`, [
                transactionRow[0].id,
                product.id,
                product.quantitySold,
            ]);
            const { rows: productRows } = await client.query(`update products set quantity = quantity - $1 where id = $2 returning id, quantity, name;`, [
                product.quantitySold,
                product.id
            ])
            if (!productRows[0]?.id) throw Error(Errors.ERROR_UPDATING);
            if (productRows[0]?.quantity < 4) {
                const { rows: managerRow } = await client.query(`select email from staff where is_manager = true;`)
                sendNotification(managerRow[0]?.email, productRows[0]?.name);
            }
        }
        await client.query('COMMIT');
        const { rows: clientRow } = await client.query(`select email from clients where people_id = $1;`, [
            payload.peopleId
        ])
        const ticketPayload: TicketDto = {
            costumerName: payload.clientInfo?.person.name ? `${payload.clientInfo!.person.name} ${payload.clientInfo!.person.surname} ${payload.clientInfo!.person.lastname || ``}` :
                `${payload.staffInfo!.person!.name} ${payload.staffInfo!.person!.surname} ${payload.staffInfo!.person!.lastname || ``}`,
            charge: payload.charge,
        }
        if (payload.sendEmail)
            sendTicketLayaway(ticketPayload, transactionRow[0].creation_date, payload.totalAmount, clientRow[0].email);
        return !!transactionRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release;
    }
}

export {
    saveSell,
    saveReStock,
    saveLayaway
}