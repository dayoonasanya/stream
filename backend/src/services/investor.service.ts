import prisma from '../config/database.config';
import logger from '../config/logger.config';
import { InvestorProfile } from '../interfaces';
import { AppError } from '../middlewares/error.middleware';

// Helper function to map Prisma's InvestorProfile to your custom InvestorProfile interface
const mapPrismaInvestorToCustomInvestor = (prismaInvestor: any): InvestorProfile => {
  return {
    id: prismaInvestor.id,
    userId: prismaInvestor.userId,
    investmentBudget: prismaInvestor.investmentBudget,
    interests: prismaInvestor.interests || [],
    socialMedia: prismaInvestor.socialMedia || [],
    createdAt: prismaInvestor.createdAt,
    updatedAt: prismaInvestor.updatedAt,
  };
};

// Create Investor Profile (User)
export const createInvestorProfile = async (
  userId: string,
  investorData: Partial<InvestorProfile>
): Promise<InvestorProfile | null> => {
  try {
    // Check if the investor profile already exists
    const existingInvestorProfile = await prisma.investorProfile.findUnique({
      where: { userId },
    });

    if (existingInvestorProfile) {
      throw new AppError('Investor profile already exists', 400);
    }

    const investorProfile = await prisma.investorProfile.create({
      data: {
        userId,
        investmentBudget: investorData.investmentBudget!,
        interests: investorData.interests!,
        socialMedia: {
          create: investorData.socialMedia?.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        },
      },
      include: {
        socialMedia: true,
      },
    });

    return mapPrismaInvestorToCustomInvestor(investorProfile);
  } catch (error) {
    throw new AppError('Error creating investor profile', 500);
  }
};

// Update Investor Profile (User)
export const updateInvestorProfile = async (
  userId: string,
  investorData: Partial<InvestorProfile>
): Promise<InvestorProfile | null> => {
  try {
    const existingInvestorProfile = await prisma.investorProfile.findUnique({
      where: { userId },
    });

    if (!existingInvestorProfile) {
      throw new AppError('Investor profile not found', 404);
    }

    const updatedInvestorProfile = await prisma.investorProfile.update({
      where: { userId },
      data: {
        investmentBudget: investorData.investmentBudget,
        interests: investorData.interests,
        socialMedia: {
          deleteMany: { investorProfileId: existingInvestorProfile.id },
          create: investorData.socialMedia?.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        },
      },
      include: {
        socialMedia: true,
      },
    });

    return mapPrismaInvestorToCustomInvestor(updatedInvestorProfile);
  } catch (error) {
    throw new AppError('Error updating investor profile', 500);
  }
};

// Retrieve All Investors
export const getAllInvestors = async (): Promise<InvestorProfile[]> => {
  try {
    const investors = await prisma.investorProfile.findMany({
      include: {
        socialMedia: true,
      },
    });

    return investors.map(mapPrismaInvestorToCustomInvestor);
  } catch (error) {
    throw new AppError('Error retrieving investors', 500);
  }
};

// Get Investor by User ID
export const getInvestorById = async (userId: string): Promise<InvestorProfile | null> => {
  try {
    const investorProfile = await prisma.investorProfile.findUnique({
      where: { userId },
      include: {
        socialMedia: true,
      },
    });

    if (!investorProfile) {
      logger.warn(`Investor profile not found for userId: ${userId}`);
      // Respond with 404 if the profile doesn't exist
      throw new AppError('Investor profile not found. Please create a profile.', 404);
    }

    return mapPrismaInvestorToCustomInvestor(investorProfile);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error retrieving investor profile for userId: ${userId} - ${error.message}`);
      throw new AppError('Error retrieving investor profile', 500);
    } else {
      logger.error(`Unknown error retrieving investor profile for userId: ${userId}`);
      throw new AppError('Unknown error retrieving investor profile', 500);
    }
  }
};
