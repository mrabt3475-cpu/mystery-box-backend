import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">🛒 المتجر</h1>
          <p className="text-gray-400">اشترِ منتجات واكسب نقاط!</p>
        </div>
        <Link to="/" className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition">
          ← رجوع
        </Link>
      </div>

      {/* Points Banner */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200">عند شرائك بقيمة</p>
            <p className="text-3xl font-bold">${totalPrice}</p>
          </div>
          <div className="text-4xl">⬅️</div>
          <div className="text-center">
            <p className="text-green-200">ستحصل على</p>
            <p className="text-3xl font-bold text-yellow-400">+{totalPoints} نقطة</p>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Products Grid */}
        <div className="flex-1">
          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>

          {/* Products */}
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product._id} className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all">
                <div className="h-40 bg-gray-700 flex items-center justify-center">
                  <span className="text-5xl">{product.image || '📦'}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold">${product.price}</span>
                    <span className="text-green-400 text-sm">+{product.pointsReward} نقطة</span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-500 transition"
                  >
                    إضافة للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="w-80 bg-gray-800 rounded-2xl p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🛒</span> السلة
            <span className="bg-purple-600 px-2 py-0.5 rounded-full text-sm">{cart.length}</span>
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">السلة فارغة</p>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
                    <span className="text-2xl">{item.image || '📦'}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-green-400 text-xs">+{item.pointsReward} نقطة</div>
                    </div>
                    <button
                      onClick={() => removeFromCart(i)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>المجموع:</span>
                  <span className="font-bold">${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">النقاط المكتسبة:</span>
                  <span className="font-bold text-yellow-400">+{totalPoints}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 py-3 rounded-xl font-bold hover:from-green-500 hover:to-emerald-500 transition">
                إتمام الشراء
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}