export declare class AuthError extends Error {
    type: string;
    constructor(message?: string);
}
export declare class NotFoundError extends Error {
    type: string;
    constructor(message?: string);
}
export declare class NotAllowedError extends Error {
    type: string;
    constructor(message?: string);
}
export declare class MalformedError extends Error {
    type: string;
    constructor(message?: string);
}
export declare class MultiError extends Error {
    type: string;
    errors: Error[];
    constructor(errors: Error[], message?: string);
}
