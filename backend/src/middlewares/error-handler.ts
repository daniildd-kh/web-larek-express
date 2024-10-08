import { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import Unauthorized from '../errors/unauthorized';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (
    err instanceof BadRequestError
    || err instanceof ConflictError
    || err instanceof NotFoundError
    || err instanceof Unauthorized
  ) {
    return res.status((err as any).statusCode).send({ message: err.message });
  }

  return res.status(500).send({ message: 'Произошла ошибка на сервере' });
};

export default errorHandler;
