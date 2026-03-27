import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/premium.css'
import '../styles/animations.css'
import { useSoundEffects } from '../context/SoundContext'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { onHover, onClick, onPurchase, onCoin } = useSoundEffects()

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
      setProducts([
        { _id: '1', name: 'آيفون 15 برو', description: 'أحدث هاتف من آبل', price: 999, pointsReward: 50, category: 'إلكترونيات', image: '📱' },
        { _id: '2', name: 'لابتوب ماك', description: 'لابتوب احترافي', price: 1499, pointsReward: 75, category: 'إلكترونيات', image: '💻' },
        { _id: '3', name: 'سماعات AirPods', description: 'سماعات لاسلكية', price: 199, pointsReward: 10, category: 'إلكترونيات', image: '🎧' },
        { _id: '4', name: 'ساعة أبل', description: 'ساعة ذكية', price: 399, pointsReward: 20, category: 'إكسسوارات', image: '⌚' },
        { _id: '5', name: 'حقيبة أنيقة', description: 'حقيبة فاخرة', price: 299, pointsReward: 15, category: 'أزياء', image: '👜' },
        { _id: '6', name: 'نظارات شمسية', description: 'نظارات فاخرة', price: 149, pointsReward: 7, category: 'أزياء', image: '🕶️' },
        { _id: '7', name: 'حذاء رياضي', description: 'حذاء مريح', price: 129, pointsReward: 6, category: 'أزياء', image: '👟' },
        { _id: '8', name: 'كاميرا احترافية', description: 'تصوير احترافي', price: 899, pointsReward: 45, category: 'إلكترونيات', image: '📷' },
      ])
      setCategories(['all', 'إلكترونيات', 'أزياء', 'إكسسوارات'])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart([...cart, product])
    onPurchase()
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
    onClick()
  }

  const totalPoints = cart.reduce((sum, p) => sum + p.pointsReward, 0)
  const totalPrice = cart.reduce((sum, p) => sum + p.price, 0)

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getCategoryIcon = (cat) => {
    const icons = { 'all': '🌟', 'إلكترونيات': '📱', 'أزياء': '👗', 'إكسسوارات': '⌚' }
    return icons[cat] || '📦'
  }

  const getCategoryGradient = (cat) => {
    const gradients = { 'all': 'from-amber-500 to-orange-600', 'إلكترونيات': 'from-blue-500 to-cyan-600', 'أزياء': 'from-pink-500 to-rose-600', 'إكسسوارات': 'from-purple-500 to-violet-600' }
    return gradients[cat] || 'from-gray-500 to-slate-600'
  }

  if (loading) return (
    <div className="premium-bg min-h-screen flex items-center justify-center">
      <div className="loading-dots"><span></span><span></span><span></span></div>
    </div>
  )

  return (
    <div className="premium-bg min-h-screen p-6 pt-24 pb-32">
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 15}s`, animationDuration: `${15 + Math.random() * 10}s` }} />
        ))}
      </div>

      <div className="flex justify-between items-center mb-8" style={{ position: 'relative' }}>
        <div>
          <h1 className="text-5xl font-bold mb-2"><span className="shimmer-text">المتجر</span></h1>
          <p className="text-xl text-gray-400">اشترِ منتجات واكسب نقاط!</p>
        </div>
        <Link to="/" onClick={onClick} className="glass-premium px-6 py-3 hover:bg-white/10 transition">← رجوع</Link>
      </div>

      <div className="glass-premium p-4 mb-8" style={{ position: 'relative' }}>
        <div className="flex items-center gap-4">
          <span className="text-2xl">🔍</span>
          <input type="text" placeholder="ابحث عن منتج..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-500" />
        </div>
      </div>

      <div className="glass-premium p-6 mb-8 glow-pulse" style={{ position: 'relative' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl float-3d">🛒</div>
            <div><p className="text-gray-400">عند شرائك بقيمة</p><p className="text-4xl font-bold">${totalPrice}</p></div>
          </div>
          <div className="text-4xl text-gray-500">⬅️</div>
          <div className="flex items-center gap-4">
            <div><p className="text-gray-400">ستحصل على</p><p className="text-4xl font-bold shimmer-text">+{totalPoints} 🪙</p></div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl float-3d" style={{ animationDelay: '0.5s' }}>🪙</div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="flex gap-3 mb-8 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => { setSelectedCategory(cat); onClick(); }} onMouseEnter={onHover} className={`category-card px-6 py-3 rounded-2xl font-bold transition flex items-center gap-2 ${selectedCategory === cat ? `bg-gradient-to-r ${getCategoryGradient(cat)} text-white` : 'glass-premium text-gray-400 hover:text-white'}`}>
                <span className="text-xl">{getCategoryIcon(cat)}</span>
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
              <div key={product._id} className="product-card-3d card-3d fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="product-front glass-premium rounded-2xl overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-7xl float-3d">{product.image || '📦'}</span>
                    {product.pointsReward > 30 && (
                      <div className="absolute top-3 right-3 animated-border">
                        <div className="px-3 py-1 rounded-full bg-black/80 text-amber-400 text-sm font-bold">🔥 HOT</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold">{product.price}$</span>
                      <span className="text-emerald-400 text-sm font-bold">+{product.pointsReward} 🪙</span>
                    </div>

                    <button onClick={() => addToCart(product)} onMouseEnter={onHover} className="btn-3d w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold hover:from-emerald-400 hover:to-teal-500 transition">
                      إضافة للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`cart-sidebar ${cart.length > 0 ? 'open' : ''} glass-premium`} style={{ position: 'sticky', top: 100, right: 0, height: 'fit-content', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold"><span className="shimmer-text">السلة</span></h2>
            <span className="glass-premium px-4 py-1 rounded-full">{cart.length}</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-4 float-3d">🛒</div>
              <p className="text-gray-400">السلة فارغة</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, i) => (
                  <div key={i} className="glass-premium p-3 flex items-center gap-3 hover:bg-white/10 transition">
                    <span className="text-3xl">{item.image || '📦'}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-emerald-400 text-xs">+{item.pointsReward} 🪙</div>
                    </div>
                    <button onClick={() => removeFromCart(i)} className="text-red-400 hover:text-red-300 p-2">✕</button>
                  </div>
                ))}
              </div>

              <div className="glass-premium p-4 mb-4">
                <div className="flex justify-between mb-2"><span>المجموع:</span><span className="font-bold text-xl">${totalPrice}</span></div>
                <div className="flex justify-between"><span className="text-emerald-400">النقاط المكتسبة:</span><span className="font-bold text-xl shimmer-text">+{totalPoints} 🪙</span></div>
              </div>

              <button onClick={onPurchase} className="btn-3d w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-lg hover:from-amber-400 hover:to-orange-500 transition">
                إتمام الشراء 🎉
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
