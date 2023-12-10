import { DatabaseError } from "pg";
import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres";
import { Supplier } from "./supplier.dtos"
import { mapSuppliersResponse } from "./utils/supplierFunctions";

const existsById = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: existsRows } = await pool.query(`select id from suppliers where id = $1;`,
            [id]);
        return !!existsRows[0]?.id;
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const findOne = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: supplierRows } = await pool.query(`select s.id as id_s,
            s.contact as contact_s,
            s.people_id as people_id_s,
            p.id as id_p,
            p.name as name_p,
            p.surname as surname_p,
            p.lastname as lastname_p from suppliers s
            inner join people p on p.id = s.people_id
        where s.id = $1;`,
            [id]);
        return mapSuppliersResponse(supplierRows)[0];
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const findAll = async () => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: supplierRows } = await pool.query(`select s.id as id_s,
            s.contact as contact_s,
            s.people_id as people_id_s,
            p.id as id_p,
            p.name as name_p,
            p.surname as surname_p,
            p.lastname as lastname_p from suppliers s
            inner join people p on p.id = s.people_id
        order by s.id asc;`)
        return mapSuppliersResponse(supplierRows);
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR)
    }
}

const saveSupplier = async (payload: Supplier) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: personRow } = await client.query(`insert into people(name, surname, lastname) 
            values($1, $2, $3) returning id;`, [
            payload.person!.name,
            payload.person!.surname,
            payload.person!.lastname
        ]);
        if (!personRow[0]?.id) throw Error(Errors.ERROR_SAVING);
        payload.peopleId = personRow[0].id;
        const { rows: supplierRow } = await client.query(`insert into suppliers(contact, people_id)
            values($1, $2) returning id`, [
            payload.contact,
            payload.peopleId
        ]);
        if (!supplierRow[0]?.id) throw Error(Errors.ERROR_SAVING);
        await client.query('COMMIT');
        return !!supplierRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release();
    }
}

const updateSupplier = async (payload: Supplier) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: personRow } = await client.query(`update people set name = $1, surname = $2, lastname = $3 
            where id = $4 returning id;`, [
            payload.person!.name,
            payload.person!.surname,
            payload.person!.lastname,
            payload.person!.id
        ]);
        if (!personRow[0]?.id) throw Error(Errors.ERROR_UPDATING);
        payload.peopleId = personRow[0].id;
        const { rows: supplierRow } = await client.query(`update suppliers set contact = $1 
            where id = $2 returning id`, [
            payload.contact,
            payload.id
        ]);
        if (!supplierRow[0]?.id) throw Error(Errors.ERROR_UPDATING);
        await client.query('COMMIT');
        return !!supplierRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release();
    }
}

export {
    existsById,
    findOne,
    findAll,
    saveSupplier,
    updateSupplier
}