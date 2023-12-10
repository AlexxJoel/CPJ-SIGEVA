import {PoolSingleton} from "../../config/postgres";
import {Errors} from "../../config/error_codes";
import {AuthUserDto} from "./auth.dtos";
const findAuthUserByUsername = async (username: string) => {
   try {
       const pool = await PoolSingleton.getInstance();
       const sql = await pool.query('select u.username, u.password, u.status, r.name as role from users u inner join roles r on r.id = u.roles_id WHERE username = $1', [username]);

       return sql.rows.map(row =>
           ({
               id: row['id'],
               name: row['name'],
               username: row['username'],
               password: row['password'],
               email: row['email'],
               isManager: row['is_manager'],
               status: row['status'],
               role: row['role']
           })
       )[0] as AuthUserDto;

   }catch (e) {throw Error(Errors.SERVER_ERROR);}}


export {
    findAuthUserByUsername
}