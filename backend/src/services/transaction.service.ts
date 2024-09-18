import prisma from '../config/database.config';
import { TransactionType, TransactionStatus } from '../enums/enums';
import { Transaction } from '../interfaces';
import { AppError } from '../middlewares/error.middleware';
import { env } from '../config/env.config';

// Stripe integration
import Stripe from 'stripe';
const stripe = new Stripe(env.stripeSecretKey as string, {
  apiVersion: '2024-06-20',
});

// Helper function to map Prisma's Transaction to your custom Transaction interface
const mapPrismaTransactionToCustomTransaction = (prismaTransaction: any): Transaction => {
  return {
    id: prismaTransaction.id,
    type: prismaTransaction.type,
    amount: prismaTransaction.amount,
    platformFee: prismaTransaction.platformFee,
    finalAmount: prismaTransaction.finalAmount,
    investorId: prismaTransaction.investorId,
    projectId: prismaTransaction.projectId,
    sharePercent: prismaTransaction.sharePercent,
    stripePaymentId: prismaTransaction.stripePaymentId,
    status: prismaTransaction.status,
    createdAt: prismaTransaction.createdAt,
    updatedAt: prismaTransaction.updatedAt,
  };
};

// Calculate platform fees (5% of the amount)
const calculatePlatformFee = (amount: number): number => {
  return amount * 0.05;
};

// Process Donation or Investment
export const processTransaction = async (
  transactionData: Partial<Transaction>
): Promise<Transaction | null> => {
  if (!transactionData.type || !transactionData.amount || !transactionData.projectId || !transactionData.investorId) {
    throw new AppError('Missing required transaction data', 400);
  }

  try {
    // Create a Stripe payment intent for processing
    const paymentIntent = await stripe.paymentIntents.create({
      amount: transactionData.amount * 100,
      currency: 'usd',
      metadata: {
        type: transactionData.type,
        projectId: transactionData.projectId,
        investorId: transactionData.investorId,
      },
    });

    const platformFee = calculatePlatformFee(transactionData.amount);
    const finalAmount = transactionData.amount - platformFee;

    // Determine if it's a donation or investment
    let sharePercent = null;
    if (transactionData.type === TransactionType.INVESTMENT) {
      // Calculate the investor's share percentage for equity investment
      const project = await prisma.project.findUnique({
        where: { id: transactionData.projectId },
      });

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      sharePercent = (transactionData.amount / project.targetAmount) * 100;
    }

    // Create the transaction record in the database
    const transaction = await prisma.transaction.create({
      data: {
        type: transactionData.type,
        amount: transactionData.amount,
        platformFee,
        finalAmount,
        investorId: transactionData.investorId,
        projectId: transactionData.projectId,
        stripePaymentId: paymentIntent.id,
        sharePercent, // Only applicable for investments
        status: TransactionStatus.PENDING,
      },
    });

    // Update the project's current amount
    await prisma.project.update({
      where: { id: transactionData.projectId },
      data: {
        currentAmount: {
          increment: finalAmount,
        },
      },
    });

    return mapPrismaTransactionToCustomTransaction(transaction);
  } catch (error) {
    throw new AppError('Error processing transaction', 500);
  }
};

// Update Transaction Status (Stripe Webhook)
export const updateTransactionStatus = async (
  stripePaymentId: string,
  status: TransactionStatus
): Promise<Transaction | null> => {
  try {
    // First, find the transaction by stripePaymentId
    const transaction = await prisma.transaction.findFirst({
      where: { stripePaymentId },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    // Update the transaction status using the transaction's id
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status },
    });

    return mapPrismaTransactionToCustomTransaction(updatedTransaction);
  } catch (error) {
    throw new AppError('Error updating transaction status', 500);
  }
};

// Get Transaction by ID
export const getTransactionById = async (transactionId: string): Promise<Transaction | null> => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    return mapPrismaTransactionToCustomTransaction(transaction);
  } catch (error) {
    throw new AppError('Error retrieving transaction', 500);
  }
};

// Get All Transactions for a Project
export const getTransactionsByProject = async (projectId: string): Promise<Transaction[]> => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { projectId },
    });

    return transactions.map(mapPrismaTransactionToCustomTransaction);
  } catch (error) {
    throw new AppError('Error retrieving transactions', 500);
  }
};

// Calculate Investor Share Percentage for Equity Investment
export const calculateInvestorShare = async (
  projectId: string,
  investorId: string,
  investmentAmount: number
): Promise<number> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Calculate the investor's share percentage based on their investment amount
    const sharePercent = (investmentAmount / project.targetAmount) * 100;

    return sharePercent;
  } catch (error) {
    throw new AppError('Error calculating investor share percentage', 500);
  }
};