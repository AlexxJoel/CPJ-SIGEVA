import { Staff } from "../staff.dtos"

export const mapStaffResponse = (rows: any): Staff[] => {
    return rows.map((row: any) => ({
        id: row['id_s'],
        birthday: row['birthday_s'],
        email: row['email_s'],
        status: row['status_s'],
        isManager: row['is_manager_s'],
        peopleId: row['people_id_s'],
        person: {
            id: row['id_p'],
            name: row['name_p'],
            surname: row['surname_p'],
            lastname: row['lastname_p'],
        },
        user: {
            id: row['id_u'],
            username: row['username_u'],
            password: row['password_u'],
            status: row['status_u'],
            staffId: row['staff_id_u'],
            rolesId: row['roles_id_u'],
            role: {
                id: row['id_r'],
                name: row['name_r'],
                description: row['description_r'],
            }
        }
    }))
}