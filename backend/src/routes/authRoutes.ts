import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getLoggedInUser
} from '../services/authService';
import { authenticate } from '../middlewares/authenticate';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticate, logoutUser);
router.get('/me', authenticate, getLoggedInUser);

export default router;