import { Request, Response, NextFunction } from 'express';
import fs from 'node:fs/promises';
import path from 'path';
import BadRequestError from '../errors/bad-request-error';
import config from '../config';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('Файл не был загружен');
    }
    const publicImageDir = path.join(__dirname, '..', config.PUBLIC_IMAGES_DIR);

    await fs.rename(
      file.path,
      path.join(publicImageDir, file.filename),
    );

    return res.send({
      fileName: `/images/${file.filename}`,
      originalName: file.originalname,
    });
  } catch (error) {
    return next(error);
  }
};

export default uploadFile;
