import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service';
import { ProjectType } from '../enums/enums';
import { AppError } from '../middlewares/error.middleware';

// Helper function to handle errors
const handleControllerError = (error: any, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error,
    });
  }
  next(error);
};

// Create Project
export const createProject = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
  try {
    const projectData = req.body;
    const project = await projectService.createProject(projectData);
    res.status(201).json({
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Update Project
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const projectData = req.body;
    const updatedProject = await projectService.updateProject(projectId, projectData);
    res.status(200).json({
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Delete Project
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await projectService.deleteProject(projectId);
    res.status(200).json({
      message: 'Project deleted successfully',
      data: deletedProject,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Retrieve Projects by Type
export const getProjectsByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectType = req.params.type as ProjectType;
    const projects = await projectService.getProjectsByType(projectType);
    res.status(200).json(projects);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Set Project Visibility
export const setProjectVisibility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const { isPublic } = req.body;
    const project = await projectService.setProjectVisibility(projectId, isPublic);
    res.status(200).json({
      message: 'Project visibility updated',
      data: project,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Categorize Project
export const categorizeProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const { category } = req.body;
    const project = await projectService.categorizeProject(projectId, category);
    res.status(200).json({
      message: 'Project categorized successfully',
      data: project,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Adjust Target Amount based on Donations or Investments
export const adjustTargetAmount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const { newAmount } = req.body;
    const project = await projectService.adjustTargetAmount(projectId, newAmount);
    res.status(200).json({
      message: 'Target amount adjusted successfully',
      data: project,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};


// Get a single project by ID
export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// Get all projects
export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};