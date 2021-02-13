import { LevelUp } from 'levelup';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

import { Session, User } from './types';

export class AuthDB {

  private sessionExpTime = 604800000;

  private _db: LevelUp;
  public get db(): LevelUp { return this._db; }
  public async safeGet(key: string): Promise<any> { return this._db.get(key).catch(e => { if(e.notFound) return null; else throw e; }); }

  private _onUserDelete = new Subject<User>();
  public get onUserDelete() { return this._onUserDelete.asObservable(); }

  constructor(
    config: { sessionExpTime: number },
    db: LevelUp,
    private scope = '') {
    if(scope && !scope.endsWith('!!'))
      this.scope = scope + '!!';

    this._db = db;
    this.sessionExpTime = config.sessionExpTime;
    this.onUserDelete.subscribe(async user => {
      try {
        const sessions = await this.getSessionsForUser(user.id);
        await this.delManySessions(sessions);
      } catch(e) {
        console.error('Error deleting sessions for deleted user "' + user.username + '" (' + user.id + ')!');
      }
    });
  }

  // auth

  async addSession(user: string, scopes: readonly string[] = ['/']): Promise<string> {
    let id: string;
    do {
      id = v4();
    } while(await this.getSession(id) != null);
    await this.db.put(this.scope + 'session!!' + id, { user, created: Date.now(), scopes });
    return id;
  }

  async getSession(session: string): Promise<Session> {
    const s = await this.safeGet(this.scope + 'session!!' + session);
    if(s) s.id = session;
    return s;
  }

  async delSession(session: string): Promise<void> {
    return await this.db.del(this.scope + 'session!!' + session);
  }

  async delManySessions(sessions: readonly string[]): Promise<void> {
    let batch = this.db.batch();
    for(const sess of sessions)
      batch = batch.del(this.scope + 'session!!' + sess);
    await batch.write();
  }

  async cleanSessions(): Promise<void> {
    const sessions: string[] = [];
    const start = this.scope + 'session!!';
    const end = this.scope + 'session!"'
    await new Promise<void>(res => {
      const stream = this.db.createReadStream({ gt: start, lt: end });
      stream.on('data', ({ key, value }: { key: string, value: Session }) => {
        if((value.created + this.sessionExpTime) > Date.now())
          sessions.push(key.slice(0, start.length));
      }).on('close', () => res());
    });
    await this.delManySessions(sessions);
  }

  async getSessionsForUser(user: string): Promise<string[]> {
    const sessions: string[] = [];
    const start = this.scope + 'session!!';
    const end = this.scope + 'session!"'
    await new Promise<void>(res => {
      const stream = this.db.createReadStream({ gt: start, lt: end });
      stream.on('data', ({ key, value }: { key: string, value: Session }) => {
        if(value.user === user)
          sessions.push(key.slice(0, start.length));
      }).on('close', () => res());
    });
    return sessions;
  }

  async addUser(user: User): Promise<string> {
    delete user.id;

    let id: string;
    do {
      id = v4();
    } while(await this.getUser(id) != null);
    await this.db.put(this.scope + 'user!!' + id, user);
    return id;
  }

  async putUser(id: string, user: User): Promise<void> {
    delete user.id;

    await this.db.put(this.scope + 'user!!' + id, user);
  }

  async getUser(id: string): Promise<User> {
    const u = await this.safeGet(this.scope + 'user!!' + id);
    if(u) u.id = id;
    return u;
  }

  async delUser(id: string): Promise<void> {
    const u = await this.safeGet(this.scope + 'user!!' + id);
    if(!u) return;
    await this.db.del(this.scope + 'user!!' + id);
    this._onUserDelete.next(u);
  }

  async getUserFromUsername(username: string): Promise<User> {
    let destroyed = false;
    const start = this.scope + 'user!!';
    const end = this.scope + 'user!"'
    return await new Promise<User>(res => {
      const stream = this.db.createReadStream({ gt: start, lt: end });
      stream.on('data', ({ key, value }) => {
        if(!destroyed && value.username === username) {
          destroyed = true;
          res(Object.assign({ id: key.slice(start.length) }, value));
          (stream as any).destroy();
        }
      }).on('close', () => destroyed ? null : res(null));
    });
  }
}
