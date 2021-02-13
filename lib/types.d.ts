export interface Session {
    id?: string;
    user: string;
    scopes: readonly string[];
    readonly created: number;
}
export interface User {
    id?: string;
    readonly username: string;
    pass: string;
    salt: string;
}
export interface Config {
    readonly sessionExpTime: number;
    readonly whitelist?: string[];
}
