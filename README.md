# Tiny Host Common

A small library for tiny-hosts, particularly for authentication and some common
items (user & session types, middleware, errors, etc).

## Core API

|req   |auth|path             |body                    |return|
|------|----|-----------------|------------------------|------|
|POST  |    |/auth/login      |`{ username, password }`|`"sid"`|
|POST  |    |/auth/register   |`{ username, password }`||
|POST  |sid |/auth/change-pass|`{ password, newpass }` ||
|POST  |sid |/auth/logout     |                        ||
|POST  |sid |/auth/refresh    |                        |`"sid"`|
|GET   |sid |/self            |                        |`{ id, username }`|
|DELETE|sid |/self            |                        ||

## Optional Handshake API

|req |auth|path                  |body|return|
|----|----|----------------------|----|------|
|GET |    |/auth/handshake/start ||redirect to frontend with `?handshake=..`|
|GET |sid |/auth/handshake/:id   ||`{ redirect, scopes }`|
|GET |sid |/auth/handshake/accept||redirect to app with `?code=..`|
|GET |sid |/auth/handshake/cancel||redirect to app with `?error=access_denied`|
|POST|    |/auth/session         |`{ redirect, code, scopes }`|`"sid"`|

## Optional Master Key API

|req   |auth|path                  |query         |body      |return          |
|------|----|----------------------|--------------|----------|----------------|
|GET   |sid |/auth/master-key      |              |          |`{ id, name }[]`|
|POST  |sid |/auth/master-key      |`<&name=..>`  |          |`"key"`         |
|PUT   |sid |/auth/master-key/:id  |              |`{ name }`|                |
|DELETE|sid |/auth/master-key/:id  |              |          |                |
|POST  |key |/auth/generate-session|`&scopes=[..]`|          |`"sid"`         |

## Usage

**Services** (from `tiny-host-common/auth`):

- `AuthDB` - The database for handling Users, Sessions, etc.
- `AuthApi` - The Api for handling authentication, described above.
  - Optionally, it can also handle Handshakes and Master-Key generation
    - Handshakes are so apps can authenticate directly with a store
    - Master-Keys are for homes to be able to easily generate tokens

**Types** (from `tiny-host-common/auth`):

- `User`: A user data type
- `Session`: A session data type

**Middleware**:

- `validateUserSession(db: AuthDB)` (from `/auth`) - middleware for validating a user session
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

## todo

- permissioned scopes
  - so other users can list/view/edit your (non-public) files
  - could be namespaced (/shared/:id/..., where the db contains the perms for
  shared scope :id)
- session descriptors; show who generated it (like app domain)
- handshakes page!
- fix the login reroute being weird sometimes
- add some transitions
- build as a library so tiny-home can borrow components without
needing source code

## License

MIT
