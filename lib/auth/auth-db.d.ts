import { LevelUp } from 'levelup';
import { Handshake, MasterKey, Session, User } from './auth-types';
export declare class AuthDB {
    private scope;
    private sessionExpTime;
    private handshakeExpTime;
    private _db;
    get db(): LevelUp;
    safeGet(key: string): Promise<any>;
    private _onUserDelete;
    get onUserDelete(): import("rxjs").Observable<User>;
    constructor(config: {
        sessionExpTime?: number;
        handshakeExpTime?: number;
    }, db: LevelUp, scope?: string);
    addSession(user: string, scopes?: readonly string[]): Promise<string>;
    getSession(session: string): Promise<Session>;
    delSession(session: string): Promise<void>;
    delManySessions(sessions: readonly string[]): Promise<void>;
    cleanSessions(): Promise<void>;
    getSessionIdsForUser(user: string): Promise<string[]>;
    getSessionsForUser(user: string): Promise<Session[]>;
    addUser(user: User): Promise<string>;
    putUser(id: string, user: User): Promise<void>;
    getUser(id: string): Promise<User>;
    delUser(id: string): Promise<void>;
    getUserFromUsername(username: string): Promise<User>;
    addHandshake(hs: Handshake): Promise<string>;
    putHandshake(id: string, hs: Handshake): Promise<void>;
    getHandshake(id: string): Promise<Handshake>;
    delHandshake(id: string): Promise<void>;
    getHandshakeFromCode(code: string): Promise<Handshake>;
    cleanHandshakes(): Promise<void>;
    addMasterKey(key: MasterKey): Promise<string>;
    putMasterKey(id: string, key: MasterKey): Promise<void>;
    getMasterKey(id: string): Promise<MasterKey>;
    delMasterKey(id: string): Promise<void>;
    getMasterKeysForUser(user: string): Promise<MasterKey[]>;
}
