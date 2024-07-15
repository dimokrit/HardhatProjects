import { Router } from 'express';
import dataService from '../controllers/data.controller.js';


const router = new Router();

router.get('/upgrades', dataService.upgrades);
router.get('/tasks', dataService.tasks);

export default router;