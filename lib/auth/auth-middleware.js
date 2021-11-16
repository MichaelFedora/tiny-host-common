"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserSession = void 0;
const errors_1 = require("../errors");
const middleware_1 = require("../middleware");
function validateUserSession(db) {
    return (0, middleware_1.wrapAsync)(async function (req, res, next) {
        try {
            const session = await db.getSession(String(req.query.sid || '') || '');
            if (!session)
                throw new errors_1.AuthError('No session found!');
            req.session = session;
            const user = await db.getUser(session.user);
            if (!user)
                throw new errors_1.AuthError('No user found!');
            req.user = user;
        }
        catch (e) {
            return (0, middleware_1.handleValidationError)(e, req, res, next);
        }
        next();
    });
}
exports.validateUserSession = validateUserSession;
