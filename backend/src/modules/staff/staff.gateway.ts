import { DatabaseError } from "pg";
import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres";
import { Staff } from "./staff.dtos";
import { mapStaffResponse } from "./utils/staffFunctions";
import { hashPassword } from "../../utils/generalFunctions";

const existsById = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: existsRows } = await pool.query(`select id from staff where id = $1;`,
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
        const { rows: existsRows } = await pool.query(`select id from staff where email = $1;`,
            [email]);
        return !!existsRows[0]?.id
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const findOne = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: staffRows } = await pool.query(`select s.id as id_s,
        s.birthday as birthday_s,
        s.email as email_s,
        s.status as status_s,
        s.is_manager as is_manager_s,
        s.people_id as people_id_s,
        p.id as id_p,
        p.name as name_p,
        p.surname as surname_p,
        p.lastname as lastname_p,
        u.id as id_u,
        u.username as username_u,
        u.password as password_u,
        u.status as status_u,
        u.staff_id as staff_id_u,
        u.roles_id as roles_id_u,
        r.id as id_r,
        r.name as name_r,
        r.description as description_r from staff s
            inner join people p on p.id = s.people_id
            inner join users u on s.id = u.staff_id
            inner join roles r on r.id = u.roles_id
        where s.id = $1;`,
            [id]);
        return mapStaffResponse(staffRows)[0];
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const findAll = async () => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: staffRows } = await pool.query(`select s.id as id_s,
        s.birthday as birthday_s,
        s.email as email_s,
        s.status as status_s,
        s.is_manager as is_manager_s,
        s.people_id as people_id_s,
        p.id as id_p,
        p.name as name_p,
        p.surname as surname_p,
        p.lastname as lastname_p,
        u.id as id_u,
        u.username as username_u,
        u.password as password_u,
        u.status as status_u,
        u.staff_id as staff_id_u,
        u.roles_id as roles_id_u,
        r.id as id_r,
        r.name as name_r,
        r.description as description_r from staff s
            inner join people p on p.id = s.people_id
            inner join users u on s.id = u.staff_id
            inner join roles r on r.id = u.roles_id
        order by s.id asc;`);
        return mapStaffResponse(staffRows);
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

const saveStaff = async (payload: Staff) => {
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
        const { rows: staffRow } = await client.query(`insert into staff(birthday, email, people_id)
            values($1, $2, $3) returning id;`, [
            payload.birthday,
            payload.email,
            payload.peopleId
        ]);
        if (!staffRow[0].id) throw Error(Errors.ERROR_SAVING);
        payload.user!.staffId = staffRow[0].id;
        payload.user!.password = `${payload.person!.name.slice(0, 2)}${payload.person!.surname.slice(0, 2)}${payload.birthday.split('-')[2]}`;
        payload.user!.password = await hashPassword(payload.user!.password);
        const { rows: userRow } = await client.query(`insert into users(username, password, staff_id, roles_id) 
            values($1, $2, $3, $4) returning id;`, [
            payload.user!.username,
            payload.user!.password,
            payload.user!.staffId,
            payload.user!.rolesId
        ]);
        if (!userRow[0]?.id) throw Error(Errors.ERROR_SAVING);
        await client.query('COMMIT');
        return !!userRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release()
    }
}

const updateStaff = async (payload: Staff) => {
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
        const { rows: staffRow } = await client.query(`update staff set birthday = $1, email = $2 
            where id = $3 returning id;`, [
            payload.birthday,
            payload.email,
            payload.id
        ]);
        if (!staffRow[0].id) throw Error(Errors.ERROR_UPDATING);
        const { rows: passRow } = await pool.query(`select password from users where id = $1;`, [payload.user!.id])
        if (passRow[0].password !== payload.user!.password)
            payload.user!.password = await hashPassword(payload.user!.password);
        const { rows: userRow } = await client.query(`update users set username = $1, password = $2, roles_id = $3 where id = $4 returning id;`, [
            payload.user!.username,
            payload.user!.password,
            payload.user!.rolesId,
            payload.user!.id
        ]);
        if (!userRow[0]?.id) throw Error(Errors.ERROR_UPDATING);
        await client.query('COMMIT');
        return !!userRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release()
    }
}

const changeStaffStatus = async (id: number) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: staffRow } = await client.query(`update staff set status = not status where id = $1 returning id;`,
            [id]);
        if (!staffRow[0].id) throw Error(Errors.ERROR_DELETING);
        await client.query('COMMIT');
        return !!staffRow[0].id;
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
    existsByEmail,
    findOne,
    findAll,
    saveStaff,
    updateStaff,
    changeStaffStatus,
}