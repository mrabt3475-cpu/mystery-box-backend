import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Wallet() {
  const [balance, setBalance] = useState({ points: 0, balance: 0 })
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    api.get('/economy/balance').then((res) => setBalance(res.data))
    api.get('/economy/transactions').then((res) => setTransactions(res.data))
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">المحفظة</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-4xl font-bold text-purple-500 mb-2">{balance.points}</div>
          <div className="text-gray-400">النقاط</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-4xl font-bold text-green-500 mb-2">${balance.balance}</div>
          <div className="text-gray-400">الرصيد</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">السجل</h2>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx._id} className="bg-gray-800 p-4 rounded-lg flex justify-between">
            <div>
              <div className="font-bold">{tx.type}</div>
              <div className="text-gray-400 text-sm">{new Date(tx.createdAt).toLocaleDateString('ar')}</div>
            </div>
            <div className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
