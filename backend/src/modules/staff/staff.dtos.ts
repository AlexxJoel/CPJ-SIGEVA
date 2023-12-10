import { PersonBoundary } from "../person/person.boundary";
import { UserBoundary } from "../user/user.boundary";

export type Staff = {
    id?: number;
    birthday: string;
    email: string;
    status?: boolean;
    isManager?: boolean;
    peopleId: number;
    person?: PersonBoundary;
    user?: UserBoundary;
}