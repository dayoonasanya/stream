import { Router } from 'express';
import * as startupController from '../controllers/startup.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { UserRole } from '../enums/enums';

const router = Router();

// Create Startup Profile (User)
router.post(
    '/create', 
    authenticateJWT, 
    authorizeRole([UserRole.STARTUP]), 
    startupController.createStartupProfile
);

// Update Startup Profile (User)
router.put(
    '/:userId/update', 
    authenticateJWT, 
    authorizeRole([UserRole.STARTUP]), 
    startupController.updateStartupProfile
);

// Get All Startups (Admin)
router.get(
    '/', authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    startupController.getAllStartups
);

// Get Startup Profile by ID (User or Admin)
router.get(
    '/:userId', 
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN, UserRole.STARTUP]), 
    startupController.getStartupById
);

export default router;
