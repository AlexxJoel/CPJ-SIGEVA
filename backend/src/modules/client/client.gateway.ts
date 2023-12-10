import { DatabaseError } from "pg";
import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres";
import { mapClientsResponse } from "./utils/clientFunctions";
import { Client } from "./client.dtos";

const findAll = async () => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: clientRows } = await pool.query(`select
        c.id as id_c,
        c.email as email_c,
        c.phone_number as phone_number_c,
        c.people_id as people_id_c,
        p.id as id_p,
        p.name as name_p,
        p.surname as surname_p,
        p.lastname as lastname_p
        from clients c
        inner join people p on c.people_id = p.id
        order by c.id asc;`);
        return mapClientsResponse(clientRows);
    } catch (error) {
        console.log(error);
        throw new Error(Errors.SERVER_ERROR);

    }
}

const existsById = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: existsRows } = await pool.query(`select id from clients where id = $1;`,
            [id]);
        return !!existsRows[0]?.id;
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const existsByEmail = async (email: String) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: existsRows } = await pool.query(`select id from clients where email = $1;`,
            [email]);
        return !!existsRows[0]?.id
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const saveClient =async (payload:Client) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: personRow } = await client.query(`insert into people (name, surname, lastname) 
        values($1, $2, $3) returning id;`, [
            payload.person!.name,
            payload.person!.surname,
            payload.person!.lastname,
        ]);        
        if (!personRow[0]?.id) throw Error(Errors.ERROR_SAVING);
            payload.peopleId = personRow[0].id;
            const {rows: clientRows} = await client.query(`insert into clients(email, phone_number, people_id) 
            values($1, $2, $3) returning id;`, [
            payload.email,
            payload.phoneNumber,
            payload.peopleId,
        ]);        
        if (!clientRows[0]?.id) throw Error(Errors.ERROR_SAVING);
        await client.query('COMMIT');
        return !!clientRows[0].id;
    } catch (error) {
       console.log(error);
       await client.query('ROLLBACK');
       if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
       throw error;
    } finally {
        client.release()
    }
    
}

const updateClient =async (payload:Client) => {
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
        const { rows: clientRows } = await client.query(`update clients set email = $1, phone_number = $2 
        where id = $3 returning id;`, [
        payload.email,
        payload.phoneNumber,
        payload.id
    ]);   
        if (!clientRows[0]?.id) throw Error(Errors.ERROR_UPDATING);
        await client.query('COMMIT');
        return !!clientRows[0].id;
    } catch (error) {
       console.log(error);
       await client.query('ROLLBACK');
       if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
       throw error;
    } finally {
        client.release()
    }
}

export{
    findAll,
    saveClient,
    updateClient,
    existsByEmail,
    existsById
}