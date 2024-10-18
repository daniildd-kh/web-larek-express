import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import ConflictError from '../errors/conflict-error';
import config from '../config';

const storageConfig = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '..', config.UPLOAD_DIR);
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const fileId = uuidv4().slice(0, 8);
    const fileExt = path.extname(file.originalname);
    cb(null, `${fileId}${fileExt}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ConflictError('Недопустимый тип файла'));
  }
};

const fileMiddleware = multer({
  storage: storageConfig,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default fileMiddleware;
