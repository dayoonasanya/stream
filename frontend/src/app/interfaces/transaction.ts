import { Project } from './project';
import { User } from './user';

export enum TransactionType {
  DONATION = 'DONATION',
  INVESTMENT = 'INVESTMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  platformFee?: number;
  finalAmount?: number;
  investorId: string;
  investor: User;
  projectId: string;
  project: Project;
  sharePercent?: number;
  stripePaymentId?: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}