export type ResponseApi<T> = {
    code: number;
    error: boolean;
    message: string;
    data: T;
}