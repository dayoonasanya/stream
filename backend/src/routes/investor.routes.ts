import { Router } from 'express';
import * as investorController from '../controllers/investor.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { UserRole } from '../enums/enums';

const router = Router();

// Create investor profile (User)
router.post(
    '/create', 
    authenticateJWT, 
    authorizeRole([UserRole.INVESTOR]), 
    investorController.createInvestorProfile
);

// Update investor profile (User)
router.put(
    '/update', 
    authenticateJWT, 
    authorizeRole([UserRole.INVESTOR]), 
    investorController.updateInvestorProfile
);

// Get all investors (Admin only)
router.get(
    '/all', authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    investorController.getAllInvestors
);

// Get investor profile by ID (User)
router.get(
    '/me', 
    authenticateJWT, 
    authorizeRole([UserRole.INVESTOR]), 
    investorController.getInvestorById
);

export default router;
