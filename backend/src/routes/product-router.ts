import { Router } from 'express';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
} from '../controllers/product-controller';
import { validateProductBody, validateProductUpdateBody } from '../middlewares/validations';
import fileMiddleware from '../middlewares/file';
import validateObjId from '../middlewares/validateObjId';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.post('/', auth, validateProductBody, fileMiddleware.single('file'), createProduct);
router.patch('/:productId', auth, validateObjId, validateProductUpdateBody, fileMiddleware.single('file'), updateProduct);
router.delete('/:productId', auth, validateObjId, deleteProduct);

export default router;
