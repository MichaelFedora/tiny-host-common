"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDB = void 0;
const uuid_1 = require("uuid");
const rxjs_1 = require("rxjs");
class AuthDB {
    constructor(config, db, scope = '') {
        this.scope = scope;
        this.sessionExpTime = 604800000;
        this.handshakeExpTime = 300000; // 5m
        this._onUserDelete = new rxjs_1.Subject();
        if (scope && !scope.endsWith('!!'))
            this.scope = scope + '!!';
        this._db = db;
        if (config.sessionExpTime)
            this.sessionExpTime = config.sessionExpTime;
        if (config.handshakeExpTime)
            this.handshakeExpTime = config.handshakeExpTime;
        this.onUserDelete.subscribe(async (user) => {
            try {
                const sessions = await this.getSessionIdsForUser(user.id);
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
    // sessions
    async addSession(user, scopes = []) {
        let id;
        do {
            id = (0, uuid_1.v4)();
        } while (await this.getSession(id) != null);
        await this.db.put(this.scope + 'session!!' + id, { user, created: Date.now(), scopes });
        return id;
    }
    async getSession(session) {
        const s = await this.safeGet(this.scope + 'session!!' + session);
        if (s)
            s.id = session;
        return s;
    }
    async delSession(session) {
        return await this.db.del(this.scope + 'session!!' + session);
    }
    async delManySessions(sessions) {
        let batch = this.db.batch();
        for (const sess of sessions)
            batch = batch.del(this.scope + 'session!!' + sess);
        await batch.write();
    }
    async cleanSessions() {
        const sessions = [];
        const start = this.scope + 'session!!';
        const end = this.scope + 'session!"';
        await new Promise(res => {
            const stream = this.db.createReadStream({ gt: start, lt: end });
            stream.on('data', ({ key, value }) => {
                if ((value.created + this.sessionExpTime) < Date.now())
                    sessions.push(key.slice(start.length));
            }).on('close', () => res());
        });
        await this.delManySessions(sessions);
    }
    async getSessionIdsForUser(user) {
        const sessions = [];
        const start = this.scope + 'session!!';
        const end = this.scope + 'session!"';
        await new Promise(res => {
            const stream = this.db.createReadStream({ gt: start, lt: end });
            stream.on('data', ({ key, value }) => {
                if (value.user === user)
                    sessions.push(key.slice(start.length));
            }).on('close', () => res());
        });
        return sessions;
    }
    async getSessionsForUser(user) {
        const sessions = [];
        const start = this.scope + 'session!!';
        const end = this.scope + 'session!"';
        await new Promise(res => {
            const stream = this.db.createReadStream({ gt: start, lt: end });
            stream.on('data', ({ key, value }) => {
                if (value.user === user)
                    sessions.push({ id: key.slice(start.length), ...value });
            }).on('close', () => res());
        });
        return sessions;
    }
    // users
    async addUser(user) {
        delete user.id;
        let id;
        do {
            id = (0, uuid_1.v4)();
        } while (await this.getUser(id) != null);
        await this.db.put(this.scope + 'user!!' + id, user);
        return id;
    }
    async putUser(id, user) {
        delete user.id;
        await this.db.put(this.scope + 'user!!' + id, user);
    }
    async getUser(id) {
        const u = await this.safeGet(this.scope + 'user!!' + id);
        if (u)
            u.id = id;
        return u;
    }
    async delUser(id) {
        const u = await this.safeGet(this.scope + 'user!!' + id);
        if (!u)
            return;
        await this.db.del(this.scope + 'user!!' + id);
        this._onUserDelete.next(u);
    }
    async getUserFromUsername(username) {
        let destroyed = false;
        const start = this.scope + 'user!!';
        const end = this.scope + 'user!"';
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
    // handshakes
    async addHandshake(hs) {
        delete hs.id;
        let id;
        do {
            id = (0, uuid_1.v4)();
        } while (await this.getHandshake(id) != null);
        delete hs.code;
        delete hs.user;
        await this.db.put(this.scope + 'handshake!!' + id, hs);
        return id;
    }
    async putHandshake(id, hs) {
        delete hs.id;
        await this.db.put(this.scope + 'handshake!!' + id, hs);
    }
    async getHandshake(id) {
        const u = await this.safeGet(this.scope + 'handshake!!' + id);
        if (u)
            u.id = id;
        return u;
    }
    async delHandshake(id) {
        return await this.db.del(this.scope + 'handshake!!' + id);
    }
    async getHandshakeFromCode(code) {
        let destroyed = false;
        const start = this.scope + 'handshake!!';
        const end = this.scope + 'handshake!"';
        return await new Promise(res => {
            const stream = this.db.createValueStream({ gt: start, lt: end });
            stream.on('data', (value) => {
                if (!destroyed && value.code === code) {
                    destroyed = true;
                    res(value);
                    stream.destroy();
                }
            }).on('close', () => destroyed ? null : res(null));
        });
    }
    async cleanHandshakes() {
        const handshakes = [];
        const start = this.scope + 'handshake!!';
        const end = this.scope + 'handshake!"';
        await new Promise(res => {
            const stream = this.db.createReadStream({ gt: start, lt: end });
            stream.on('data', ({ key, value }) => {
                if ((value.created + this.handshakeExpTime) < Date.now())
                    handshakes.push(key);
            }).on('close', () => res());
        });
        let batch = this.db.batch();
        for (const hs of handshakes)
            batch = batch.del(hs);
        await batch.write();
    }
    // master keys
    async addMasterKey(key) {
        delete key.id;
        let id;
        do {
            id = (0, uuid_1.v4)();
        } while (await this.getMasterKey(id) != null);
        await this.db.put(this.scope + 'masterkey!!' + id, key);
        return id;
    }
    async putMasterKey(id, key) {
        delete key.id;
        await this.db.put(this.scope + 'masterkey!!' + id, key);
    }
    async getMasterKey(id) {
        const key = await this.safeGet(this.scope + 'masterkey!!' + id);
        if (key)
            key.id = id;
        return key;
    }
    async delMasterKey(id) {
        return await this.db.del(this.scope + 'masterkey!!' + id);
    }
    async getMasterKeysForUser(user) {
        const keys = [];
        const start = this.scope + 'masterkey!!';
        const end = this.scope + 'masterkey!"';
        await new Promise(res => {
            const stream = this.db.createReadStream({ gt: start, lt: end });
            stream.on('data', ({ key, value }) => {
                if (value.user === user)
                    keys.push({ id: key.slice(start.length), ...value });
            }).on('close', () => res());
        });
        return keys;
    }
}
exports.AuthDB = AuthDB;
