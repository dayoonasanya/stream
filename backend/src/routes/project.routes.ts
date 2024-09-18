import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/role.middleware';
import { UserRole } from '../enums/enums';

const router = Router();

// Create project (Organization or Startup users)
router.post(
    '/create', 
    authenticateJWT, 
    authorizeRole([UserRole.ORGANIZATION, UserRole.STARTUP]), 
    projectController.createProject
);

// Update project (Organization or Startup users)
router.put(
    '/:id/update', 
    authenticateJWT, 
    authorizeRole([UserRole.ORGANIZATION, UserRole.STARTUP]), 
    projectController.updateProject
);

// Delete project (Organization or Startup users)
router.delete(
    '/:id', 
    authenticateJWT, 
    authorizeRole([UserRole.ORGANIZATION, UserRole.STARTUP, UserRole.ORGANIZATION]), 
    projectController.deleteProject
);

// Get projects by type (Public)
router.get(
    '/type/:type', 
    projectController.getProjectsByType
);

// Set project visibility (Organization or Startup users)
router.patch(
    '/:id/visibility', 
    authenticateJWT, 
    authorizeRole([UserRole.ORGANIZATION, UserRole.STARTUP]), 
    projectController.setProjectVisibility
);

// Categorize project (Organization or Startup users)
router.patch(
    '/:id/category', 
    authenticateJWT, 
    authorizeRole([UserRole.ORGANIZATION, UserRole.STARTUP]), 
    projectController.categorizeProject
);

// Adjust project target amount based on new investments or donations
router.patch(
    '/:id/adjust-amount', 
    authenticateJWT, 
    authorizeRole([UserRole.ORGANIZATION, UserRole.STARTUP]), 
    projectController.adjustTargetAmount
);

// Get all projects (Public)
router.get(
    '/', 
    projectController.getAllProjects
);

// Get a single project by ID (Public)
router.get(
    '/:id', 
    projectController.getProjectById
);

export default router;
