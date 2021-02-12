declare module 'express' {
  interface Request {
    user?: import('./types').User;
    session: import('./types').Session;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: import('./types').User;
    session: import('./types').Session;
  }
}

import { AuthApi } from './auth-api';
import { AuthDB } from './auth-db';
import { User, Session, Config as AuthConfig } from './types';
import { validateUserSession, handleError, handleValidationError, wrapAsync } from './middleware';
import { AuthError, NotFoundError, NotAllowedError, MalformedError } from './errors';

export {
  AuthApi,
  AuthDB,
  User,
  Session,
  AuthConfig,
  validateUserSession,
  handleError,
  handleValidationError,
  wrapAsync,
  AuthError,
  NotFoundError,
  NotAllowedError,
  MalformedError
};
