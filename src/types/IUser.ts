export interface IUser {
    login: string,
    id?: number | undefined,
    role: 'user' | 'admin' | null,
    name?: string, 
    password?: string
}