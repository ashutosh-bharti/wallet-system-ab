"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongo_1 = require("./mongo");
const routes_1 = require("./routes");
const app = express();
exports.app = app;
app.set('port', (process.env.PORT || 3000));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, '../public')));
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    next();
});
const main = async () => {
    try {
        await mongo_1.default();
        routes_1.default(app);
        app.get('/*', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
        app.listen(app.get('port'), () => console.log(`wallet System Application listening on port ${app.get('port')}`));
    }
    catch (err) {
        console.error(err);
    }
};
main();
//# sourceMappingURL=app.js.map