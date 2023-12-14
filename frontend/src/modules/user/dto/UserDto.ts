export type UserDto = {
    id: number,
    username: string,
    password: string,
    status: boolean,
    staffId: number,
    rolesId: number,
    role: {
        id: number,
        name: string,
        description: string
    }
}