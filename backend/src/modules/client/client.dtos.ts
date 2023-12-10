import { Person } from "../person/person.dtos";

export type Client ={
    id?:number;
    email:string;
    phoneNumber:number;
    peopleId: number;
    person:Person;
}