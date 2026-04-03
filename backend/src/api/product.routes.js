import { Router } from 'express';
import { productController } from '../modules/product/product.controller.js';
import { authenticate, optionalAuth } from '../common/auth.middleware.js';
import { validateProduct } from '../validators/product.validator.js';

const router = Router();

// مسارات عامة
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new', productController.getNewProducts);
router.get('/type/:type', productController.getProductsByType);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProduct);

// مسارات محمية
router.post('/', authenticate, validateProduct, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

// التقييمات
router.post('/:id/reviews', optionalAuth, productController.addReview);

export default router;
