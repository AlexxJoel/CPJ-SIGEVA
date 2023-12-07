export type AuthLoginDto =  {
    username: string;
    password: string;
}

export type AuthUserDto =  {
    id: number;
    name: string;
    username: string;
    password: string | undefined;
    email: string;
    isManager: boolean;
    status: boolean;
}