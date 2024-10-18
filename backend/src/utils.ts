import BadRequestError from "./errors/bad-request-error";
import jwt from 'jsonwebtoken'
import config from "./config";
import { CronJob } from "cron";
import path from 'path';
import fs from "node:fs/promises";

export const parseAccessToken = (authorization?: string) => {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new BadRequestError("Неправильный токен доступа");
  }

  const accessToken = authorization.replace("Bearer ", "");
  return accessToken
}
export const parseAndDecodeAccessToken = (authorization?: string) => {
  const accessToken = parseAccessToken(authorization);
  try {
    const decodedToken = jwt.verify(
      accessToken,
      config.JWT_ACCESS_SECRET_KEY
    ) as { _id: string };

    return { accessToken, decodedToken };

  } catch (err) {
    throw new BadRequestError("Невалидный токен");
  }
};

const clearUploadDirectory = new CronJob('0 0 */6 * * *', async function () {
  const fileDirectory = path.join(__dirname, './upload');

  const clearDirectory = async () => {
    try {
      const files = await fs.readdir(fileDirectory);
      for (const file of files) {
        await fs.unlink(path.join(fileDirectory, file));
      }
    } catch (error) {
      console.error( error);
    }
  };

  await clearDirectory();
});

clearUploadDirectory.start();
