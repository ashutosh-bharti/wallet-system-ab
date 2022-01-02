"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    walletId: { type: String, ref: 'Wallet' },
    transactionId: String,
    balance: Number,
    amount: Number,
    description: String,
    type: String,
    date: Date
});
const Transaction = mongoose_1.model('Transaction', transactionSchema);
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map