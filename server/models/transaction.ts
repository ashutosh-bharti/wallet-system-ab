import { model, Schema} from 'mongoose';

const transactionSchema = new Schema({
    walletId: { type: String, ref: 'Wallet' },
    transactionId: String,
    balance: Number,
    amount: Number,
    description: String,
    type: String,
    date: Date
});

const Transaction = model('Transaction', transactionSchema);

export default Transaction;
