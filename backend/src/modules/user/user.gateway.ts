import { DatabaseError } from "pg";
import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres"
import { mapUsersReseponse } from "./utils/userFunctions";

const existsById = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: existsRows } = await pool.query(`select id from users where id = $1`,
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
        const { rows: userRow } = await pool.query(`select
            u.id as id_u,
            u.username as username_u,
            u.password as password_u,
            u.status as status_u,
            u.staff_id as staff_id_u,
            u.roles_id as roles_id_u,
            r.id as id_r,
            r.name as name_r,
            r.description as description_r from users u 
                inner join roles r on r.id = u.roles_id
            where u.id = $1;`,
            [id]);
        return mapUsersReseponse(userRow)[0];
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const findAll = async () => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: userRows } = await pool.query(`select
            u.id as id_u,
            u.username as username_u,
            u.password as password_u,
            u.status as status_u,
            u.staff_id as staff_id_u,
            u.roles_id as roles_id_u,
            r.id as id_r,
            r.name as name_r,
            r.description as description_r from users u 
                inner join roles r on r.id = u.roles_id
            order by u.id asc;`);
        return mapUsersReseponse(userRows);
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const changeUserStatus = async (id: number) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: userRow } = await client.query(`update users set status = not status where id = $1 returning id;`,
            [id]);
        if (!userRow[0].id) throw Error(Errors.ERROR_DELETING);
        await client.query('COMMIT');
        return !!userRow[0].id;
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
    changeUserStatus
}