declare module 'express' {
    interface Request {
        user?: import('./auth-types').User;
        handshake?: import('./auth-types').Handshake;
        session?: import('./auth-types').Session;
    }
}
declare module 'express-serve-static-core' {
    interface Request {
        user?: import('./auth-types').User;
        handshake?: import('./auth-types').Handshake;
        session?: import('./auth-types').Session;
    }
}
import { AuthApi } from './auth-api';
import { AuthDB } from './auth-db';
import { User, Session, Handshake, MasterKey, Config as AuthConfig } from './auth-types';
import { validateUserSession } from './auth-middleware';
export { AuthApi, AuthDB, User, Session, Handshake, MasterKey, AuthConfig, validateUserSession, };
