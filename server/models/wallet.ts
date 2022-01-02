import { model, Schema} from 'mongoose';

const walletSchema = new Schema({
    walletId: String,
    name: String,
    balance: Number,
    date: Date
});

const Wallet = model('Wallet', walletSchema);

export default Wallet;
