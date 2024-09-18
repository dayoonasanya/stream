import sendMail from '../email.service';
import { EmailOptions } from '../interfaces/email.interface';
import { Organization } from '../../interfaces';
import logger from '../../config/logger.config';

/**
 * Function to send an email
 * @param userEmail
 * @param organization
 */
export const sendOrganizationCreatedEmail = async (userEmail: string, organization: Organization) => {
  const emailOptions: EmailOptions = {
    email: userEmail,
    subject: 'Organization Created Successfully',
    template: 'organization',
    body: {
      organization,
    },
  };

  try {
    await sendMail(emailOptions);
    logger.info(`Organization creation email sent to ${userEmail}`);
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to send organization creation email:', err.message || err);
  }
};
