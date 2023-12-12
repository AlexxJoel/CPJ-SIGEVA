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