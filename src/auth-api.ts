import { randomBytes } from 'crypto';
import { json, Router } from 'express';

import { AuthError, MalformedError, NotAllowedError } from './errors';
import { handleError, handleValidationError, validateUserSession, wrapAsync } from './middleware';

import { User } from './types';
import { hash } from './util';

import { AuthDB } from './auth-db';

class AuthApi {

  constructor() { }

  init(config: {
    whitelist?: string[]
  },
  db: AuthDB,
  onUserDelete = async (user: User) => null,
  router = Router()) {

    const validateSession = validateUserSession(db);

    // auth

    const authRouter = Router();

    authRouter.post('/login', json(), wrapAsync(async (req, res) => {
      if(config.whitelist && !config.whitelist.includes(req.body.username))
        throw new AuthError('Whitelist is active.');

      if(!req.body.scopes || !(req.body.scopes instanceof Array))
        throw new AuthError('Must provide scope(s)!');

      const user = await db.getUserFromUsername(req.body.username);
      if(!user)
        throw new AuthError('Username / password mismatch.');

      const pass = await hash(user.salt, req.body.password);
      if(user.pass !== pass)
        throw new AuthError('Username / password mismatch.');

      res.send(await db.addSession(user.id, req.body.scopes ));
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
      if(!req.body.password || !req.body.newpass)
        throw new MalformedError('Body must have a password, and a newpass.');

      if(await hash(req.user.salt, req.body.password) !== req.user.pass)
        throw new NotAllowedError('Password mismatch.');

      const salt = randomBytes(128).toString('hex');
      const pass = hash(salt, req.body.newpass);

      await db.putUser(req.user.id, Object.assign(req.user, { salt, pass }));
      const sessions = await db.getSessionsForUser(req.user.id);
      await db.delManySessions(sessions.filter(a => a !== req.session.id));
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

    router.use('/auth', authRouter, handleError('auth'));


    router.get('/self', validateSession, wrapAsync(async (req, res) => {
      res.json({ id: req.user.id, username: req.user.username });
    }), handleError('get-self'));

    router.delete('/self', validateSession, wrapAsync(async (req, res) => {
      if(req.user) {
        await db.delUser(req.user.id);
        await onUserDelete(req.user);
      }
      res.sendStatus(204);
    }), handleError('delete-self'));
  }
}

export default new AuthApi();
