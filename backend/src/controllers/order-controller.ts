import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

export const makeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { items, total } = req.body;
  try {
    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      const foundProductID = products.map((product) => product._id.toString());
      const missingProductID = items.filter(
        (item: string) => !foundProductID.includes(item),
      );

      throw new BadRequestError(`Товар с id ${missingProductID} не найден`);
    }
    products.forEach((product) => {
      if (product.price === null) {
        throw new BadRequestError(
          `Товар с id ${product._id.toString()} не продается`,
        );
      }
    });

    const productsSum = products.reduce((sum, product) => sum + product.price, 0);
    if (total !== productsSum) {
      throw new BadRequestError('Неверная сумма заказа');
    }
    return res.send({ id: faker.string.uuid(), total: productsSum });
  } catch (error) {
    return next(error);
  }
};
