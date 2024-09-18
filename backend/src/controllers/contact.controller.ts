import { Request, Response, NextFunction } from 'express';
import * as contactService from '../services/contact.service';
import { AppError } from '../middlewares/error.middleware';
import { sendNewsletterSubscriptionEmail } from '../emails/utils/subscribe';

export const submitContactForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;
    await contactService.submitContactForm(name, email, subject, message);
    
    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

export const subscribeNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    await sendNewsletterSubscriptionEmail(email);

    res.status(200).json({
      message: 'Subscription successful! A confirmation email has been sent.',
    });
  } catch (error) {
    next(error);
  }
};