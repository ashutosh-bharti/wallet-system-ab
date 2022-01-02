# Wallet System
GOHIGHLEVEL - Full Stack Assignment

This project uses the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)):
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](https://www.mongodb.com)): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 12+](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment

## Prerequisites
1. Install [Node.js](https://nodejs.org) and [MongoDB](https://www.mongodb.com)
2. Install Angular CLI: `npm i -g @angular/cli`
3. From project root folder install all the dependencies: `npm i`
4. Set credential link of mongoDB database in .env file

## Run
### Development mode with files watching
`npm run dev`: [concurrently](https://github.com/kimmobrunfeldt/concurrently) execute Angular build, TypeScript compiler and Express server.

A window will automatically open at [localhost:4200](http://localhost:4200). Angular and Express files are being watched. Any change automatically creates a new bundle, restart Express server and reload your browser.

### Production mode
`npm run prod`: run the project with a production bundle listening at [localhost:3000](http://localhost:3000) 

### Manual mode
1. Build frontend: `npm run builddev` for dev or `npm run build` for prod
2. Build backend: `npm run predev`
3. Run the app: `npm start`

## Database Design

1. Wallet: Schema = {
    walletId: String,
    name: String,
    balance: Number,
    date: Date
}

2. Transaction: Schema = {
    walletId: { type: String, ref: 'Wallet' },
    transactionId: String,
    balance: Number,
    amount: Number,
    description: String,
    type: String,
    date: Date
}

## API end-points example

1. Setup Wallet-> POST "http://localhost:3000/api/setup"
Request body: { "balance": 20, "name": "Wallet ABCD" }
Response body: {"id":"61d2050b44de486bb19ff91e","balance":20,"name":"Wallet ABCD","date":"2022-01-02T20:03:23.547Z"}

2. Get Wallet Detail-> GET "http://localhost:3000/api/wallet/61d2050b44de486bb19ff91e"
Response body: {"id":"61d2050b44de486bb19ff91e","balance":20,"name":"Wallet ABCD","date":"2022-01-02T20:03:23.547Z"}

3. Payment (Credit/Debit)-> POST "http://localhost:3000/api/transact/61d2050b44de486bb19ff91e"
Request body: { "amount": 2.4, "description": "Recharge" }
Response body: {"balance":22.4,"transactionId":"61d207b744de486bb19ff926"}

POST "http://localhost:3000/api/transact/61d2050b44de486bb19ff91e"
Request body: { "amount": -1.45, "description": "Transfer" }
Response body: {"balance":20.95,"transactionId":"61d2084444de486bb19ff92b"}

4. Get Transactions of wallet-> GET "http://localhost:3000/api/transactions?walletId=61d2050b44de486bb19ff91e&skip=0&limit=20"
Response body: [{"walletId":"61d2050b44de486bb19ff91e","balance":20.95,"amount":-1.45,"description":"Transfer","type":"DEBIT","date":"2022-01-02T20:17:08.001Z","id":"61d2084444de486bb19ff92b"},{"walletId":"61d2050b44de486bb19ff91e","balance":22.4,"amount":2.4,"description":"Recharge","type":"CREDIT","date":"2022-01-02T20:14:47.057Z","id":"61d207b744de486bb19ff926"},{"walletId":"61d2050b44de486bb19ff91e","balance":20,"amount":20,"description":"Setup","type":"CREDIT","date":"2022-01-02T20:03:23.547Z","id":"61d2050b44de486bb19ff921"}]

## Frontend

Full project is deployed in [Herko](https://www.heroku.com) with preview link: https://wallet-system-ab.herokuapp.com/

## Author
[Ashutosh Bharti](https://github.com/ashutosh-bharti)
