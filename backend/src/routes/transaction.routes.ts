import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { UserRole } from '../enums/enums';

const router = Router();

// Process a Transaction (Donation or Investment)
router.post(
    '/process', 
    authenticateJWT, 
    authorizeRole([UserRole.INVESTOR]), 
    transactionController.processTransaction
);

// Update Transaction Status (Stripe Webhook)
router.post(
    '/update-status', 
    transactionController.updateTransactionStatus
);

// Get Transaction by ID
router.get(
    '/:id', 
    authenticateJWT, 
    transactionController.getTransactionById
);

// Get All Transactions for a Project
router.get(
    '/project/:projectId', 
    authenticateJWT, 
    transactionController.getTransactionsByProject
);

// Calculate Investor Share Percentage
router.post(
    '/calculate-share', 
    authenticateJWT, authorizeRole([UserRole.INVESTOR]), 
    transactionController.calculateInvestorShare
);

export default router;
