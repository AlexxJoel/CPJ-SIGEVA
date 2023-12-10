import { RoleBoundary } from "../role/role.boundary";

export type User = {
    id?: number;
    username: string;
    password: string;
    status?: boolean;
    staffId: number;
    rolesId: number;
    role?: RoleBoundary;
}