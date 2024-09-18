import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { UserRole } from '../enums/enums';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares';

// Helper function to handle errors and return a proper JSON response
const handleControllerError = (error: any, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      status: error.statusCode,
    });
  } 

  res.status(500).json({
    message: error.message || 'Internal Server Error',
    status: 500,
  });
};

// Register User (Admin, Investor, Organization, Startup)
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const userRole = role as UserRole;
    const user = await authService.registerUser(email, password, userRole);

    res.status(201).json({
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Login User
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);

    const sanitizedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      isActivated: user.isActivated,
    };

    res.status(200).json({
      message: 'Login successful',
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};


export const addAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const currentUserId = req.user!.userId;

    const newAdmin = await authService.addAdmin(email, password, currentUserId);

    res.status(201).json({
      message: 'Admin added successfully',
      data: {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

