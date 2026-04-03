import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products/slug/${slug}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    setAdding(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          productId: product._id,
          quantity
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('تمت الإضافة للسلة!');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setAdding(false);
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      bot: '🤖 بوت',
      group: '👥 مجموعة',
      channel: '📢 قناة',
      digital: '💾 منتج رقمي',
      physical: '📦 منتج مادي',
      subscription: '🔄 اشتراك'
    };
    return types[type] || type;
  };

  if (loading) {
    return <div className="loading-page">جاري التحميل...</div>;
  }

  if (!product) {
    return <div className="not-found">المنتج غير موجود</div>;
  }

  return (
    <div className="product-page">
      <div className="container">
        {/* مسار التنقل */}
        <nav className="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <Link to="/store">المتجر</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-layout">
          {/* الصور */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images?.[selectedImage]?.url || '/placeholder.png'}
                alt={product.name}
              />
              <span className="product-type-badge">{getTypeLabel(product.productType)}</span>
            </div>
            {product.images?.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={selectedImage === i ? 'active' : ''}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* معلومات المنتج */}
          <div className="product-info">
            <h1>{product.name}</h1>
            
            <div className="product-meta">
              <div className="rating">
                {'⭐'.repeat(Math.round(product.rating))}
                <span>({product.reviewCount} تقييم)</span>
              </div>
              <div className="sku">SKU: {product.sku}</div>
            </div>

            <div className="price-section">
              {product.comparePrice && (
                <span className="compare-price">${product.comparePrice}</span>
              )}
              <span className="price">${product.price}</span>
              {product.comparePrice && (
                <span className="discount">
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </span>
              )}
            </div>

            <p className="description">{product.description}</p>

            {/* تفاصيل خاصة بالبوت */}
            {product.productType === 'bot' && product.botProduct && (
              <div className="product-features">
                <h3>مميزات البوت:</h3>
                <ul>
                  {product.botProduct.botFeatures?.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
                <div className="bot-info">
                  <p>المنصة: {product.botProduct.botPlatform}</p>
                  <p>الدعم: {product.botProduct.supportIncluded ? `${product.botProduct.supportDuration} يوم` : 'غير مشمول'}</p>
                </div>
              </div>
            )}

            {/* تفاصيل خاصة بالمجموعة */}
            {product.productType === 'group' && product.groupProduct && (
              <div className="product-features">
                <h3>مميزات المجموعة:</h3>
                <ul>
                  {product.groupProduct.groupFeatures?.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
                <div className="group-info">
                  <p>المنصة: {product.groupProduct.groupPlatform}</p>
                  <p>الأعضاء: {product.groupProduct.currentMembers}/{product.groupProduct.maxMembers}</p>
                  <p>المدة: {product.groupProduct.accessDuration} يوم</p>
                </div>
              </div>
            )}

            {/* تفاصيل خاصة بالقناة */}
            {product.productType === 'channel' && product.channelProduct && (
              <div className="product-features">
                <h3>مميزات القناة:</h3>
                <ul>
                  {product.channelProduct.channelFeatures?.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
                <div className="channel-info">
                  <p>المنصة: {product.channelProduct.channelPlatform}</p>
                  <p>المشتركين: {product.channelProduct.subscriberCount}</p>
                  <p>نوع المحتوى: {product.channelProduct.contentType}</p>
                </div>
              </div>
            )}

            {/* نظام الاشتراك */}
            {product.subscription?.isSubscription && (
              <div className="subscription-info">
                <h3>💳 معلومات الاشتراك</h3>
                <p>الدورة: {product.subscription.billingCycle}</p>
                <p>السعر: ${product.subscription.subscriptionPrice}/{product.subscription.billingCycle}</p>
                {product.subscription.trialDays > 0 && (
                  <p>تجربة مجانية: {product.subscription.trialDays} يوم</p>
                )}
              </div>
            )}

            {/* إضافة للسلة */}
            <div className="add-to-cart-section">
              {product.productType !== 'subscription' && (
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              )}
              
              <button
                className="btn btn-primary btn-lg"
                onClick={addToCart}
                disabled={adding}
              >
                {adding ? 'جاري الإضافة...' : 'إضافة للسلة 🛒'}
              </button>
            </div>

            {/* الضمان */}
            <div className="product-guarantee">
              {product.warranty?.enabled && (
                <p>✓ ضمان {product.warranty.duration} يوم</p>
              )}
              {product.refundPolicy?.enabled && (
                <p>✓ استرجاع خلال {product.refundPolicy.duration} يوم</p>
              )}
            </div>
          </div>
        </div>

        {/* التقييمات */}
        {product.reviews?.length > 0 && (
          <section className="product-reviews">
            <h2>التقييمات ({product.reviewCount})</h2>
            <div className="reviews-list">
              {product.reviews.slice(0, 5).map((review, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <span className="rating">{'⭐'.repeat(review.rating)}</span>
                    <span className="date">{new Date(review.createdAt).toLocaleDateString('ar')}</span>
                  </div>
                  {review.title && <h4>{review.title}</h4>}
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Product;
