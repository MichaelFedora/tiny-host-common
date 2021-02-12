"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiError = exports.MalformedError = exports.NotAllowedError = exports.NotFoundError = exports.AuthError = void 0;
class AuthError extends Error {
    constructor(message) {
        super(message);
        this.type = 'auth_error';
    }
}
exports.AuthError = AuthError;
class NotFoundError extends Error {
    constructor(message) {
        super(message || 'Not found');
        this.type = 'not_found_error';
    }
}
exports.NotFoundError = NotFoundError;
class NotAllowedError extends Error {
    constructor(message) {
        super(message || 'Forbidden');
        this.type = 'not_allowed_error';
    }
}
exports.NotAllowedError = NotAllowedError;
class MalformedError extends Error {
    constructor(message) {
        super(message || 'Malformed');
        this.type = 'malformed_error';
    }
}
exports.MalformedError = MalformedError;
class MultiError extends Error {
    constructor(errors, message) {
        super(message || 'MultiError' + 'See: ' + errors.map(a => a.message).join('\n'));
        this.type = 'multi_error';
    }
}
exports.MultiError = MultiError;
