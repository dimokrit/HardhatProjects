import  XController  from "../controllers/x.controller.js"
import { Router } from 'express';

const router = new Router();

router.get('/callback', XController.callback);
router.get('/checkSub', XController.checkSub);
router.get('/checkLike', XController.checkLike);
router.get('/checkRetweet', XController.checkRetweet);
export default router;
