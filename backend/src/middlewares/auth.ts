import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import Unauthorized from '../errors/unauthorized';

interface UserRequest extends Request{
  user?: Object;
}

export default (req: UserRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, config.JWT_ACCESS_SECRET_KEY);
  } catch {
    next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
