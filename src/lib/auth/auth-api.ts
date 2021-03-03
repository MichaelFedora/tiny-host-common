import { randomBytes } from 'crypto';
import { json, Router } from 'express';

import { AuthError, MalformedError, NotAllowedError, NotFoundError } from '../errors';
import { handleError, handleValidationError, wrapAsync } from '../middleware';

import { validateUserSession } from './auth-middleware';
import { User } from './auth-types';
import { hash } from './auth-util';

import { AuthDB } from './auth-db';

export class AuthApi {

  private _router: Router;
  get router() { return this._router; }

  private validateScopes(scopes: string, requireScopes = false) {
    let ret: string[];

    try {
      ret = JSON.parse(scopes);
      if(!(ret instanceof Array) || (requireScopes  && !ret.length) || ret.findIndex(a => !a.startsWith('/')) >= 0)
        throw new Error();

    } catch(e) {
      throw new MalformedError('Could not parse scopes query; should be a JSON array of paths that start with "/".');
    }

    return ret;
  }

  constructor(config: {
    whitelist?: string[]
    requireScopes?: boolean,
    allowHandshakes?: boolean,
    allowMasterKeys?: boolean,
    handshakeExpTime?: number,
  },
  db: AuthDB,
  router = Router()) {

    config = Object.assign({ requireScopes: true, allowHandshakes: true, allowMasterKeys: true, handshakeExpTime: 300000 }, config);

    this._router = router;

    const validateSession = validateUserSession(db);

    router.get('/type', (_, res) => res.send(''));

    // auth

    const authRouter = Router();

    authRouter.post('/login', json(), wrapAsync(async (req, res) => {
      if(config.whitelist && !config.whitelist.includes(req.body.username))
        throw new AuthError('Whitelist is active.');

      const user = await db.getUserFromUsername(req.body.username);
      if(!user)
        throw new AuthError('Username / password mismatch.');

      const pass = await hash(user.salt, req.body.password);
      if(user.pass !== pass)
        throw new AuthError('Username / password mismatch.');

      res.send(await db.addSession(user.id, ['!user', '/']));
    }), handleValidationError);

    authRouter.post('/register', json(), wrapAsync(async (req, res) => {
      if(!req.body.username || !req.body.password)
        throw new MalformedError('Must have a username and password!');

      if(config.whitelist && !config.whitelist.includes(req.body.username))
        throw new NotAllowedError('Whitelist is active.');

      if(await db.getUserFromUsername(req.body.username))
        throw new NotAllowedError('Username taken!');

      const salt = randomBytes(128).toString('hex');
      const user: User = {
        username: req.body.username,
        salt,
        pass: await hash(salt, req.body.password)
      };

      await db.addUser(user);
      res.sendStatus(204);
    }));

    authRouter.post('/change-pass', validateSession, json(), wrapAsync(async (req, res) => {
      if(!req.session.scopes.includes('!user'))
        throw new NotAllowedError('Must be a user!');

      if(!req.body.password || !req.body.newpass)
        throw new MalformedError('Body must have a password, and a newpass.');

      if(await hash(req.user.salt, req.body.password) !== req.user.pass)
        throw new NotAllowedError('Password mismatch.');

      const salt = randomBytes(128).toString('hex');
      const pass = await hash(salt, req.body.newpass);

      await db.putUser(req.user.id, Object.assign(req.user, { salt, pass }));
      const sessions = await db.getSessionIdsForUser(req.user.id);
      await db.delManySessions(sessions.filter(a => a !== req.session.id));
    }));

    authRouter.get('/sessions', validateSession, wrapAsync(async (req, res) => {
      if(!req.session.scopes.includes('!user'))
        throw new NotAllowedError('Must be a user!');

      const sessions = await db.getSessionsForUser(req.user.id);
      for(const sess of sessions)
        delete sess.user;

      res.json(sessions);
    }));

    authRouter.delete('/sessions/:id', validateSession, wrapAsync(async (req, res) => {
      if(!req.session.scopes.includes('!user'))
        throw new NotAllowedError('Must be a user!');

      const sess = await db.getSession(req.params.id);
      if(!sess || sess.user !== req.user.id) throw new NotFoundError('No session found with the id ' + req.params.id + ' for user ' + req.user.username + '!');
      await db.delSession(sess.id);
      res.sendStatus(204);
    }));

    authRouter.delete('/sessions', validateSession, wrapAsync(async (req, res) => {
      if(!req.session.scopes.includes('!user'))
        throw new NotAllowedError('Must be a user!');

      const sessions = await db.getSessionIdsForUser(req.params.id);
      await db.delManySessions(sessions.filter(a => a !== req.session.id));
      res.sendStatus(204);
    }));

    authRouter.post('/logout', validateSession, wrapAsync(async (req, res) => {
      await db.delSession(req.session.id);
      res.sendStatus(204);
    }));

    authRouter.get('/refresh', validateSession, wrapAsync(async (req, res) => {
      const sess = await db.addSession(req.user.id, req.session.scopes);
      await db.delSession(req.session.id);
      res.json(sess);
    }));

    if(config.allowHandshakes) {

      const handshakeRouter = Router();

      handshakeRouter.get('/start', wrapAsync(async (req, res) => {

        if(!req.query.redirect || typeof req.query.redirect !== 'string' ||
          (req.query.scopes ? typeof req.query.scopes !== 'string' : config.requireScopes))
          throw new MalformedError('Must have ?redirect={url}<&scopes=["/scopes"]> query.');

        const info = {
          redirect: req.query.redirect,
          scopes: null as string[],
          created: Date.now()
        };

        if(req.query.scopes) {
          info.scopes = this.validateScopes(req.query.scopes as string);
        } else
          delete info.scopes;

        const hsId = await db.addHandshake(info);

        res.redirect(`/handshake?handshake=${hsId}${req.query.username ? '&username=' + String(req.query.username) : ''}`);
      }))

      handshakeRouter.use('/:id', validateSession, wrapAsync(async (req, res, next) => {
        if(!req.session.scopes.includes('!user'))
          throw new NotAllowedError('Must be a user!');

        req.handshake = await db.getHandshake(req.params.id);
        if(!req.handshake)
          throw new NotFoundError('No handshake found with id "' + req.params.id + '"!');


        if(req.handshake.created + config.handshakeExpTime < Date.now()) {
          await db.delHandshake(req.handshake.id);
          throw new NotFoundError('Handshake expired!');
        }

        next();
      }));

      handshakeRouter.get('/:id', wrapAsync(async (req, res) => {
        if(!req.session.scopes.includes('!user'))
          throw new NotAllowedError('Must be a user!');

        res.json({
          redirect: req.handshake.redirect,
          scopes: req.handshake.scopes
        });
      }));

      handshakeRouter.get('/:id/approve', wrapAsync(async (req, res) => {
        if(!req.session.scopes.includes('!user'))
          throw new NotAllowedError('Must be a user!');

        let code: string;
        do {
          code = randomBytes(24).toString('hex');
        } while(await db.getHandshakeFromCode(code) != null);


        const info = {
          user: req.user.id,
          code
        };

        await db.putHandshake(req.handshake.id, Object.assign(req.handshake, info));

        res.redirect(req.handshake.redirect + '?code=' + code);
      }));

      handshakeRouter.get('/:id/cancel', wrapAsync(async (req, res) => {
        if(!req.session.scopes.includes('!user'))
          throw new NotAllowedError('Must be a user!');

        await db.delHandshake(req.handshake.id);
        res.redirect(req.handshake.redirect + '?error=access_denied');
      }));

      authRouter.use('/handshake', handshakeRouter);

      authRouter.post('/session', wrapAsync(async (req, res) => {
        if(!req.body.redirect || !(!config.requireScopes || req.body.scopes) || !req.body.code)
          throw new MalformedError('Body should contain: { app, redirect, scopes, code }!');

        const handshake = await db.getHandshakeFromCode(req.body.code);
        if(!handshake)
          throw new NotFoundError('Handshake not found with given code!');

        await db.delHandshake(handshake.id);
        if(handshake.redirect !== req.body.redirect || handshake.scopes !== req.body.scopes)
          throw new MalformedError('Handshake/body mismatch.');

        const user = await db.getUser(handshake.user);
        if(!user)
          throw new NotFoundError('User not found!');

        const session = await db.addSession(user.id, handshake.scopes);
        res.json(session);
      }));
    }

    if(config.allowMasterKeys) {

      const masterKeyRouter = Router();

      masterKeyRouter.get('', validateSession, wrapAsync(async (req, res) => {
        if(!req.session.scopes.includes('!user'))
          throw new NotAllowedError('Must be a user!');

        res.json(await db.getMasterKeysForUser(req.user.id));
      }));

      masterKeyRouter.post('', validateSession, wrapAsync(async (req, res) => {
        if(!req.session.scopes.includes('!user'))
          throw new NotAllowedError('Must be a user!');

        const name = ((req.query.name && typeof req.query.name === 'string') ? String(req.query.name) : '') || 'Unknown';
        res.json(await db.addMasterKey({ user: req.user.id, name }));
      }));

      masterKeyRouter.put('/:id', validateSession, json(), wrapAsync(async (req, res) => {
        if(!req.session.scopes.includes('!user'))
          throw new NotAllowedError('Must be a user!');

        if(!req.body || !req.body.name || typeof req.body.name !== 'string')
          throw new MalformedError('Body should be { name: string }!');

        const masterkey = await db.getMasterKey(req.params.id);
        if(!masterkey || masterkey.user !== req.user.id)
          throw new NotFoundError('Master key not found!');

        await db.putMasterKey(req.params.id, Object.assign({ }, masterkey, { name: req.body.name }));
        res.sendStatus(204);
      }));

      masterKeyRouter.delete('/:id', validateSession, wrapAsync(async (req ,res) => {
        if(!req.session.scopes.includes('!user'))
          throw new NotAllowedError('Must be a user!');

        const masterkey = await db.getMasterKey(req.params.id);
        if(!masterkey || masterkey.user !== req.user.id)
          throw new NotFoundError('Master key not found!');

        await db.delMasterKey(masterkey.id);
        res.sendStatus(204);
      }));

      authRouter.use('/master-key', masterKeyRouter, handleError('auth-master-key'));

      authRouter.post('/generate-session', wrapAsync(async (req, res) => {
        if(!req.query.key || typeof req.query.key !== 'string')
          throw new MalformedError('?key=.. required!');

        if(req.query.scopes ? typeof req.query.scopes !== 'string' : config.requireScopes)
          throw new MalformedError('?scopes=[..] required!');

        let scopes: string[];

        if(req.query.scopes)
          scopes = this.validateScopes(req.query.scopes as string);

        const masterkey = await db.getMasterKey(String(req.query.string));
        if(!masterkey)
          throw new NotFoundError('Master key not found!');

        const user = await db.getUser(masterkey.user);
        if(!user)
          throw new NotFoundError('User not found!');

        res.json(await db.addSession(user.id, scopes));
      }));
    }

    router.use('/auth', authRouter, handleError('auth'));

    router.get('/self', validateSession, wrapAsync(async (req, res) => {
      res.json({ id: req.user.id, username: req.user.username });
    }), handleError('get-self'));

    router.delete('/self', validateSession, wrapAsync(async (req, res) => {
      if(!req.session.scopes.includes('!user'))
        throw new NotAllowedError('Must be a user!');

      if(!req.query.pass || typeof req.query.pass !== 'string')
        throw new MalformedError('?pass=.. required!');

      if(await hash(req.user.salt, req.query.pass) !== req.user.pass)
        throw new NotAllowedError('Password does not match!');

      await db.delUser(req.user.id);
      res.sendStatus(204);
    }), handleError('delete-self'));

  }
}
