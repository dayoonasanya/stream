import sendMail from '../email.service';
import { EmailOptions } from '../interfaces/email.interface';
import { User } from '../../interfaces/user.interface';
import logger from '../../config/logger.config';

/**
 * Function to a new admin
 * @param user
 * @param password 
 */
export const sendNewAdminEmail = async (user: User, password: string) => {
  const emailOptions: EmailOptions = {
    email: user.email,
    subject: 'You are a new admin',
    template: 'admin',
    body: {
      email: user.email,
      role: user.role,
      password,
    },
  };

  try {
    await sendMail(emailOptions);
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to send welcome email:', err.message || err);
  }
};