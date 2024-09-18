import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { UserRole } from '../enums/enums';

const router = Router();

// Get all users (Admin only)
router.get(
    '/all', 
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    userController.getAllUsers
);

// Get user by ID (Admin or User)
router.get(
    '/:id', 
    authenticateJWT, 
    userController.getUserById
);

// Get users by role (Admin only)
router.get(
    '/role/:role', 
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    userController.getUsersByRole
);

// Update profile (User)
router.put(
    '/profile', 
    authenticateJWT, 
    userController.updateProfile
);

// Activate/Deactivate account (Admin or User)
router.patch(
    '/account/:id/status', 
    authenticateJWT, 
    userController.setAccountStatus
);

// Delete user (Admin or User)
router.delete(
    '/:id', 
    authenticateJWT, 
    userController.deleteUser
);

// Change password (User)
router.patch(
    '/password/change', 
    authenticateJWT, 
    userController.changePassword
);

// Forgot password (Send reset link via email)
router.post(
    '/password/forgot', 
    userController.forgotPassword
);

// Reset password (User submits new password)
router.post(
    '/password/reset',
     userController.resetPassword
);

export default router;
