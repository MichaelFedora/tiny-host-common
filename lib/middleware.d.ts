import { NextFunction, Request, Response } from 'express';
export declare function parseTrue(query: any): boolean;
export declare function wrapAsync(func: (req: Request, res?: Response, next?: NextFunction) => Promise<any>): (req: Request, res: Response, next: NextFunction) => void;
export declare function handleValidationError(err: any, req: Request, res: Response, next: NextFunction): void;
export declare function handleError(action: string, debug?: boolean): (err: any, req: Request, res: Response, next: NextFunction) => void;
