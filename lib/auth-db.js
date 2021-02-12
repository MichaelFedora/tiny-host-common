"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDB = void 0;
const uuid_1 = require("uuid");
const rxjs_1 = require("rxjs");
class AuthDB {
    constructor(config, db) {
        this.sessionExpTime = 604800000;
        this._onUserDelete = new rxjs_1.Subject();
        this._db = db;
        this.sessionExpTime = config.sessionExpTime;
        this.onUserDelete.subscribe(async (user) => {
            try {
                const sessions = await this.getSessionsForUser(user.id);
                await this.delManySessions(sessions);
            }
            catch (e) {
                console.error('Error deleting sessions for deleted user "' + user.username + '" (' + user.id + ')!');
            }
        });
    }
    get db() { return this._db; }
    async safeGet(key) { return this._db.get(key).catch(e => { if (e.notFound)
        return null;
    else
        throw e; }); }
    get onUserDelete() { return this._onUserDelete.asObservable(); }
    // auth
    async addSession(user, scopes = ['/']) {
        let id;
        do {
            id = uuid_1.v4();
        } while (await this.getSession(id) != null);
        await this.db.put('session!!' + id, { user, created: Date.now(), scopes });
        return id;
    }
    async getSession(session) {
        const s = await this.safeGet('session!!' + session);
        if (s)
            s.id = session;
        return s;
    }
    async delSession(session) {
        return await this.db.del('session!!' + session);
    }
    async delManySessions(sessions) {
        let batch = this.db.batch();
        for (const sess of sessions)
            batch = batch.del('session!!' + sess);
        await batch.write();
    }
    async cleanSessions() {
        const sessions = [];
        const start = 'session!!';
        const end = 'session!"';
        await new Promise(res => {
            const stream = this.db.createReadStream({ gt: start, lt: end });
            stream.on('data', ({ key, value }) => {
                if ((value.created + this.sessionExpTime) > Date.now())
                    sessions.push(key.slice(0, start.length));
            }).on('close', () => res());
        });
        await this.delManySessions(sessions);
    }
    async getSessionsForUser(user) {
        const sessions = [];
        const start = 'session!!';
        const end = 'session!"';
        await new Promise(res => {
            const stream = this.db.createReadStream({ gt: start, lt: end });
            stream.on('data', ({ key, value }) => {
                if (value.user === user)
                    sessions.push(key.slice(0, start.length));
            }).on('close', () => res());
        });
        return sessions;
    }
    async addUser(user) {
        delete user.id;
        let id;
        do {
            id = uuid_1.v4();
        } while (await this.getUser(id) != null);
        await this.db.put('user!!' + id, user);
        return id;
    }
    async putUser(id, user) {
        delete user.id;
        await this.db.put('user!!' + id, user);
    }
    async getUser(id) {
        const u = await this.safeGet('user!!' + id);
        if (u)
            u.id = id;
        return u;
    }
    async delUser(id) {
        const u = await this.safeGet('user!!' + id);
        if (!u)
            return;
        await this.db.del('user!!' + id);
        this._onUserDelete.next(u);
    }
    async getUserFromUsername(username) {
        let destroyed = false;
        const start = 'user!!';
        const end = 'user!"';
        return await new Promise(res => {
            const stream = this.db.createReadStream({ gt: start, lt: end });
            stream.on('data', ({ key, value }) => {
                if (!destroyed && value.username === username) {
                    destroyed = true;
                    res(Object.assign({ id: key.slice(start.length) }, value));
                    stream.destroy();
                }
            }).on('close', () => destroyed ? null : res(null));
        });
    }
}
exports.AuthDB = AuthDB;
