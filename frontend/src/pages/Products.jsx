import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data))
  }, [])

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const totalPoints = cart.reduce((sum, p) => sum + p.pointsValue, 0)

  const handleCheckout = async () => {
    try {
      await api.post('/orders', {
        items: cart.map((p) => ({ productId: p._id, quantity: 1 })),
        shippingAddress: 'عنوان الشحن',
      })
      alert('تم الطلب بنجاح!')
      setCart([])
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ')
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">المنتجات</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-gray-800 rounded-lg p-6">
            <div className="h-40 bg-gray-700 rounded mb-4 flex items-center justify-center text-4xl">
              🛍️
            </div>
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-400 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-purple-500 font-bold">{product.pointsValue} نقطة</span>
              <button
                onClick={() => addToCart(product)}
                className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
              >
                إضافة للسلة
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <span className="text-gray-400">عدد المنتجات: {cart.length}</span>
              <span className="mx-4">|</span>
              <span className="font-bold text-purple-500">الإجمالي: {totalPoints} نقطة</span>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-green-600 px-8 py-2 rounded hover:bg-green-700"
            >
              إتمام الطلب
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
