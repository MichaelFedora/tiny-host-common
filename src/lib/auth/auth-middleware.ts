import { NextFunction, Request, Response } from 'express';

import { AuthError  } from '../errors';
import { handleValidationError, wrapAsync } from '../middleware';

import { AuthDB } from './auth-db';

export function validateUserSession(db: AuthDB) {
  return wrapAsync(async function(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await db.getSession(String(req.query.sid || '') || '');
      if(!session)
        throw new AuthError('No session found!');

      req.session = session;

      const user = await db.getUser(session.user);
      if(!user)
        throw new AuthError('No user found!');

      req.user = user;

    } catch(e) {
      return handleValidationError(e, req, res, next);
    }
    next();
  });
}
