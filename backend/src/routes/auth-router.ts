import { Router } from 'express';
import {
  register, login, logout, refreshAccessToken, getCurrentUser,
} from '../controllers/auth-controller';
import { validateUserBody } from '../middlewares/validations';
import auth from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/register', validateUserBody, register);
router.get('/token', refreshAccessToken);
router.get('/logout', logout);
router.get('/user', auth, getCurrentUser);

export default router;
