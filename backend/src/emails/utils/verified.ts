import sendMail from '../email.service';
import { EmailOptions } from '../interfaces/email.interface';
import { Organization } from '../../interfaces';
import { User } from '../../interfaces/user.interface';
import logger from '../../config/logger.config';

/**
 * Function to send verification
 * @param user
 * @param organization
 */
export const sendOrganizationVerifiedEmail = async (user: User, organization: Organization) => {
  const emailOptions: EmailOptions = {
    email: user.email,
    subject: `Your organization ${organization.name} has been verified!`,
    template: 'verified',
    body: {
      user: {
        firstName: user.profile?.firstName || '',
      },
      organization: {
        name: organization.name,
        description: organization.description,
      },
    },
  };

  try {
    await sendMail(emailOptions);
    logger.info(`Verification email sent to ${user.email}`);
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to send verification email:', err.message || err);
  }
};
