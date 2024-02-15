import  gmailController  from "../controllers/gmail.controller.js"
import { Router } from 'express';

const router = new Router();

router.post('/gmailAuth', gmailController.gmailAuth);
router.post('/gmailLogin', gmailController.gmailLogin);
router.get('/gmailCallback', gmailController.gmailCallback);
router.get('/gmailAuthCallback', gmailController.gmailAuthCallback);

export default router;
