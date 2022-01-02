"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    walletId: String,
    name: String,
    balance: Number,
    date: Date
});
const Wallet = mongoose_1.model('Wallet', walletSchema);
exports.default = Wallet;
//# sourceMappingURL=wallet.js.map