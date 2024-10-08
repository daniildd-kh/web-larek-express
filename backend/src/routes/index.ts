import { Router } from 'express';
import productRouter from './product-router';
import orderRouter from './order-router';
import authRouter from './auth-router';
import uploadRouter from './upload-router';

const router = Router();

router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use('/auth', authRouter);
router.use('/upload', uploadRouter);

export default router;
