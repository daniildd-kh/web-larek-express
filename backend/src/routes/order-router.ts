import {makeOrder } from "../controllers/order-controller";
import { validateOrderBody } from "../middlewares/validations";
import { Router } from "express";

const router = Router();

router.post('/', validateOrderBody, makeOrder);


export default router;