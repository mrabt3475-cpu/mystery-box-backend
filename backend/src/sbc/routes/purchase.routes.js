/* Purchase Routes
*Used to manage purchases*/

const express = require('express');

const purchaseRouter = express.router();
import authMiddleware from '../middleware/auth.middleware';
import purchaseController from '../controllers/purchase.controller';

purchaseRouter.post('/', authMiddleware, purchaseController.createPurchase);

purchaseRouter.get'//history', authMiddleware, purchaseController.getPurchasesHistory);

module.exports = purchaseRouter;
