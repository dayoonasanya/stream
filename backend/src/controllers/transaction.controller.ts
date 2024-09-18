import { Request, Response, NextFunction } from 'express';
import * as transactionService from '../services/transaction.service';
import { TransactionStatus } from '../enums/enums';
import { AppError } from '../middlewares/error.middleware';

// Helper function to handle errors
const handleControllerError = (error: any, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error,
    });
  }
  next(error);
};

// Process a Transaction (Donation or Investment)
export const processTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, amount, projectId, investorId } = req.body;
    const transaction = await transactionService.processTransaction({ type, amount, projectId, investorId });
    res.status(201).json({
      message: 'Transaction processed successfully',
      data: transaction,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Update Transaction Status (Stripe Webhook)
export const updateTransactionStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stripePaymentId, status } = req.body;
    const updatedTransaction = await transactionService.updateTransactionStatus(stripePaymentId, status as TransactionStatus);
    res.status(200).json({
      message: 'Transaction status updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get Transaction by ID
export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    res.status(200).json(transaction);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Get All Transactions for a Project
export const getTransactionsByProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await transactionService.getTransactionsByProject(req.params.projectId);
    res.status(200).json(transactions);
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// Calculate Investor Share Percentage for Equity Investment
export const calculateInvestorShare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId, investorId, investmentAmount } = req.body;
    const sharePercent = await transactionService.calculateInvestorShare(projectId, investorId, investmentAmount);
    res.status(200).json({
      message: 'Investor share percentage calculated successfully',
      sharePercent,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};