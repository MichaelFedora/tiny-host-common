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

### TODO

- Add a "home-link" token type, to generate scoped tokens.
  - this is for Homes to request, when attaching a file-/db-host to a Home User
  so they can generate other scoped tokens to be used by an application
  - this does not expire, but can be revoked
  - workflow like thus:
    - login to home
    - click "attach storage"
    - enter "my-store.mydomain.com"
    - oauth with the file store ()
    - get a "home-link" token back

## License

MIT
