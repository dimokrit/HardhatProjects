import { Router } from 'express';
import guildController from '../controllers/guild.controller.js';


const router = new Router();

router.post('/create', guildController.create);
router.post('/join', guildController.join);
router.post('/leave', guildController.leave);
router.post('/reward', guildController.reward);

router.get('/current', guildController.current);

export default router;