import { Client } from "../client.dtos";

export const mapClientsResponse = (rows:any): Client[] =>{
    return rows.map((row:any)=> ({
        id: row['id_c'],
        email: row['email_c'],
        phoneNombre: row['phone_number_c'],
        peopleId: row['people_id_c'],
        person: {
            id: row['id_p'],
            name: row['name_p'],
            surname: row['surname_p'],
            lastname:row['lastname_p']
        }
    }))
}