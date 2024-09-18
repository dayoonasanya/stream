import { Transaction } from './transaction';
import { Organization } from './organization';
import { Startup } from './startup';

export enum ProjectType {
  ORGANIZATION_PROJECT = 'ORGANIZATION_PROJECT',
  STARTUP_PROJECT = 'STARTUP_PROJECT',
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  organization?: Organization;
  startupId?: string;
  startup?: Startup;
  images: ProjectImage[];
  githubLink?: string;
  landingPageLink?: string;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}