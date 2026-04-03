import Product from './product.model.js';
import Category from '../category/category.model.js';

export const productService = {
  // إنشاء منتج جديد
  async createProduct(productData) {
    try {
      const product = await Product.create(productData);
      
      // تحديث عداد الفئة
      await Category.findByIdAndUpdate(productData.category, {
        $inc: { productCount: 1 }
      });
      
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على منتج واحد
  async getProductById(id) {
    try {
      const product = await Product.findById(id)
        .populate('category', 'name slug')
        .populate('vendor', 'name email');
      
      if (!product) {
        return { success: false, error: 'المنتج غير موجود' };
      }
      
      // زيادة المشاهدات
      product.stats.views += 1;
      await product.save();
      
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على منتج بالرابط
  async getProductBySlug(slug) {
    try {
      const product = await Product.findOne({ slug, isActive: true })
        .populate('category', 'name slug')
        .populate('vendor', 'name email avatar');
      
      if (!product) {
        return { success: false, error: 'المنتج غير موجود' };
      }
      
      // زيادة المشاهدات
      product.stats.views += 1;
      await product.save();
      
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // قائمة المنتجات مع الفلترة
  async getProducts(filters = {}) {
    try {
      const {
        page = 1,
        limit = 12,
        sort = '-createdAt',
        category,
        productType,
        minPrice,
        maxPrice,
        search,
        vendor,
        isFeatured,
        tags
      } = filters;

      const query = { isActive: true, status: 'active' };

      if (category) query.category = category;
      if (productType) query.productType = productType;
      if (vendor) query.vendor = vendor;
      if (isFeatured) query.isFeatured = true;
      if (tags) query.tags = { $in: tags };
      
      if (search) {
        query.$text = { $search: search };
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
      }

      const products = await Product.find(query)
        .populate('category', 'name slug icon')
        .populate('vendor', 'name avatar')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Product.countDocuments(query);

      return {
        success: true,
        data: products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // تحديث منتج
  async updateProduct(id, userId, updateData) {
    try {
      const product = await Product.findById(id);
      
      if (!product) {
        return { success: false, error: 'المنتج غير موجود' };
      }

      // التحقق من الملكية
      if (product.vendor.toString() !== userId.toString()) {
        return { success: false, error: 'غير مصرح لك بتعديل هذا المنتج' };
      }

      const updated = await Product.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      return { success: true, data: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // حذف منتج
  async deleteProduct(id, userId) {
    try {
      const product = await Product.findById(id);
      
      if (!product) {
        return { success: false, error: 'المنتج غير موجود' };
      }

      if (product.vendor.toString() !== userId.toString()) {
        return { success: false, error: 'غير مصرح لك بحذف هذا المنتج' };
      }

      await Product.findByIdAndDelete(id);

      // تحديث عداد الفئة
      await Category.findByIdAndUpdate(product.category, {
        $inc: { productCount: -1 }
      });

      return { success: true, message: 'تم حذف المنتج بنجاح' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // إضافة تقييم
  async addReview(productId, userId, reviewData) {
    try {
      const product = await Product.findById(productId);
      
      if (!product) {
        return { success: false, error: 'المنتج غير موجود' };
      }

      // التحقق من عدم وجود تقييم سابق
      const existingReview = product.reviews.find(
        r => r.user.toString() === userId.toString()
      );

      if (existingReview) {
        return { success: false, error: 'لقد قمت بتقييم هذا المنتج من قبل' };
      }

      // إضافة التقييم
      product.reviews.push({
        user: userId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        images: reviewData.images,
        verified: true
      });

      // تحديث متوسط التقييم
      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = totalRating / product.reviews.length;
      product.reviewCount = product.reviews.length;

      await product.save();

      return { success: true, message: 'تم إضافة التقييم بنجاح' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على المنتجات المميزة
  async getFeaturedProducts(limit = 8) {
    try {
      const products = await Product.find({
        isFeatured: true,
        isActive: true,
        status: 'active'
      })
        .populate('category', 'name slug')
        .limit(limit);

      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على المنتجات الجديدة
  async getNewProducts(limit = 8) {
    try {
      const products = await Product.find({
        isActive: true,
        status: 'active'
      })
        .populate('category', 'name slug')
        .sort('-createdAt')
        .limit(limit);

      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على المنتجات حسب النوع
  async getProductsByType(productType, limit = 12) {
    try {
      const products = await Product.find({
        productType,
        isActive: true,
        status: 'active'
      })
        .populate('category', 'name slug')
        .sort('-createdAt')
        .limit(limit);

      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default productService;
