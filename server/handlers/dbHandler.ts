import * as mongoose from 'mongoose';
import Transaction from "../models/transaction";
import Wallet from "../models/wallet";

class DbHandler {
    private uid = () =>  new mongoose.Types.ObjectId();

    private decimalPrecision = (num: any) => Math.round((num + Number.EPSILON) * 10000) / 10000;

    setup = (req: any, res: any) => {
        let amount = this.decimalPrecision(req.body.balance);
        let date = new Date();
        let walletData = {
            walletId: this.uid(),
            name: req.body.name,
            balance: amount,
            date: date
        };
        Wallet.create(walletData)
        .then((walletObj: any) => {
            let transData = {
                walletId: walletObj.walletId,
                transactionId: this.uid(),
                balance: amount,
                amount: amount,
                description: "Setup",
                type: "CREDIT",
                date: date
            };
            Transaction.create(transData)
            .then((transObj: any) => {
                let resData = {
                    id: walletObj.walletId,
                    balance: amount,
                    name: walletObj.name,
                    date: date
                };
                res.status(200).json(resData);
            })
            .catch((err: any) => res.status(400).json({ message: err.message }));
        })
        .catch((err: any) => res.status(400).json({ message: err.message }));
    };
    
    getWalletDetail = (req: any, res: any) => {
        Wallet.findOne({
            walletId: req.params.id
        }).then((walletObj: any) => {
            let resData = {
                id: walletObj.walletId,
                balance: walletObj.balance,
                name: walletObj.name,
                date: new Date(walletObj.date)
            };
            res.status(200).json(resData);
        }).catch((err: any)=> {
            res.status(500).json({ message: err.message })
        });
    };
    
    updateWalletAmount = async (req: any, res: any) => {
        let id = req.params.walletId;
        let amount = req.body.amount;
        let description = req.body.description;
        if (typeof description != 'undefined' && description && amount && amount !== 0) {
            amount = this.decimalPrecision(amount);
            // start session
            const session = await Wallet.startSession();
            session.startTransaction();
            try {
                const opts = { session };
                let date = new Date();
                let walletObj = await Wallet.findOne({ walletId: id });
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
                    let transObj = await new Transaction(transData);
                    transObj.save(opts);
                    walletObj.balance = amt;
                    walletObj.save(opts);
                    // success
                    await session.commitTransaction();
                    session.endSession();
                    res.status(200).json({balance: amt, transactionId: transObj.transactionId});
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
                    let transObj = await new Transaction(transData);
                    transObj.save(opts);
                    walletObj.balance = amt;
                    walletObj.save(opts);
                    // success
                    await session.commitTransaction();
                    session.endSession();
                    res.status(200).json({balance: amt, transactionId: transObj.transactionId});
                } else {
                    // insufficient balance
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(403).json({ message: "Insufficient Balance" });
                }
            } catch (err: any) {
              // If an error occurred, abort the whole transaction and
              // undo any changes that might have happened
              await session.abortTransaction();
              session.endSession();
              res.status(500).json({ message: err.message });
            }
        } else {
            res.status(400).json({ message: "Invalid Input" });
        }
    };

    fetchTransactions = (req: any, res: any) => {
        Transaction.find({
            walletId: req.query.walletId
        },
        {
            id: "$transactionId",
            walletId: 1,
            balance: 1,
            amount: 1,
            description: 1,
            type: 1,
            date: 1,
            _id: 0
        }, 
        { 
            skip: Number(req.query.skip),
            limit: Number(req.query.limit)
        })
        .sort({date: -1})
        .then((transObj: any) => {
            res.status(200).json(transObj);
        }).catch((err: any)=> {
            res.status(500).json({ message: err.message })
        });
    };

    getNotFound = (req: any, res: any) => res.status(404).json({ message: "Path Not Found" });
}


export default DbHandler;
