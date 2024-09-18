import { Router } from 'express';
import * as organizationController from '../controllers/organization.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { UserRole } from '../enums/enums';

const router = Router();

// Create organization profile (User)
router.post(
    '/create', 
    authenticateJWT, 
    authorizeRole([UserRole.ORGANIZATION]), 
    organizationController.createOrganizationProfile
);

// Update organization profile (User)
router.put(
    '/update', 
    authenticateJWT, 
    authorizeRole([UserRole.ORGANIZATION]), 
    organizationController.updateOrganizationProfile
);

// Set organization verification (Admin)
router.patch(
    '/:id/verify', 
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    organizationController.setOrganizationVerification
);

// Get all organizations (Public)
router.get(
    '/all', 
    organizationController.getAllOrganizations
);

// Delete organization (User or Admin)
router.delete(
    '/:id', 
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN, UserRole.ORGANIZATION]), 
    organizationController.deleteOrganization
);

// Get Organization Profile by User ID (User)
router.get('/profile', authenticateJWT, organizationController.getOrganizationProfileByUserId);

// Get Organization Profile by Organization ID (Public/Admin)
router.get('/:id', organizationController.getOrganizationProfileById);


export default router;
