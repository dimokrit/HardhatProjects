import  web3Controller  from "../controllers/web3.controller.js"
import { Router } from 'express';

const router = new Router();

router.post('/web3Auth', web3Controller.web3Auth);

export default router;
