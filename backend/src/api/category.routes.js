import { Router } from 'express';
import { categoryController } from '../modules/category/category.controller.js';
import { authenticate } from '../common/auth.middleware.js';

const router = Router();

// مسارات عامة
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/:slug/products', categoryController.getCategoryProducts);

// مسارات محمية
router.post('/', authenticate, categoryController.createCategory);
router.put('/:id', authenticate, categoryController.updateCategory);
router.delete('/:id', authenticate, categoryController.deleteCategory);

export default router;
