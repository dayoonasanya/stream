import prisma from '../config/database.config';
import { hash, compare } from 'bcrypt';
import { UserRole } from '../enums';
import { User, Profile, SocialMediaLink } from '../interfaces';
import { AppError } from '../middlewares/error.middleware';
import { env } from '../config/env.config';
import { sign, verify } from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../emails/utils/reset';
import { sendNewContactNotification, sendThankYouEmail } from '../emails/utils/contact-us';

// Helper function to map Prisma's UserRole to your custom UserRole
const mapPrismaRoleToUserRole = (prismaRole: string): UserRole => {
  switch (prismaRole) {
    case 'ADMIN':
      return UserRole.ADMIN;
    case 'INVESTOR':
      return UserRole.INVESTOR;
    case 'ORGANIZATION':
      return UserRole.ORGANIZATION;
    case 'STARTUP':
      return UserRole.STARTUP;
    default:
      throw new Error('Invalid role');
  }
};

// Helper function to map Prisma's User to your custom User interface
const mapPrismaUserToCustomUser = (prismaUser: any): User => {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    password: prismaUser.password,
    role: mapPrismaRoleToUserRole(prismaUser.role),
    isActivated: prismaUser.isActivated,
    isDeleted: prismaUser.isDeleted,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    profile: prismaUser.profile || null,
    organization: prismaUser.organization || null,
    startup: prismaUser.startup || null,
    investorProfile: prismaUser.investorProfile || null,
    transactions: prismaUser.transactions || [],
    SocialMediaLink: prismaUser.SocialMediaLink || [],
  };
};

// Get All Users (Admin only)
export const getAllUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      organization: true,
      startup: true,
      investorProfile: true,
      transactions: true,
      SocialMediaLink: true,
    },
  });

  return users.map(mapPrismaUserToCustomUser);
};

// Get User by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      organization: true,
      startup: true,
      investorProfile: true,
      transactions: true,
      SocialMediaLink: true,
    },
  });

  return user ? mapPrismaUserToCustomUser(user) : null;
};

// Get Users by Role (Admin only)
export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: { role },
    include: {
      profile: true,
      organization: true,
      startup: true,
      investorProfile: true,
      transactions: true,
      SocialMediaLink: true,
    },
  });

  return users.map(mapPrismaUserToCustomUser);
};
export const updateProfile = async (
  userId: string,
  profileData: Profile,
  socialMediaLinks: SocialMediaLink[]
): Promise<User | null> => {
  // Ensure profile exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    // Create profile if it doesn't exist
    await prisma.profile.create({
      data: {
        userId,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
        avatar: profileData.avatar,
      },
    });
  }

  // Update user profile and social media links
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        update: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          bio: profileData.bio,
          avatar: profileData.avatar,
        },
      },
      SocialMediaLink: {
        deleteMany: { userId },
        create: socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
      },
    },
    include: {
      profile: true,
      SocialMediaLink: true,
    },
  });

  return updatedUser ? mapPrismaUserToCustomUser(updatedUser) : null;
};

// Activate/Deactivate (User) && (Admin)
export const setAccountStatus = async (
  userId: string,
  isActivated: boolean
): Promise<User | null> => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActivated },
  });

  return updatedUser ? mapPrismaUserToCustomUser(updatedUser) : null;
};

// Delete User (User or Admin)
export const deleteUser = async (userId: string): Promise<User | null> => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  });

  return updatedUser ? mapPrismaUserToCustomUser(updatedUser) : null;
};

// Change Password (User)
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError('User not found', 404);

  const isPasswordValid = await compare(currentPassword, user.password);
  if (!isPasswordValid) throw new AppError('Invalid current password', 400);

  const hashedNewPassword = await hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};

// Forgot Password (Send reset link via email)
export const generatePasswordResetLink = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new AppError('User not found', 404);

  const resetToken = sign(
    { email: user.email },
    env.jwtSecret,
    { expiresIn: '1h' }
  );

  
  await sendResetPasswordEmail(email, resetToken);
};

// Function to verify the reset token
export const verifyResetToken = (token: string): string => {
  try {
    const decoded = verify(token, env.jwtSecret) as { email: string };
    return decoded.email;
  } catch (error) {
    throw new AppError('Invalid or expired token', 400);
  }
};

// Reset Password (Service Layer Logic)
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const email = verifyResetToken(token);

  
  const hashedNewPassword = await hash(newPassword, 10);

  
  await prisma.user.update({
    where: { email },
    data: { password: hashedNewPassword },
  });
};