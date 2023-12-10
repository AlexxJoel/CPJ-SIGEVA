import { PersonBoundary } from "../person/person.boundary";

export type Supplier = {
    id?: number;
    contact: string;
    peopleId: number;
    person: PersonBoundary
}