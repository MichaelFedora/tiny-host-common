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

## License

MIT
