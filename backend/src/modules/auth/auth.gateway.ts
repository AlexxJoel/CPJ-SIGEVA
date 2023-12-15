import {PoolSingleton} from "../../config/postgres";
import {Errors} from "../../config/error_codes";
import {AuthUserDto} from "./auth.dtos";

const findAuthUserByUsername = async (username: string) => {
    try {
        const pool = PoolSingleton.getInstance();
        const sql = await pool.query('select u.id, u.username, u.password, u.status, r.name as role, s.id as staffId from users u inner join roles r on r.id = u.roles_id inner join public.staff s on s.id = u.staff_id WHERE username = $1', [username]);

        return sql.rows.map(row =>
            ({
                id: row['id'],
                name: row['name'],
                username: row['username'],
                password: row['password'],
                email: row['email'],
                isManager: row['is_manager'],
                status: row['status'],
                role: row['role'],
                staffId: row['staffid']
            })
        )[0] as AuthUserDto;

    } catch (e) {
        console.log(e)
        throw Error(Errors.SERVER_ERROR);
    }
}
export {
    findAuthUserByUsername
}