import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import Product from '../models/product';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import config from '../config';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find({});
    res.send({ items: products, total: products.length });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title, description, category, price, image,
    } = req.body;

    if (image && req.file) {
      const tempPath = req.file.path;
      const publicImageDir = path.join(__dirname, '..', config.PUBLIC_IMAGES_DIR);
      const permanentPath = path.join(publicImageDir, image.fileName);

      await fs.rename(tempPath, permanentPath);
    }

    const newProduct = await Product.create({
      title,
      description,
      category,
      price,
      image: {
        fileName: image.fileName,
        originalName: image.originalName,
      },
    });
    return res.status(201).send(newProduct);
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Поле title должно быть уникальным'));
    }
    return next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;
  const updates = req.body;

  try {
    if (updates.image && req.file) {
      const tempPath = req.file.path;
      const publicImageDir = path.join(__dirname, '..', config.PUBLIC_IMAGES_DIR);
      const permanentPath = path.join(
        publicImageDir,
        updates.image.fileName,
      );

      await fs.rename(tempPath, permanentPath);
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw new NotFoundError('Нет товара по заданному id');
    }

    return res.send(updatedProduct);
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Поле title должно быть уникальным'));
    }
    return next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: productId });

    if (!deletedProduct) {
      throw new NotFoundError('Нет товара по заданному id');
    }

    return res.send(deletedProduct);
  } catch (error) {
    return next(error);
  }
};
