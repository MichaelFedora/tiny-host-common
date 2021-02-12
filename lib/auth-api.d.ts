import { Router } from 'express';
import { AuthDB } from './auth-db';
export declare class AuthApi {
    private _router;
    get router(): Router;
    constructor(config: {
        whitelist?: string[];
    }, db: AuthDB, router?: import("express-serve-static-core").Router);
}
