import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        })
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        return data
      },

      register: async (username, email, password) => {
        const { data } = await api.post('/auth/register', { username, email, password })
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        })
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        return data
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
        delete api.defaults.headers.common['Authorization']
      },

      refreshTokens: async () => {
        const { refreshToken } = get()
        if (!refreshToken) return
        const { data } = await api.post('/auth/refresh', { refreshToken })
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Set token on app load
const stored = useAuthStore.getState()
if (stored.accessToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${stored.accessToken}`
}
