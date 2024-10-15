import { Router } from 'express';
import {
  register, login, logout, refreshAccessToken, getCurrentUser,
} from '../controllers/auth-controller';
import { validateRegisterBody, validateLoginBody } from '../middlewares/validations';
import auth from '../middlewares/auth';

const router = Router();

router.post('/login', validateLoginBody, login);
router.post('/register', validateRegisterBody, register);
router.get('/token', refreshAccessToken);
router.get('/logout', logout);
router.get('/user', auth, getCurrentUser);

export default router;
