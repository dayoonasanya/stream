import prisma from '../config/database.config';
import { Organization } from '../interfaces';
import { AppError } from '../middlewares/error.middleware';

// Helper function to map Prisma's Organization to your custom Organization interface
const mapPrismaOrganizationToCustomOrganization = (prismaOrganization: any): Organization => {
  return {
    id: prismaOrganization.id,
    userId: prismaOrganization.userId,
    name: prismaOrganization.name,
    description: prismaOrganization.description,
    website: prismaOrganization.website,
    logoUrl: prismaOrganization.logoUrl,
    isVerified: prismaOrganization.isVerified,
    isDeleted: prismaOrganization.isDeleted,
    socialMedia: prismaOrganization.socialMedia || [],
    projects: prismaOrganization.projects || [],
    createdAt: prismaOrganization.createdAt,
    updatedAt: prismaOrganization.updatedAt,
  };
};

// Create Organization Profile (User)
export const createOrganizationProfile = async (
  userId: string,
  organizationData: Partial<Organization>
): Promise<Organization | null> => {
  try {
    // Check if the organization profile already exists
    const existingOrganization = await prisma.organization.findUnique({
      where: { userId },
    });

    if (existingOrganization) {
      throw new AppError('Organization profile already exists', 400);
    }

    const organization = await prisma.organization.create({
      data: {
        userId,
        name: organizationData.name!,
        description: organizationData.description!,
        website: organizationData.website,
        logoUrl: organizationData.logoUrl,
        socialMedia: {
          create: organizationData.socialMedia?.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        },
      },
      include: {
        socialMedia: true,
        projects: true,
      },
    });

    return organization ? mapPrismaOrganizationToCustomOrganization(organization) : null;
  } catch (error) {
    throw new AppError('Error creating organization profile', 500);
  }
};

// Update Organization Profile (User)
export const updateOrganizationProfile = async (
  userId: string,
  organizationData: Partial<Organization>
): Promise<Organization | null> => {
  try {
    const existingOrganization = await prisma.organization.findUnique({
      where: { userId },
      include: {
        socialMedia: true,
        projects: true,
      },
    });

    if (!existingOrganization) {
      throw new AppError('Organization profile not found', 404);
    }

    const updatedOrganization = await prisma.organization.update({
      where: { userId },
      data: {
        name: organizationData.name,
        description: organizationData.description,
        website: organizationData.website,
        logoUrl: organizationData.logoUrl,
        socialMedia: {
          deleteMany: { organizationId: existingOrganization.id },
          create: organizationData.socialMedia?.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        },
      },
      include: {
        socialMedia: true,
        projects: true,
      },
    });

    return updatedOrganization ? mapPrismaOrganizationToCustomOrganization(updatedOrganization) : null;
  } catch (error) {
    throw new AppError('Error updating organization profile', 500);
  }
};

// Manage Organization Verification (Admin)
export const setOrganizationVerification = async (
  organizationId: string,
  isVerified: boolean
): Promise<Organization | null> => {
  try {
    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: { isVerified },
      include: { socialMedia: true, projects: true },
    });

    return organization ? mapPrismaOrganizationToCustomOrganization(organization) : null;
  } catch (error) {
    throw new AppError('Error managing organization verification', 500);
  }
};

// Retrieve Organizations and their Projects
export const getAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        socialMedia: true,
        projects: true,
      },
    });

    return organizations.map(mapPrismaOrganizationToCustomOrganization);
  } catch (error) {
    throw new AppError('Error retrieving organizations', 500);
  }
};

// Delete Organization (User or Admin)
export const deleteOrganization = async (organizationId: string): Promise<Organization | null> => {
  try {
    const deletedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: { isDeleted: true },
      include: { socialMedia: true, projects: true },
    });

    return deletedOrganization ? mapPrismaOrganizationToCustomOrganization(deletedOrganization) : null;
  } catch (error) {
    throw new AppError('Error deleting organization', 500);
  }
};


// Retrieve Organization Profile by User ID (User)
export const getOrganizationProfileByUserId = async (userId: string): Promise<Organization | null> => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { userId },
      include: {
        socialMedia: true,
        projects: true,
      },
    });

    return organization ? mapPrismaOrganizationToCustomOrganization(organization) : null;
  } catch (error) {
    throw new AppError('Error retrieving organization profile', 500);
  }
};

// Retrieve Organization Profile by Organization ID (Public/Admin)
export const getOrganizationProfileById = async (organizationId: string): Promise<Organization | null> => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        socialMedia: true,
        projects: true,
      },
    });

    return organization ? mapPrismaOrganizationToCustomOrganization(organization) : null;
  } catch (error) {
    throw new AppError('Error retrieving organization profile', 500);
  }
};