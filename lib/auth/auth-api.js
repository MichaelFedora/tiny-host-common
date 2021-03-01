"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthApi = void 0;
const crypto_1 = require("crypto");
const express_1 = require("express");
const errors_1 = require("../errors");
const middleware_1 = require("../middleware");
const auth_middleware_1 = require("./auth-middleware");
const auth_util_1 = require("./auth-util");
class AuthApi {
    constructor(config, db, router = express_1.Router()) {
        config = Object.assign({ requireScopes: false, allowHandshakes: false, allowMasterKeys: true, handshakeExpTime: 300000 }, config);
        this._router = router;
        const validateSession = auth_middleware_1.validateUserSession(db);
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
            const pass = await auth_util_1.hash(user.salt, req.body.password);
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
                pass: await auth_util_1.hash(salt, req.body.password)
            };
            await db.addUser(user);
            res.sendStatus(204);
        }));
        authRouter.post('/change-pass', validateSession, express_1.json(), middleware_1.wrapAsync(async (req, res) => {
            if (!req.body.password || !req.body.newpass)
                throw new errors_1.MalformedError('Body must have a password, and a newpass.');
            if (await auth_util_1.hash(req.user.salt, req.body.password) !== req.user.pass)
                throw new errors_1.NotAllowedError('Password mismatch.');
            const salt = crypto_1.randomBytes(128).toString('hex');
            const pass = auth_util_1.hash(salt, req.body.newpass);
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
        if (config.allowHandshakes) {
            const handshakeRouter = express_1.Router();
            handshakeRouter.get('/start', middleware_1.wrapAsync(async (req, res) => {
                if (!req.query.redirect || typeof req.query.redirect !== 'string' ||
                    (req.query.scopes ? typeof req.query.scopes !== 'string' : config.requireScopes))
                    throw new errors_1.MalformedError('Must have ?redirect={url}<&scopes=["/scopes"]> query.');
                const info = {
                    redirect: req.query.redirect,
                    scopes: null,
                    created: Date.now()
                };
                if (req.query.scopes) {
                    try {
                        info.scopes = JSON.parse(req.query.scopes);
                        if (!(info.scopes instanceof Array))
                            throw new Error();
                    }
                    catch (e) {
                        throw new errors_1.MalformedError('Could not parse scopes query; should be a JSON array.');
                    }
                }
                else
                    delete info.scopes;
                const hsId = await db.addHandshake(info);
                res.redirect(`/handshake?handshake=${hsId}${req.query.username ? '&username=' + String(req.query.username) : ''}`);
            }));
            handshakeRouter.use('/:id', validateSession, middleware_1.wrapAsync(async (req, res, next) => {
                if (!req.user)
                    throw new errors_1.MalformedError('Can only access handshakes as a user!');
                req.handshake = await db.getHandshake(req.params.id);
                if (!req.handshake)
                    throw new errors_1.NotFoundError('No handshake found with id "' + req.params.id + '"!');
                if (req.handshake.created + config.handshakeExpTime < Date.now()) {
                    await db.delHandshake(req.handshake.id);
                    throw new errors_1.NotFoundError('Handshake expired!');
                }
                next();
            }));
            handshakeRouter.get('/:id', middleware_1.wrapAsync(async (req, res) => {
                res.json({
                    redirect: req.handshake.redirect,
                    scopes: req.handshake.scopes
                });
            }));
            handshakeRouter.get('/:id/approve', middleware_1.wrapAsync(async (req, res) => {
                let code;
                do {
                    code = crypto_1.randomBytes(24).toString('hex');
                } while (await db.getHandshakeFromCode(code) != null);
                const info = {
                    user: req.user.id,
                    code
                };
                await db.putHandshake(req.handshake.id, Object.assign(req.handshake, info));
                res.redirect(req.handshake.redirect + '?code=' + code);
            }));
            handshakeRouter.get('/:id/cancel', middleware_1.wrapAsync(async (req, res) => {
                await db.delHandshake(req.handshake.id);
                res.redirect(req.handshake.redirect + '?error=access_denied');
            }));
            authRouter.use('/handshake', handshakeRouter);
            authRouter.post('/session', middleware_1.wrapAsync(async (req, res) => {
                if (!req.body.redirect || !(!config.requireScopes || req.body.scopes) || !req.body.code)
                    throw new errors_1.MalformedError('Body should contain: { app, redirect, scopes, code }!');
                const handshake = await db.getHandshakeFromCode(req.body.code);
                if (!handshake)
                    throw new errors_1.NotFoundError('Handshake not found with given code!');
                await db.delHandshake(handshake.id);
                if (handshake.redirect !== req.body.redirect || handshake.scopes !== req.body.scopes)
                    throw new errors_1.MalformedError('Handshake/body mismatch.');
                const user = await db.getUser(handshake.user);
                if (!user)
                    throw new errors_1.NotFoundError('User not found!');
                const session = await db.addSession(user.id, handshake.scopes);
                res.json(session);
            }));
        }
        if (config.allowMasterKeys) {
            const masterKeyRouter = express_1.Router();
            masterKeyRouter.get('', validateSession, middleware_1.wrapAsync(async (req, res) => {
                res.json(await db.getMasterKeysForUser(req.user.id));
            }));
            masterKeyRouter.post('', validateSession, middleware_1.wrapAsync(async (req, res) => {
                const name = ((req.query.name && typeof req.query.name === 'string') ? String(req.query.name) : '') || 'Unknown';
                res.json(db.addMasterKey({ user: req.user.id, name }));
            }));
            masterKeyRouter.put('/:id', validateSession, express_1.json(), middleware_1.wrapAsync(async (req, res) => {
                if (!req.body || !req.body.name || typeof req.body.name !== 'string')
                    throw new errors_1.MalformedError('Body should be { name: string }!');
                const masterkey = await db.getMasterKey(req.params.id);
                if (!masterkey || masterkey.user !== req.user.id)
                    throw new errors_1.NotFoundError('Master key not found!');
                await db.putMasterKey(req.params.id, Object.assign({}, masterkey, { name: req.body.name }));
                res.sendStatus(204);
            }));
            masterKeyRouter.delete('/:id', validateSession, middleware_1.wrapAsync(async (req, res) => {
                const masterkey = await db.getMasterKey(req.params.id);
                if (!masterkey || masterkey.user !== req.user.id)
                    throw new errors_1.NotFoundError('Master key not found!');
                await db.delMasterKey(masterkey.id);
                res.sendStatus(204);
            }));
            authRouter.use('/master-key', masterKeyRouter, middleware_1.handleError('auth-master-key'));
            authRouter.post('/generate-session', middleware_1.wrapAsync(async (req, res) => {
                if (!req.query.key || typeof req.query.key !== 'string')
                    throw new errors_1.MalformedError('?key=.. required!');
                if (req.query.scopes ? typeof req.query.scopes !== 'string' : config.requireScopes)
                    throw new errors_1.MalformedError('?scopes=[..] required!');
                let scopes;
                if (req.query.scopes) {
                    try {
                        scopes = JSON.parse(String(req.query.scopes));
                        if (!(scopes instanceof Array))
                            throw new Error();
                    }
                    catch (e) {
                        throw new errors_1.MalformedError('Could not parse scopes query; should be a JSON array.');
                    }
                }
                const masterkey = await db.getMasterKey(String(req.query.string));
                if (!masterkey)
                    throw new errors_1.NotFoundError('Master key not found!');
                const user = await db.getUser(masterkey.user);
                if (!user)
                    throw new errors_1.NotFoundError('User not found!');
                res.json(db.addSession(user.id, scopes));
            }));
        }
        router.use('/auth', authRouter, middleware_1.handleError('auth'));
        router.get('/self', validateSession, middleware_1.wrapAsync(async (req, res) => {
            res.json({ id: req.user.id, username: req.user.username });
        }), middleware_1.handleError('get-self'));
        router.delete('/self', validateSession, middleware_1.wrapAsync(async (req, res) => {
            if (!req.user)
                throw new errors_1.MalformedError('User required!');
            if (!req.query.pass || typeof req.query.pass !== 'string')
                throw new errors_1.MalformedError('?pass=.. required!');
            if (await auth_util_1.hash(req.user.salt, req.query.pass) !== req.user.pass)
                throw new errors_1.NotAllowedError('Password does not match!');
            await db.delUser(req.user.id);
            res.sendStatus(204);
        }), middleware_1.handleError('delete-self'));
    }
    get router() { return this._router; }
}
exports.AuthApi = AuthApi;
