import { NextFunction, Request, Response } from 'express';

import { AuthError, MalformedError, NotAllowedError, NotFoundError } from './errors';

const trueArray = ['true', '1', 'yes'];

export function parseTrue(query: any): boolean {
  return trueArray.includes(String(query).toLocaleLowerCase())
}

export function wrapAsync(func: (req: Request, res?: Response, next?: NextFunction) => Promise<any>) {
  return function(req: Request, res: Response, next: NextFunction) {
    func(req, res, next).catch(next);
  };
}

export function handleValidationError(err: any, req: Request, res: Response, next: NextFunction) {
  if(!err) {
    next();
    return;
  }

  if(err instanceof AuthError) {
    res.status(403).json({ message: err.message });
  } else {
    console.error('Error validating token:', err);
    res.status(500).json({ message: 'Failed to validate token.' });
  }
}

export function handleError(action: string, debug = false) {
  return function(err: any, req: Request, res: Response, next: NextFunction) {
    if(!err) {
      next();
      return;
    }

    if(debug)
      console.error('[debug]', err);

    if(err instanceof NotFoundError) {
      res.sendStatus(404);
      return;
    } else if(err instanceof NotAllowedError) {
      res.status(403).json({ message: err.message });
      return;
    } else if(err instanceof MalformedError) {
      res.status(400).json({ message: err.message });
      return;
    } else if(err.type) {
      switch(err.type) {
        case 'not_found_error':
          res.sendStatus(404);
          return;
        case 'not_allowed_error':
          res.sendStatus(403).json({ message: err.message });
          return;
        case 'malformed_error':
          res.status(400).json({ message: err.message });
          return;
      }
    }

    console.error(`Error performing ${action}: `, err);
    res.status(500).json({ message: `Failed to perform ${action}.` });
  };
}
