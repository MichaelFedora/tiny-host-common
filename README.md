# Tiny Host Common

A small library for tiny-hosts, particularly for authentication and some common
items (user & session types, middleware, errors, etc).

## API

|req   |auth|path             |body|return |
|------|----|-----------------|----|-------|
|POST  |    |/auth/login      |`{ username, password }`|`"sid"`|
|POST  |    |/auth/register   |`{ username, password }`||
|POST  |sid |/auth/change-pass|`{ password, newpass }` ||
|POST  |sid |/auth/logout     |                        ||
|POST  |sid |/auth/refresh    |                        |`"sid"`|
|GET   |sid |/self            |                        |`{ id, username }`|
|DELETE|sid |/self            |                        ||

## Usage

**Services**:
- `AuthDB` - The database for handling Users and Sessions
- `AuthApi` - The Api for handling authentication, described above.

**Types**:
- `User`: A user data type
- `Session`: A session data type

**Middleware:**

- `validateUserSession(db: AuthDB)` - middleware for validating a user session
  - appends to the request body:
    - `req.user instanceof User`
    - `req.session instanceof Session`
- `handleError(action: string)` - middleware for handling errors
  (mostly for those provided by the library, i.e. NotFoundError)
- `wrapAsync(asyncReqHandler: async (req, res, next) => Promise<void>)`
  - wraps the request handler in a function which handles the async-ness,
  generally for catching errors thrown and shoving those into the `next()`
  function

**DB Info Types & Utilities**:
- different types & utilites for a db-host to use, in `tiny-host-common/db`

**File Info Types**:
- different types for a file-host to use, in `tiny-host-common/files`

**Static Host Webpage**:
- a static html page for hosts to use, for
  - registering & logging in users
  - managing user & session (logging out, deleting self)
  - handshaking apps & homes

### TODO

- Add info url so apps can know what type of host this is
  - /info - `{ type: 'file' | 'db' }`
- Add handshakes, so these can be used independantly of homes
  - /handshake/start?redirect=...&scopes=...
  - user -> /handshake/{id}/cancel or /handshake/{id}/approve
  - redirected -> {redirect}?code=...
  - get /session with body `{ code, redirect, scopes }`, returns `"session"`
- Add a "master key" token type, to generate scoped tokens.
  - this is for Homes to request, when attaching a file-/db-host to a Home User
  so they can generate other scoped tokens to be used by an application
  - this does not expire, but can be revoked
  - home -> store workflow:
    - login to home
    - click "attach a store"
    - enter "my-store.mydomain.com"
    - goto -> my-store.mydomain.com/handshake/start?redirect=..&type=master&id=..
    - redirected -> my-store.mydomain.com/?handshake=..
    - goto -> my-store.mydomain.com/handshake/../accept
    - redirected -> my-home.mydomain.com/attach?code=..&id=..
    - get my-store.mydomain.com/token with body `{ code, redirect, id, type: "master" }`
      - get a "master key" token back as `"token"`
  - store -> home workflow (preferred):
    - login to store
    - click "attach to home"
    - enter "my-home.mydomain.com"
    - goto -> my-home.mydomain.com/attach?type=..&url=..&code=..
    - user approves
    - get my-store.mydomain.com/token with body { code, type: "master" }
      - get a "master key" token back as `"token"`

## License

MIT
