"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthApi = void 0;
const crypto_1 = require("crypto");
const express_1 = require("express");
const errors_1 = require("./errors");
const middleware_1 = require("./middleware");
const util_1 = require("./util");
class AuthApi {
    constructor(config, db, router = express_1.Router()) {
        this._router = router;
        const validateSession = middleware_1.validateUserSession(db);
        // auth
        const authRouter = express_1.Router();
        authRouter.post('/login', express_1.json(), middleware_1.wrapAsync(async (req, res) => {
            if (config.whitelist && !config.whitelist.includes(req.body.username))
                throw new errors_1.AuthError('Whitelist is active.');
            if (config.requireScopes && (!req.body.scopes || !(req.body.scopes instanceof Array)))
                throw new errors_1.AuthError('Must provide scope(s)!');
            const user = await db.getUserFromUsername(req.body.username);
            if (!user)
                throw new errors_1.AuthError('Username / password mismatch.');
            const pass = await util_1.hash(user.salt, req.body.password);
            if (user.pass !== pass)
                throw new errors_1.AuthError('Username / password mismatch.');
            res.send(await db.addSession(user.id, req.body.scopes));
        }), middleware_1.handleValidationError);
        authRouter.post('/register', express_1.json(), middleware_1.wrapAsync(async (req, res) => {
            if (!req.body.username || !req.body.password)
                throw new errors_1.MalformedError('Must have a username and password!');
            if (config.whitelist && !config.whitelist.includes(req.body.username))
                throw new errors_1.NotAllowedError('Whitelist is active.');
            if (await db.getUserFromUsername(req.body.username))
                throw new errors_1.NotAllowedError('Username taken!');
            const salt = crypto_1.randomBytes(128).toString('hex');
            const user = {
                username: req.body.username,
                salt,
                pass: await util_1.hash(salt, req.body.password)
            };
            await db.addUser(user);
            res.sendStatus(204);
        }));
        authRouter.post('/change-pass', validateSession, express_1.json(), middleware_1.wrapAsync(async (req, res) => {
            if (!req.body.password || !req.body.newpass)
                throw new errors_1.MalformedError('Body must have a password, and a newpass.');
            if (await util_1.hash(req.user.salt, req.body.password) !== req.user.pass)
                throw new errors_1.NotAllowedError('Password mismatch.');
            const salt = crypto_1.randomBytes(128).toString('hex');
            const pass = util_1.hash(salt, req.body.newpass);
            await db.putUser(req.user.id, Object.assign(req.user, { salt, pass }));
            const sessions = await db.getSessionsForUser(req.user.id);
            await db.delManySessions(sessions.filter(a => a !== req.session.id));
        }));
        authRouter.post('/logout', validateSession, middleware_1.wrapAsync(async (req, res) => {
            await db.delSession(req.session.id);
            res.sendStatus(204);
        }));
        authRouter.get('/refresh', validateSession, middleware_1.wrapAsync(async (req, res) => {
            const sess = await db.addSession(req.user.id, req.session.scopes);
            await db.delSession(req.session.id);
            res.json(sess);
        }));
        router.use('/auth', authRouter, middleware_1.handleError('auth'));
        router.get('/self', validateSession, middleware_1.wrapAsync(async (req, res) => {
            res.json({ id: req.user.id, username: req.user.username });
        }), middleware_1.handleError('get-self'));
        router.delete('/self', validateSession, middleware_1.wrapAsync(async (req, res) => {
            if (req.user)
                await db.delUser(req.user.id);
            res.sendStatus(204);
        }), middleware_1.handleError('delete-self'));
    }
    get router() { return this._router; }
}
exports.AuthApi = AuthApi;
