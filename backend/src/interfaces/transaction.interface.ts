import { TransactionType, TransactionStatus } from '../enums/enums';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  platformFee?: number;
  finalAmount?: number;
  investorId: string;
  projectId: string;
  sharePercent?: number;
  stripePaymentId?: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
