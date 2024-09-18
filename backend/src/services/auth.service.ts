import prisma from '../config/database.config';
import { hash, compare } from 'bcrypt';
import { generateToken } from '../config/jwt.config';
import { UserRole } from '../enums';
import { AppError, AuthRequest } from '../middlewares';
import { User } from '../interfaces';
import { sendWelcomeEmail } from '../emails/utils/welcome';
import { sendNewAdminEmail } from '../emails/utils/admin';

// Helper function to map Prisma's UserRole to the custom enum UserRole
export const mapPrismaRoleToUserRole = (prismaRole: string): UserRole => {
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

// Helper function to map Prisma's user to the custom User interface
export const mapPrismaUserToCustomUser = (prismaUser: any): User => {
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

// Register User with welcome email functionality
export const registerUser = async (email: string, password: string, role: UserRole): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      isActivated: true,
    },
    include: {
      profile: true,
      organization: true,
      startup: true,
      investorProfile: true,
      transactions: true,
      SocialMediaLink: true,
    },
  });

  const customUser = mapPrismaUserToCustomUser(newUser);

  
  await sendWelcomeEmail(customUser);

  return customUser;
};

// Login User
export const loginUser = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
      organization: true,
      startup: true,
      investorProfile: true,
      transactions: true,
      SocialMediaLink: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isActivated) {
    throw new Error('Account is not activated');
  }

  const isValidPassword = await compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id, mapPrismaRoleToUserRole(user.role));

  return {
    token,
    user: mapPrismaUserToCustomUser(user),
  };
};


export const addAdmin = async (adminEmail: string, password: string, currentUserId: string): Promise<User> => {
  const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    throw new AppError('Unauthorized: Only admins can add another admin', 403);
  }

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existingAdmin) {
    throw new AppError('User with this email already exists', 400);
  }

  const hashedPassword = await hash(password, 10);

  const newAdmin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActivated: true,
    },
    include: {
      profile: true,
      organization: true,
      startup: true,
      investorProfile: true,
      transactions: true,
      SocialMediaLink: true,
    },
  });

  const customAdmin = mapPrismaUserToCustomUser(newAdmin);

  await sendNewAdminEmail(customAdmin, password);

  return customAdmin;
};