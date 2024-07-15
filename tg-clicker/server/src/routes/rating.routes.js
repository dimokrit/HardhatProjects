import { Router } from 'express';
import ratingController from '../controllers/rating.controller.js';


const router = new Router();

router.get('/users', ratingController.users);
router.get('/guilds', ratingController.guilds);

export default router;