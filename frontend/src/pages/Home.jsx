import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Home() {
  const [boxes, setBoxes] = useState([])
  const [stats, setStats] = useState({ users: 0, boxesOpened: 0, totalWins: 0 })

  useEffect(() => {
    api.get('/boxes').then((res) => setBoxes(res.data.slice(0, 3)))
  }, [])

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">
          🎁 افتح صناديق <span className="text-purple-500">الغموض</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          اجمع النقاط من شراء المنتجات وافتح صناديق مجانية!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/products"
            className="bg-purple-600 px-8 py-3 rounded-lg text-lg hover:bg-purple-700"
          >
            تسوق الآن
          </Link>
          <Link
            to="/boxes"
            className="bg-gray-700 px-8 py-3 rounded-lg text-lg hover:bg-gray-600"
          >
            افتح صندوق
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-8 text-center">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-purple-500">{stats.users}+</div>
          <div className="text-gray-400">المستخدمين</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-purple-500">{stats.boxesOpened}+</div>
          <div className="text-gray-400">صندوق مفتوح</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-purple-500">{stats.totalWins}+</div>
          <div className="text-gray-400">مكسب</div>
        </div>
      </section>

      {/* Featured Boxes */}
      <section>
        <h2 className="text-3xl font-bold mb-6">الصناديق المميزة</h2>
        <div className="grid grid-cols-3 gap-6">
          {boxes.map((box) => (
            <Link
              key={box._id}
              to={`/open-box/${box._id}`}
              className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"
            >
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">{box.name}</h3>
              <p className="text-gray-400 mb-4">{box.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-purple-500 font-bold">{box.price} نقطة</span>
                <span className="text-green-500">{box.winChance}% فرصة</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
