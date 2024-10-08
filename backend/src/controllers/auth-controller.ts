import {
  NextFunction, Request, Response, CookieOptions,
} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import User from '../models/user';
import config from '../config';
import Unauthorized from '../errors/unauthorized';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

interface UserRequest extends Request {
  user?: any;
}

const REFRESH_TOKEN: { cookie: { name: string; options: CookieOptions } } = {
  cookie: {
    name: 'refreshToken',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(config.AUTH_REFRESH_TOKEN_EXPIRY),
      path: '/',
    },
  },
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const refreshToken = user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options,
    );
    return res.send({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(
        new ConflictError('Пользователь с таким email уже существует'),
      );
    }
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const refreshToken = user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options,
    );

    return res.send({
      success: true,
      user: {
        email: user.email,
        name: user.name,
      },
      accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(new Unauthorized(error.message));
    }
  }
};

export const logout = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;
  try {
    if (!refreshToken) {
      throw new Unauthorized('Необходима авторизация');
    }
    res.clearCookie(REFRESH_TOKEN.cookie.name, REFRESH_TOKEN.cookie.options);
    return res.send({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = req.cookies || {};
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
    const { accessToken } = cookies;
    if (!refreshToken) {
      throw new Unauthorized('Невалидный токен');
    }
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET_KEY) as {
      _id: string;
    };
    const userWithToken = await User.findOne({ _id: decoded._id }).select('+tokens.token');
    if (!userWithToken) {
      throw new NotFoundError('Пользователь не найден');
    }
    if (accessToken) {
      await userWithToken.removeAccessToken(accessToken);
    }

    const newRefreshToken = userWithToken.generateRefreshToken();
    const newAccessToken = await userWithToken.generateAccessToken();

    res.cookie(
      REFRESH_TOKEN.cookie.name,
      newRefreshToken,
      REFRESH_TOKEN.cookie.options,
    );

    return res.send({
      user: {
        email: userWithToken.email,
        name: userWithToken.name,
      },
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = await User.findUserByToken(req.headers);

    return res.send({
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
      },
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
