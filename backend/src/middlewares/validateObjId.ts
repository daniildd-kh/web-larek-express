import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';

const validateObjId = (req: Request, _res: Response, next: NextFunction) => {
  const { productId } = req.params;

  if (!Types.ObjectId.isValid(productId)) {
    return next(new BadRequestError('Передан не валидный ID товара'));
  }

  return next();
};

export default validateObjId;
