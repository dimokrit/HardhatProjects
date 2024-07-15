import { Router } from 'express';
import userController from '../controllers/user.controller.js';


const router = new Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/hit', userController.hit);
router.post('/heal', userController.heal);
router.post('/task', userController.task);
router.post('/daily', userController.daily);
router.post('/upgrade', userController.upgrade);

router.get('/auth', userController.auth);
router.get('/photo', userController.photo);
router.get('/jwt', userController.jwt);
router.get('/friends', userController.friends);

export default router;