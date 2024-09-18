import { UserRole } from '../enums/enums';
import { Project } from './project.interface';
import { Transaction } from './transaction.interface';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isActivated: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile;
  organization?: Organization;
  startup?: Startup;
  investorProfile?: InvestorProfile;
  transactions: Transaction[];
  SocialMediaLink: SocialMediaLink[];
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  userId: string;
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  isVerified: boolean;
  isDeleted: boolean;
  socialMedia: SocialMediaLink[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Startup {
  id: string;
  userId: string;
  name: string;
  description: string;
  website?: string;
  project?: Project;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestorProfile {
  id: string;
  userId: string;
  investmentBudget?: number;
  interests: string[];
  socialMedia: SocialMediaLink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  userId?: string;
  organizationId?: string;
  investorProfileId?: string;
  createdAt: Date;
  updatedAt: Date;
}
