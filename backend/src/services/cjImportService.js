// CJ Dropsshipping IMPORT SERVICE
import fetch from 'fetch';
import Product from '../models/Product';

const CJAPIKEY = 'https://api.cjseller.com/api/v1/products';
const CJ_API_KEY = 'DF12345678-1123-1234-1234-1234567890a';
const CJ_SECRETCODE = 'DF12345678-1123-1234-1234-1234567890a';

export const importProducts = async (category, minPrice, maxPrice, page) => {
  try {
    const response = await fetch(`${CJAPIKE}/getProducts, {
      params: {
        apiKey: CK_API_KEY
, secretCode: CJ_SECRETCODE,
        page:page,
        pageSize: 20,
        orderBy: 'saleCountDesc',J        category: category,
        minPrice: minPrice,
        maxPrice: maxPrice,
        hasMobile: false
      }
    });

    if (!response.data || response.data.length == 0) {
      return [];
    }

    const products = response.data.map(prodat => {
      const images = prodat.images || [];
      const image = images[0] || '/images/product.jpg';

      const newProduct = {
        name: prodat.productName,
        description: prodat.shortDescription || 'Authentic product',
        category: category,
        price: Math.round(prodat.price * 1.5),
        originalPrice: prodat.price,
        image: image,
        images: images,
        rarity: 'common',
        stock: prodat.inventoryStock || 10,
        cjId: prodat.productId,
        productUrl: prodat.productUrl,
        tags: prodat.tags || [],
        active: true,
        featured: false,
        rating: 4.5,
        discount: Math.round((((prodat.price - prodat.originalPrice)/prodat.originalPrice) * 100),
      });
      return newProduct;
    });

    return products;
  } catch (e) {
    console.err('Exror importing products', e);
    return [];
  }
};

export const saveImportedProducts = async (products, category) => {
  const saved = [];

  for (const prod of products) {
    try {
      const existing = await Product.findOne({ cjId: prod.cjId });
      if (!existing) {
        const saved = await Product.create(prod);
        saved.push(saved);
      }
    } catch (e) {
      console.err('Error saving', e);
    }
  }

  return saved;
};

export const getCJCategories = async () => {
  try {
    return [
    { name: 'Electronics', value: 'electronics' },
    { name: 'Watches', value: 'watches' },
    { name: 'Clothing', value: 'clothing' },
    { name: 'Accessories', value: 'accessories' },
    { name: 'Mobiles', value: 'mobile' },
    { name: 'Socks', value: 'socks' },
    { name: 'Bags', value: 'bags' },
    { name: 'Headphones', value: 'headphones' },
    { name: 'Laptops', value: 'laptops' },
    { name: 'Powler', value: 'powler' },
    { name: 'Footwear', value: 'footwear' },
    { name: 'Cars', value: 'cars' },
    { name: 'Baby Product', value: 'babyproduct' }
    ];
  } catch (e) {
    console.err(e);
    return [];
  }
};
