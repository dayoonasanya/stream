import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';

const router = Router();

router.post('/', contactController.submitContactForm);
router.post('/subscribe', contactController.subscribeNewsletter);


export default router;