import { Router } from 'express';
import productRouter from './product-router';
import orderRouter from './order-router';

const router = Router();

router.use('/product', productRouter);
router.use('/order', orderRouter);

export default router;
