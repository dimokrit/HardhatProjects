import  AchivmentsController  from "../controllers/achivments.controller.js"
import { Router } from 'express';

const router = new Router();

router.post('/youtubeSub', AchivmentsController.youtubeSub);
router.post('/youtubeWatch', AchivmentsController.youtubeWatch);
router.post('/instaSub', AchivmentsController.instaSub);
router.post('/checkLink', AchivmentsController.checkLink);
export default router;
