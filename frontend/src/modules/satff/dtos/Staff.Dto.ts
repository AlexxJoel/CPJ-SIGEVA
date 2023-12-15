import type { person } from "@/modules/client/Client.Dto"

export type Staff = {
    id: number,
    birthday: string,
    email: string,
    person: Array<person>
    user: Array<user>
}

export type user = {
        id: number,
        username: string,
        password: string,
        rolesId: number
}

export type CompleteUser = user & {
    status: boolean;
    staffId: number;
    role: {
        id: number;
        name: string;
        description: string
    }
}

export type SelectedStaff = {
    id: number;
   birthday: string;
   email: string;
   status: boolean;
   isManager: boolean;
   peopleId: number;
   person: person;
   user: CompleteUser
}