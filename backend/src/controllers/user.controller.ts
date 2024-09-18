import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { UserRole } from '../enums/enums';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';
import { hash } from 'bcrypt';

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

// Get All Users (Admin only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get User by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.status(200).json(user);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get Users by Role (Admin only)
export const getUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsersByRole(req.params.role as UserRole);
    res.status(200).json(users);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Update User Profile (User)
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { profile, socialMediaLinks } = req.body;
    const updatedUser = await userService.updateProfile(req.user!.userId, profile, socialMediaLinks);
    res.status(200).json(updatedUser);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Activate/Deactivate User (Admin or User)
export const setAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isActivated } = req.body;
    const updatedUser = await userService.setAccountStatus(req.params.id, isActivated);
    res.status(200).json(updatedUser);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Delete User (Admin or User)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userService.deleteUser(req.params.id);
    res.status(200).json({
      message: 'User soft deleted successfully',
      data: updatedUser,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Change Password (User)
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user!.userId, currentPassword, newPassword);
    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Forgot Password (Send reset link via email)
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await userService.generatePasswordResetLink(email);
    res.status(200).json({
      message: 'Password reset link sent',
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Reset Password (User submits new password with token)
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
  
      
      await userService.resetPassword(token, newPassword);
  
      res.status(200).json({
        message: 'Password reset successfully',
      });
    } catch (error) {
      handleControllerError(error, res, next);
    }
  };