import productService from './product.service.js';
import { uploadFile, deleteFile } from '../../common/fileUpload.js';

export const productController = {
  // إنشاء منتج جديد
  async createProduct(req, res) {
    try {
      const productData = {
        ...req.body,
        vendor: req.user._id
      };

      const result = await productService.createProduct(productData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // الحصول على منتج واحد
  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.getProductById(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // الحصول على منتج بالرابط
  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      const result = await productService.getProductBySlug(slug);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // قائمة المنتجات
  async getProducts(req, res) {
    try {
      const filters = {
        page: req.query.page || 1,
        limit: req.query.limit || 12,
        sort: req.query.sort || '-createdAt',
        category: req.query.category,
        productType: req.query.productType,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        search: req.query.search,
        vendor: req.query.vendor,
        isFeatured: req.query.isFeatured === 'true',
        tags: req.query.tags?.split(',')
      };

      const result = await productService.getProducts(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // تحديث منتج
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.updateProduct(id, req.user._id, req.body);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // حذف منتج
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id, req.user._id);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // إضافة تقييم
  async addReview(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.addReview(id, req.user._id, req.body);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // المنتجات المميزة
  async getFeaturedProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const result = await productService.getFeaturedProducts(limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // المنتجات الجديدة
  async getNewProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const result = await productService.getNewProducts(limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // المنتجات حسب النوع
  async getProductsByType(req, res) {
    try {
      const { type } = req.params;
      const limit = parseInt(req.query.limit) || 12;
      const result = await productService.getProductsByType(type, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
