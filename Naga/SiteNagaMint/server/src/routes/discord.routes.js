import  DiscordController  from "../controllers/discord.controller.js"
import { Router } from 'express';

const router = new Router();

router.get('/callback', DiscordController.callback)
router.get('/checkVerify', DiscordController.checkVerify)
export default router;
