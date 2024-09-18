import { Request, Response, NextFunction } from 'express';
import * as investorService from '../services/investor.service';
import { AuthRequest } from '../middlewares/auth.middleware';
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

// Create Investor Profile (User)
export const createInvestorProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const investorData = req.body;
    const investorProfile = await investorService.createInvestorProfile(req.user!.userId, investorData);
    res.status(201).json({
      message: 'Investor profile created successfully',
      data: investorProfile,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Update Investor Profile (User)
export const updateInvestorProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const investorData = req.body;
    const investorProfile = await investorService.updateInvestorProfile(req.user!.userId, investorData);
    res.status(200).json({
      message: 'Investor profile updated successfully',
      data: investorProfile,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get All Investors (Admin only)
export const getAllInvestors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const investors = await investorService.getAllInvestors();
    res.status(200).json(investors);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get Investor by User ID (User)
export const getInvestorById = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const investorProfile = await investorService.getInvestorById(req.user!.userId);
    res.status(200).json(investorProfile);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};