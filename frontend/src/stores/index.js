// Global Store using Zustand
// ==========================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

// Auth Store
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/auth/login', credentials)
          const { user, accessToken, refreshToken } = res.data
          
          // Store tokens
          set({ 
            user, 
            token: accessToken, 
            isAuthenticated: true, 
            isLoading: false 
          })
          
          // Set API header
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          
          return { success: true }
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            isLoading: false 
          })
          return { success: false, error: error.response?.data?.message }
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/auth/register', userData)
          const { user, accessToken } = res.data
          
          set({ 
            user, 
            token: accessToken, 
            isAuthenticated: true, 
            isLoading: false 
          })
          
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          
          return { success: true }
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Registration failed', 
            isLoading: false 
          })
          return { success: false, error: error.response?.data?.message }
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (e) {
          // Ignore logout errors
        }
        
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        })
        
        delete api.defaults.headers.common['Authorization']
      },

      // Fetch current user
      fetchUser: async () => {
        const token = get().token
        if (!token) return
        
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const res = await api.get('/users/me')
          set({ user: res.data, isAuthenticated: true })
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false })
          delete api.defaults.headers.common['Authorization']
        }
      },

      // Update user
      updateUser: (userData) => {
        set((state) => ({ 
          user: { ...state.user, ...userData } 
        }))
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
)

// Wallet Store
const useWalletStore = create((set, get) => ({
  points: 0,
  usdtBalance: 0,
  bonusBalance: 0,
  transactions: [],
  isLoading: false,

  fetchWallet: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/wallet')
      set({ 
        ...res.data, 
        isLoading: false 
      })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  addPoints: (amount) => set((state) => ({ 
    points: state.points + amount 
  })),

  deductPoints: (amount) => set((state) => ({ 
    points: Math.max(0, state.points - amount) 
  })),

  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
}))

// Boxes Store
const useBoxesStore = create((set, get) => ({
  boxes: [],
  activeBox: null,
  openingResult: null,
  isOpening: false,
  cooldowns: {},

  fetchBoxes: async () => {
    try {
      const res = await api.get('/boxes/active')
      set({ boxes: res.data })
    } catch (error) {
      console.error('Failed to fetch boxes:', error)
    }
  },

  openBox: async (boxId) => {
    const { cooldowns } = get()
    
    // Check cooldown
    if (cooldowns[boxId] && cooldowns[boxId] > Date.now()) {
      return { success: false, error: 'Cooldown active' }
    }

    set({ isOpening: true })
    
    try {
      const res = await api.post(`/boxes/${boxId}/open`)
      set({ 
        openingResult: res.data, 
        isOpening: false,
        cooldowns: { ...cooldowns, [boxId]: Date.now() + 5000 }
      })
      return { success: true, data: res.data }
    } catch (error) {
      set({ isOpening: false })
      return { success: false, error: error.response?.data?.message }
    }
  },

  clearResult: () => set({ openingResult: null }),
}))

// Cart Store
const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => set((state) => {
    const existing = state.items.find(item => item._id === product._id)
    let items
    
    if (existing) {
      items = state.items.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      items = [...state.items, { ...product, quantity: 1 }]
    }
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    return { items, total }
  }),

  removeItem: (productId) => set((state) => {
    const items = state.items.filter(item => item._id !== productId)
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return { items, total }
  }),

  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) {
      return get()
    }
    
    const items = state.items.map(item =>
      item._id === productId ? { ...item, quantity } : item
    )
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    return { items, total }
  }),

  clearCart: () => set({ items: [], total: 0 }),

  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}))

// UI Store
const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  notifications: [],
  modal: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { 
      id: Date.now(), 
      ...notification 
    }]
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}))

export { useAuthStore, useWalletStore, useBoxesStore, useCartStore, useUIStore }
