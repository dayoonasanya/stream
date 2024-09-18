import sendMail from '../email.service';
import { EmailOptions } from '../interfaces/email.interface';
import logger from '../../config/logger.config';

/**
 * Function to send newsletter subscription email
 * @param email 
 */
export const sendNewsletterSubscriptionEmail = async (email: string) => {
  const emailOptions: EmailOptions = {
    email,
    subject: 'Thank you for subscribing to our newsletter!',
    template: 'subscribe',
    body: {
      email,
    },
  };

  try {
    await sendMail(emailOptions);
    logger.info(`Newsletter subscription email sent to ${email}`);
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to send newsletter subscription email:', err.message || err);
  }
};