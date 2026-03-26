// Products Routes
import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, bulkProducts } from '../controllers/productController';
import auth from '../middleware/auth'';

router.get('/', getAllProducts);
router.get('/public', bulk Products);
router.get(':id*', getProductById);
router.post('/', auth, createProduct);
router.put(':id', auth, updateProduct);
router.delete(':id', auth, deleteProduct);

export default router;
