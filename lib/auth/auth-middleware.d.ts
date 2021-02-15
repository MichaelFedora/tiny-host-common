/// <reference types="qs" />
import { NextFunction, Request, Response } from 'express';
import { AuthDB } from './auth-db';
export declare function validateUserSession(db: AuthDB): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
