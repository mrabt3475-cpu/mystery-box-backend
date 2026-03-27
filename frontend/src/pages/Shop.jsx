import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
      const cats = [...new Set(res.data.map(p => p.category))]
      setCategories(['all', ...cats])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const totalPoints = cart.reduce((sum, p) => sum + p.pointsReward, 0)
  const totalPrice = cart.reduce((sum, p) => sum + p.price, 0)

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="spinner-luxury"></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24">
      {/* Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-12" style={{ position: 'relative' }}>
        <div>
          <h1 className="text-5xl font-bold mb-2">
            <span className="gold-gradient">المتجر</span>
          </h1>
          <p className="text-xl text-gray-400">اشترِ منتجات واكسب نقاط!</p>
        </div>
        <Link to="/" className="glass-card px-6 py-3 hover:bg-white/10 transition">
          ← رجوع
        </Link>
      </header>

      {/* Points Banner */}
      <div className="glass-card p-6 mb-8 glow-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl">
              🛒
            </div>
            <div>
              <p className="text-gray-400">عند شرائك بقيمة</p>
              <p className="text-4xl font-bold">${totalPrice}</p>
            </div>
          </div>
          <div className="text-4xl text-gray-500">⬅️</div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-gray-400">ستحصل على</p>
              <p className="text-4xl font-bold gold-gradient">+{totalPoints} 🪙</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl float">
              🪙
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Products Grid */}
        <div className="flex-1">
          {/* Categories */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                    : 'glass-card text-gray-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>

          {/* Products */}
          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
              <div
                key={product._id}
                className="product-card fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="product-image relative">
                  <span className="text-6xl">{product.image || '📦'}</span>
                  {product.pointsReward > 50 && (
                    <div className="product-badge">🎁 +{product.pointsReward}</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <span className="text-emerald-400 text-sm font-bold">+{product.pointsReward} 🪙</span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold hover:from-emerald-400 hover:to-teal-500 transition transform hover:scale-105"
                  >
                    إضافة للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className={`cart-sidebar ${cart.length > 0 ? 'open' : ''}`} style={{ position: 'sticky', top: 100, right: 0, height: 'fit-content' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              <span className="gold-gradient">السلة</span>
            </h2>
            <span className="glass-card px-4 py-1 rounded-full">{cart.length}</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 float">🛒</div>
              <p className="text-gray-400">السلة فارغة</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {cart.map((item, i) => (
                  <div key={i} className="glass-card p-3 flex items-center gap-3">
                    <span className="text-3xl">{item.image || '📦'}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-emerald-400 text-xs">+{item.pointsReward} 🪙</div>
                    </div>
                    <button
                      onClick={() => removeFromCart(i)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="glass-card p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>المجموع:</span>
                  <span className="font-bold">${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">النقاط المكتسبة:</span>
                  <span className="font-bold gold-gradient">+{totalPoints} 🪙</span>
                </div>
              </div>

              <button className="btn-premium w-full">
                إتمام الشراء
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}