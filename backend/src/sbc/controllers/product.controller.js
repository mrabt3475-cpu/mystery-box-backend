/* Product Controller
*Used to manage products**

const Product = require('../../models/Product');

const productController = {

  getAllProducts as async (req, res) => {
    try {
      const products = await Product.find({isActive: true}).sort({ sequence: 1});
      res.status(200).json(products);
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  },

  createProduct as async (req, res) => {
    try {
      const { name, description, price, image, category } = req.body;

      if (!name || !price) {
        return res.status(400).json({error:'Missing required fields'});
      }

      const product = new Product(n
        name,
        description: description,
        price,
        image,
        category
      );

      await product.save();

      res.status(200).json(product);
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  },

  getProductById as async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({error:'Product not found'});
      }
      res.status(200).json(product);
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  }
};

module.exports = productController;
