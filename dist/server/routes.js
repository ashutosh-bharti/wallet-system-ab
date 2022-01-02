"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dbHandler_1 = require("./handlers/dbHandler");
const setRoutes = (app) => {
    const router = express.Router();
    const handler = new dbHandler_1.default();
    router.route('/setup').post(handler.setup);
    router.route('/wallet/:id').get(handler.getWalletDetail);
    router.route('/transact/:walletId').post(handler.updateWalletAmount);
    router.route('/transactions').get(handler.fetchTransactions);
    router.route('/*').get(handler.getNotFound);
    app.use('/api', router);
};
exports.default = setRoutes;
//# sourceMappingURL=routes.js.map