import { Request, Response, NextFunction } from 'express';
import * as startupService from '../services/startup.service';
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

// Create Startup Profile
export const createStartupProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, name, description, website } = req.body;
    const startup = await startupService.createStartupProfile(userId, { name, description, website });
    res.status(201).json({
      message: 'Startup profile created successfully',
      data: startup,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Update Startup Profile
export const updateStartupProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { name, description, website } = req.body;
    const updatedStartup = await startupService.updateStartupProfile(userId, { name, description, website });
    res.status(200).json({
      message: 'Startup profile updated successfully',
      data: updatedStartup,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get All Startup Profiles
export const getAllStartups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startups = await startupService.getAllStartups();
    res.status(200).json(startups);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get Startup Profile by ID
export const getStartupById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const startup = await startupService.getStartupById(userId);
    if (!startup) {
      throw new AppError('Startup profile not found', 404);
    }
    res.status(200).json(startup);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};