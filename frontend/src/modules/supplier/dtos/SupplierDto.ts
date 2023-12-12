export type SupplierDto = {
    id: Number,
    contact: String,
    peopleId: Number,
    person: {
        id?: Number,
        name: String,
        surname: String,
        lastname: String
    }
}

export type UpdateSupplierDto = {
    id: Number,
    contact: String,
    name: String,
    surname: String,
    lastname: String
}