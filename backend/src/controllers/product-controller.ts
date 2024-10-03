import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.find({})
    .then((products) => {
      res.status(200).send({ items: products, total: products.length });
    })
    .catch((error) => next(error));
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const { title, image, category, description, price } = req.body;
  Product.create({ title, image, category, description, price })
    .then((product) => {
      res.status(201).send(product);
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError("Товар с таким заголовком уже существует"))
      }
      return next(new BadRequestError(error))
    });
}