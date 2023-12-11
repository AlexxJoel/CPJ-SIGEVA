import { Client } from "../client.dtos";

export const mapClientsResponse = (rows:any): Client[] =>{
    return rows.map((row:any)=> ({
        id: row['id_c'],
        email: row['email_c'],
        phoneNumber: row['phone_number_c'],
        peopleId: row['people_id_c'],
        purchasesCount: row['purchases_count'],
        person: {
            id: row['id_p'],
            name: row['name_p'],
            surname: row['surname_p'],
            lastname:row['lastname_p']
        }
    }))
}