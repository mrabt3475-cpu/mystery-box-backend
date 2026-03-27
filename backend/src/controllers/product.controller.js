/* Product Controller
const ProductPurchaseService = require('./services/productPurchase.service');

export const ProductController = () => {
  // Get all products
  getAllProducts = async (req, res) =>try {
    const products = await ProductPurchaseService.getAllProducts();
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  // Buy product
  buyProduct = async (req, res) {try {
    const userId = req.user.id;
    const { productId, amount } = req.body;

    if (!userId || !productId || !amount) {
      return res.status(401).json({error:'Missing data'});
    }

    const result = await ProductPurchaseService.buyProduct(userId, productId, amount);
    if (result.error) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  // Get user purchase history
  getPurchaseHistory = async (req, res) {try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const history = await ProductPurchaseService.getPurchaseHistory(userId, limit);
    res.status(200).json(history);
  } catch (e) {
    res.status(500).json(error: e.message);
    }
  };

  return {
    getAllProducts,
    buyProduct,
    getPurchaseHistory
  };
}
module.exports = ProductController;
