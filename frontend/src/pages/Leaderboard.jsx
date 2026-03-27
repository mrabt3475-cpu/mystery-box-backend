import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Leaderboard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users/leaderboard?limit=10').then((res) => setUsers(res.data))
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">الترتيب</h1>
      
      <div className="max-w-2xl mx-auto">
        {/* Top 3 */}
        {users.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg text-center order-2 -mt-8">
              <div className="text-4xl mb-2">🥈</div>
              <div className="font-bold">{users[1]?.username}</div>
              <div className="text-purple-500">{users[1]?.totalWins} مكسب</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center order-1">
              <div className="text-5xl mb-2">🥇</div>
              <div className="font-bold text-xl">{users[0]?.username}</div>
              <div className="text-purple-500">{users[0]?.totalWins} مكسب</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center order-3 -mt-4">
              <div className="text-4xl mb-2">🥉</div>
              <div className="font-bold">{users[2]?.username}</div>
              <div className="text-purple-500">{users[2]?.totalWins} مكسب</div>
            </div>
          </div>
        )}

        {/* Rest */}
        <div className="space-y-2">
          {users.slice(3).map((user, index) => (
            <div key={user._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 w-8">{index + 4}</div>
                <div className="font-bold">{user.username}</div>
              </div>
              <div className="text-purple-500">{user.totalWins} مكسب</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
