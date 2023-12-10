import { User } from "../user.dtos";

export const mapUsersReseponse = (rows: any): User[] => {
    return rows.map((row: any) => ({
        id: row['id_u'],
        username: row['username_u'],
        password: row['password_u'],
        status: row['status_u'],
        staffId: row['staff_id_u'],
        rolesId: row['roles_id_u'],
        role: {
            id: row['id_r'],
            name: row['name_r'],
            description: row['description_r']
        }
    }))
}