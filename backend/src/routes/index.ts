import { Router } from "express";
import productRouter from "./product-router";
import orderRouter from "./order-router";
import authRouter from "./auth-router";
import uploadRouter from "./upload-router";
import NotFoundError from "../errors/not-found-error";

const router = Router();

router.use("/product", productRouter);
router.use("/order", orderRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);

router.use((_req, _res, next) => {
  return next(new NotFoundError("Маршрут не найден"));
});
export default router;
