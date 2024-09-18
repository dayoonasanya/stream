import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as organizationController from '../controllers/organization.controller';
import * as projectController from '../controllers/project.controller';
import * as transactionController from '../controllers/transaction.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { UserRole } from '../enums/enums';
import * as authController from '../controllers/auth.controller';


const router = Router();


router.use(authenticateJWT);
router.use(authorizeRole([UserRole.ADMIN]));

// Route for creating a new admin
router.post('/admins', authController.addAdmin);

// User Management (Admin)
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/role/:role', userController.getUsersByRole);
router.patch('/users/:id/status', userController.setAccountStatus);
router.delete('/users/:id', userController.deleteUser);

// Organization Management (Admin)
router.get('/organizations', organizationController.getAllOrganizations);
router.patch('/organizations/:id/verify', organizationController.setOrganizationVerification);
router.delete('/organizations/:id', organizationController.deleteOrganization);

// Project Management (Admin)
router.get('/projects/type/:type', projectController.getProjectsByType);
router.patch('/projects/:id/visibility', projectController.setProjectVisibility);
router.delete('/projects/:id', projectController.deleteProject);
router.patch('/projects/:id/category', projectController.categorizeProject);

// Transaction Management (Admin)
router.get('/transactions/project/:projectId', transactionController.getTransactionsByProject);
router.get('/transactions/:id', transactionController.getTransactionById);

export default router;