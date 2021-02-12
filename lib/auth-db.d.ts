import { LevelUp } from 'levelup';
import { Session, User } from './types';
export declare class AuthDB {
    private scope;
    private sessionExpTime;
    private _db;
    get db(): LevelUp;
    safeGet(key: string): Promise<any>;
    private _onUserDelete;
    get onUserDelete(): import("rxjs").Observable<User>;
    constructor(config: {
        sessionExpTime: number;
    }, db: LevelUp, scope?: string);
    addSession(user: string, scopes?: string[]): Promise<string>;
    getSession(session: string): Promise<Session>;
    delSession(session: string): Promise<void>;
    delManySessions(sessions: readonly string[]): Promise<void>;
    cleanSessions(): Promise<void>;
    getSessionsForUser(user: string): Promise<string[]>;
    addUser(user: User): Promise<string>;
    putUser(id: string, user: User): Promise<void>;
    getUser(id: string): Promise<User>;
    delUser(id: string): Promise<void>;
    getUserFromUsername(username: string): Promise<User>;
}
