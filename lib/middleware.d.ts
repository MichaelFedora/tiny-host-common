/// <reference types="qs" />
import { NextFunction, Request, Response } from 'express';
import { AuthDB } from './auth-db';
export declare function parseTrue(query: any): boolean;
export declare function wrapAsync(func: (req: Request, res?: Response, next?: NextFunction) => Promise<any>): (req: Request, res: Response, next: NextFunction) => void;
export declare function handleValidationError(err: any, req: Request, res: Response, next: NextFunction): void;
export declare function handleError(action: string): (err: any, req: Request, res: Response, next: NextFunction) => void;
export declare function validateUserSession(db: AuthDB): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
