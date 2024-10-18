import { Router } from 'express';
import { makeOrder } from '../controllers/order-controller';
import { validateOrderBody } from '../middlewares/validations';

const router = Router();

router.post('/', validateOrderBody, makeOrder);

export default router;
