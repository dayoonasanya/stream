import sendMail from '../email.service';
import { EmailOptions } from '../interfaces/email.interface';
import logger from '../../config/logger.config';

// Send Thank You Email to User
export const sendThankYouEmail = async (name: string, email: string): Promise<void> => {
  const emailOptions: EmailOptions = {
    email,
    subject: 'Thank you for contacting us',
    template: 'thank-you',
    body: { name },
  };

  try {
    await sendMail(emailOptions);
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to send thank you email:', err.message || err);
  }
};

// Send Admin Notification Email
export const sendNewContactNotification = async (
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<void> => {
  const emailOptions: EmailOptions = {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: 'New Contact Request',
    template: 'new-contact',
    body: { name, email, subject, message },
  };

  try {
    await sendMail(emailOptions);
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to send new contact notification email:', err.message || err);
  }
};