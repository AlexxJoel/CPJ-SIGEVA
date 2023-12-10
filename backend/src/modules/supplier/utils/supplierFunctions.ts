import { Supplier } from "../supplier.dtos"

export const mapSuppliersResponse = (rows: any): Supplier[] => {
    return rows.map((row: any) => ({
        id: row['id_s'],
        contact: row['contact_s'],
        peopleId: row['people_id_s'],
        person: {
            id: row['id_p'],
            name: row['name_p'],
            surname: row['surname_p'],
            lastname: row['lastname_p']
        }
    }))
}