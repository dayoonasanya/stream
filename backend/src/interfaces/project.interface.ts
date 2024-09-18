import { ProjectType } from '../enums/enums';
import { Transaction } from './transaction.interface';

export interface Project {
  id: string;
  type: ProjectType;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  public: boolean;
  category?: string;
  organizationId?: string;
  startupId?: string;
  images: ProjectImage[];
  githubLink?: string;
  landingPageLink?: string;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}