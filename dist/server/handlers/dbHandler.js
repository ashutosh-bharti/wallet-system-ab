"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const transaction_1 = require("../models/transaction");
const wallet_1 = require("../models/wallet");
class DbHandler {
    constructor() {
        this.uid = () => new mongoose.Types.ObjectId();
        this.decimalPrecision = (num) => Math.round((num + Number.EPSILON) * 10000) / 10000;
        this.setup = (req, res) => {
            let amount = this.decimalPrecision(req.body.balance);
            let date = new Date();
            let walletData = {
                walletId: this.uid(),
                name: req.body.name,
                balance: amount,
                date: date
            };
            wallet_1.default.create(walletData)
                .then((walletObj) => {
                let transData = {
                    walletId: walletObj.walletId,
                    transactionId: this.uid(),
                    balance: amount,
                    amount: amount,
                    description: "Setup",
                    type: "CREDIT",
                    date: date
                };
                transaction_1.default.create(transData)
                    .then((transObj) => {
                    let resData = {
                        id: walletObj.walletId,
                        balance: amount,
                        name: walletObj.name,
                        date: date
                    };
                    res.status(200).json(resData);
                })
                    .catch((err) => res.status(400).json({ message: err.message }));
            })
                .catch((err) => res.status(400).json({ message: err.message }));
        };
        this.getWalletDetail = (req, res) => {
            wallet_1.default.findOne({
                walletId: req.params.id
            }).then((walletObj) => {
                let resData = {
                    id: walletObj.walletId,
                    balance: walletObj.balance,
                    name: walletObj.name,
                    date: new Date(walletObj.date)
                };
                res.status(200).json(resData);
            }).catch((err) => {
                res.status(500).json({ message: err.message });
            });
        };
        this.updateWalletAmount = async (req, res) => {
            let id = req.params.walletId;
            let amount = req.body.amount;
            let description = req.body.description;
            if (typeof description != 'undefined' && description && amount && amount !== 0) {
                amount = this.decimalPrecision(amount);
                // start session
                const session = await wallet_1.default.startSession();
                session.startTransaction();
                try {
                    const opts = { session };
                    let date = new Date();
                    let walletObj = await wallet_1.default.findOne({ walletId: id });
                    let amt = this.decimalPrecision(walletObj.balance + amount);
                    if (amount > 0) {
                        let transData = {
                            walletId: id,
                            transactionId: this.uid(),
                            balance: amt,
                            amount: amount,
                            description: description,
                            type: "CREDIT",
                            date: date
                        };
                        let transObj = await new transaction_1.default(transData);
                        transObj.save(opts);
                        walletObj.balance = amt;
                        walletObj.save(opts);
                        // success
                        await session.commitTransaction();
                        session.endSession();
                        res.status(200).json({ balance: amt, transactionId: transObj.transactionId });
                    }
                    else if (amt >= 0) {
                        let transData = {
                            walletId: id,
                            transactionId: this.uid(),
                            balance: amt,
                            amount: amount,
                            description: description,
                            type: "DEBIT",
                            date: date
                        };
                        let transObj = await new transaction_1.default(transData);
                        transObj.save(opts);
                        walletObj.balance = amt;
                        walletObj.save(opts);
                        // success
                        await session.commitTransaction();
                        session.endSession();
                        res.status(200).json({ balance: amt, transactionId: transObj.transactionId });
                    }
                    else {
                        // insufficient balance
                        await session.abortTransaction();
                        session.endSession();
                        return res.status(403).json({ message: "Insufficient Balance" });
                    }
                }
                catch (err) {
                    // If an error occurred, abort the whole transaction and
                    // undo any changes that might have happened
                    await session.abortTransaction();
                    session.endSession();
                    res.status(500).json({ message: err.message });
                }
            }
            else {
                res.status(400).json({ message: "Invalid Input" });
            }
        };
        this.fetchTransactions = (req, res) => {
            transaction_1.default.find({
                walletId: req.query.walletId
            }, {
                id: "$transactionId",
                walletId: 1,
                balance: 1,
                amount: 1,
                description: 1,
                type: 1,
                date: 1,
                _id: 0
            }, {
                skip: Number(req.query.skip),
                limit: Number(req.query.limit)
            })
                .sort({ date: -1 })
                .then((transObj) => {
                res.status(200).json(transObj);
            }).catch((err) => {
                res.status(500).json({ message: err.message });
            });
        };
        this.getNotFound = (req, res) => res.status(404).json({ message: "Path Not Found" });
    }
}
exports.default = DbHandler;
//# sourceMappingURL=dbHandler.js.map