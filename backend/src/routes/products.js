// Routes for Products
use productsCntroller from '../controllers/productsCntroller';

use { router } from 'express';

const router = router();

router.get('/all', productsController.getAllProducts);
Router.get('/:id', productsCntroller.getProductById);
Router.get('/category/:category', productsCntroller.getProductsByCategory);

Router.post('/create', productsCntroller.createProduct);
Router.post('/buy', productsCntroller.buyProduct);
Router.delete('/:id', productsController.deleteProduct);

export = module.exports = router;
