"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.handleValidationError = exports.wrapAsync = exports.parseTrue = void 0;
const errors_1 = require("./errors");
const trueArray = ['true', '1', 'yes'];
function parseTrue(query) {
    return trueArray.includes(String(query).toLocaleLowerCase());
}
exports.parseTrue = parseTrue;
function wrapAsync(func) {
    return function (req, res, next) {
        func(req, res, next).catch(next);
    };
}
exports.wrapAsync = wrapAsync;
function handleValidationError(err, req, res, next) {
    if (!err) {
        next();
        return;
    }
    if (err instanceof errors_1.AuthError) {
        res.status(403).json({ message: err.message });
    }
    else {
        console.error('Error validating token:', err);
        res.status(500).json({ message: 'Failed to validate token.' });
    }
}
exports.handleValidationError = handleValidationError;
function handleError(action, debug = false) {
    return function (err, req, res, next) {
        if (!err) {
            next();
            return;
        }
        if (debug)
            console.error('[debug]', err);
        if (err instanceof errors_1.NotFoundError) {
            res.sendStatus(404);
            return;
        }
        else if (err instanceof errors_1.NotAllowedError) {
            res.status(403).json({ message: err.message });
            return;
        }
        else if (err instanceof errors_1.MalformedError) {
            res.status(400).json({ message: err.message });
            return;
        }
        else if (err.type) {
            switch (err.type) {
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
exports.handleError = handleError;
