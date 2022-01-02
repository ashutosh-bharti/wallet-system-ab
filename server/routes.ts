import * as express from 'express';
import DbHandler from './handlers/dbHandler';

const setRoutes = (app: any): void => {
    const router = express.Router();
    const handler = new DbHandler();

    router.route('/setup').post(handler.setup);
    router.route('/wallet/:id').get(handler.getWalletDetail);
    router.route('/transact/:walletId').post(handler.updateWalletAmount);
    router.route('/transactions').get(handler.fetchTransactions);
    router.route('/*').get(handler.getNotFound);

    app.use('/api', router);
};

export default setRoutes;
