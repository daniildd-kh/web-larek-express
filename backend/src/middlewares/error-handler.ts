import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import NotFoundError from "../errors/not-found-error";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  if (err instanceof ConflictError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res.status(500).send({ message: "Произошла ошибка на сервере" });
};

export default errorHandler;
