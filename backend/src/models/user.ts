import mongoose, { Schema, model, Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IncomingHttpHeaders } from 'http';
import config from '../config';
import NotFoundError from '../errors/not-found-error';
import { parseAndDecodeAccessToken } from '../utils';
import Unauthorized from '../errors/unauthorized';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  tokens: Array<{ token: string }>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): string;
  removeAccessToken(token: string): Promise<void>;
  save(): Promise<IUser>;
}

type TUserWithToken = {
  user: IUser;
  accessToken: string;
};

export type UserDocument = IUser & Document;

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<IUser>;
  findUserByToken: (
    authorization: IncomingHttpHeaders
  ) => Promise<TUserWithToken>;
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String, minlength: 2, maxlength: 30, default: 'Ё-мое',
  },
  email: { type: String, required: true, unique: true },
  password: {
    type: String, minlength: 6, required: true, select: false,
  },
  tokens: [
    {
      _id: false,
      token: {
        type: String,
        select: false,
      },
    },
  ],
});

userSchema.method('generateAccessToken', async function generateAccessToken() {
  const user = this;

  const accessToken = jwt.sign(
    { _id: user._id },
    config.JWT_ACCESS_SECRET_KEY,
    {
      expiresIn: config.AUTH_ACCESS_TOKEN_EXPIRY,
    },
  );
  user.tokens.push({ token: accessToken });
  await user.save();
  return accessToken;
});

userSchema.method('generateRefreshToken', function generateRefreshToken() {
  const user = this;

  const refreshToken = jwt.sign(
    { _id: user._id },
    config.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: config.AUTH_REFRESH_TOKEN_EXPIRY,
    },
  );
  return refreshToken;
});

userSchema.method('removeAccessToken', async function removeAccessToken(accessToken: string) {
  const user = this;
  user.tokens = user.tokens.filter((token) => token.token !== accessToken);

  await user.save();
});

userSchema.static(
  'findUserByCredentials',
  async function findUserByCredentials(email: string, password: string) {
    const user = await this.findOne({ email }).select('+password').select('+tokens.token');
    if (!user) {
      throw new Error('Неправильные почта или пароль');
    }
    const checkedPassStatus = await bcrypt.compare(password, user.password);

    if (!checkedPassStatus) {
      throw new Error('Неправильные почта или пароль');
    }
    return user;
  },
);

userSchema.static(
  'findUserByToken',
  async (headers: IncomingHttpHeaders) => {
    try {
      const { authorization } = headers;
      if (!authorization) {
        throw new Unauthorized('Необходима авторизация');
      }
      const { accessToken, decodedToken } = parseAndDecodeAccessToken(authorization);

      const userId = decodedToken._id;
      const user = await User.findById(userId).select('+tokens.token');

      if (!user) {
        throw new NotFoundError(
          'Пользователь по заданному id отсутствует в базе',
        );
      }

      return { user, accessToken };
    } catch (err) {
      throw err;
    }
  },
);

const User = model<IUser, UserModel>('User', userSchema);

export default User;
