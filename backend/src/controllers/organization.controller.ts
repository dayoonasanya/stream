import { Request, Response, NextFunction } from 'express';
import * as organizationService from '../services/organization.service';
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

// Create Organization Profile (User)
export const createOrganizationProfile = async (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
) => {
  try {
    const organizationData = req.body;
    const organization = await organizationService.createOrganizationProfile(req.user!.userId, organizationData);
    res.status(201).json({
      message: 'Organization profile created successfully',
      data: organization,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Update Organization Profile (User)
export const updateOrganizationProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const organizationData = req.body;
    const organization = await organizationService.updateOrganizationProfile(req.user!.userId, organizationData);
    res.status(200).json({
      message: 'Organization profile updated successfully',
      data: organization,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Set Organization Verification (Admin)
export const setOrganizationVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isVerified } = req.body;
    const organization = await organizationService.setOrganizationVerification(req.params.id, isVerified);
    res.status(200).json({
      message: 'Organization verification status updated',
      data: organization,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get All Organizations
export const getAllOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizations = await organizationService.getAllOrganizations();
    res.status(200).json(organizations);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Delete Organization (User or Admin)
export const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedOrganization = await organizationService.deleteOrganization(req.params.id);
    res.status(200).json({
      message: 'Organization deleted successfully',
      data: deletedOrganization,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};


// Get Organization Profile by User ID (User)
export const getOrganizationProfileByUserId = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const organization = await organizationService.getOrganizationProfileByUserId(req.user!.userId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get Organization Profile by Organization ID (Public/Admin)
export const getOrganizationProfileById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organization = await organizationService.getOrganizationProfileById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};