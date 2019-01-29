# LNURL-RFC APPLICATION

Bech32-encoded HTTPS query string standard to help payer interact with payee in Lightning Neetwork. This standard simplify a number of standard scenarios such as requesting incoming channels, withdrawing funds, doing atomic swaps and more.

## Setup

`npm i`
`npm start`

### Requirements
`npm i -g @adonisjs/cli`

Create `.env` file in root folder and change values for your env (DB_*)
```
HOST=127.0.0.1
PORT=3322
NODE_ENV=development
APP_URL=http://${HOST}:${PORT}
CACHE_VIEWS=false
APP_KEY=ZXQzCG3gW03Byu2rWYgZuywFakBwmS1G
DB_CONNECTION=sqlite
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_DATABASE=
SESSION_DRIVER=cookie
HASH_DRIVER=bcrypt
LND_MACAROON=
LND_HOST=
LND_PORT=
```
