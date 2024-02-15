import  telegramController  from "../controllers/telegram.controller.js"
import { Router } from 'express';

const router = new Router();

router.get('/checkSub', telegramController.checkSub);
router.get('/tgAuthCallback', telegramController.tgAuthCallback);
router.get('/tgCallback', telegramController.tgLoginCallback);

export default router;
