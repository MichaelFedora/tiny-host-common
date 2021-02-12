import { User } from './types';
import { AuthDB } from './auth-db';
declare class AuthApi {
    constructor();
    init(config: {
        whitelist?: string[];
    }, db: AuthDB, onUserDelete?: (user: User) => Promise<any>, router?: import("express-serve-static-core").Router): void;
}
declare const _default: AuthApi;
export default _default;
