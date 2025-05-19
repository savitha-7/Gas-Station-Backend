import express from 'express';
import { changePassword, getUserInfo, login, registerUser } from '../controllers/auth.controller.js';
import { verifyToken } from "../middleware/auth.js";
import {updateUser} from '../controllers/user.controller.js'


const router = express.Router();

router.put('/', verifyToken ,updateUser)
router.post('/register', registerUser);
router.post('/login',login)
router.post('/changePassword',changePassword)
router.get('/:id',getUserInfo)

export default router;
