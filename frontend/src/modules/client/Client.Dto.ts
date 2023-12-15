export type Client = {
    id:number,
    phoneNumber: number,
    email: string,
    person: Array<person>
}

export type person = {
    id:number,
    name:string,
    surname:string,
    lastname:string
}

export type SelectedClient = {
    id: number;
    email: string;
    peopleId: number;
    phoneNumber: string;
    purchasesCount: number;
    person: person
}