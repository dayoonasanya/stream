import { sendThankYouEmail, sendNewContactNotification } from '../emails/utils/contact-us';
import { AppError } from '../middlewares/error.middleware';

export const submitContactForm = async (name: string, email: string, subject: string, message: string): Promise<void> => {
  if (!name || !email || !subject || !message) {
    throw new AppError('All fields are required', 400);
  }

  await sendThankYouEmail(name, email);

  await sendNewContactNotification(name, email, subject, message);
};