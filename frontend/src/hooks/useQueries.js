// React Query Configuration
// ========================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import React from 'react'

// Create query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Time before garbage collection
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      
      // Number of retries
      retry: 3,
      
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Keep previous data while fetching
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Don't retry on these errors
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
})

// Create localStorage persister for offline support
const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

// Persist client to localStorage
persistQueryClient({
  queryClient,
  persister,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
})

// Query Keys
export const queryKeys = {
  // Auth
  auth: ['auth'],
  user: ['user'],
  
  // Boxes
  boxes: ['boxes'],
  box: (id) => ['box', id],
  
  // Products
  products: ['products'],
  product: (id) => ['product', id],
  categories: ['categories'],
  
  // Wallet
  wallet: ['wallet'],
  transactions: ['transactions'],
  
  // Orders
  orders: ['orders'],
  order: (id) => ['order', id],
  
  // Leaderboard
  leaderboard: ['leaderboard'],
  
  // Stats
  stats: ['stats'],
  
  // Referral
  referral: ['referral'],
}

// Custom hooks for common queries
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// User queries
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const { default: api } = await import('../services/api')
      const res = await api.get('/users/me')
      return res.data
    },
    enabled: false, // Only fetch when needed
  })
}

// Boxes queries
export const useBoxes = () => {
  return useQuery({
    queryKey: queryKeys.boxes,
    queryFn: async () => {
      const { default: api } = await import('../services/api')
      const res = await api.get('/boxes/active')
      return res.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Wallet queries
export const useWallet = () => {
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: async () => {
      const { default: api } = await import('../services/api')
      const res = await api.get('/wallet')
      return res.data
    },
  })
}

// Orders queries
export const useOrders = (status = 'all') => {
  return useQuery({
    queryKey: [...queryKeys.orders, status],
    queryFn: async () => {
      const { default: api } = await import('../services/api')
      const url = status === 'all' ? '/orders' : `/orders?status=${status}`
      const res = await api.get(url)
      return res.data
    },
  })
}

// Leaderboard queries
export const useLeaderboard = (period = 'all') => {
  return useQuery({
    queryKey: [...queryKeys.leaderboard, period],
    queryFn: async () => {
      const { default: api } = await import('../services/api')
      const res = await api.get(`/leaderboard?period=${period}`)
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Products queries
export const useProducts = (category = 'all') => {
  return useQuery({
    queryKey: [...queryKeys.products, category],
    queryFn: async () => {
      const { default: api } = await import('../services/api')
      const url = category === 'all' ? '/products' : `/products?category=${category}`
      const res = await api.get(url)
      return res.data
    },
  })
}

// Stats queries
export const useStats = () => {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: async () => {
      const { default: api } = await import('../services/api')
      const res = await api.get('/users/stats')
      return res.data
    },
  })
}

// Mutations with cache invalidation
export const useOpenBox = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (boxId) => {
      const { default: api } = await import('../services/api')
      const res = await api.post(`/boxes/${boxId}/open`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
      queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export const usePurchase = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const { default: api } = await import('../services/api')
      const res = await api.post('/orders', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export { QueryClientProvider, ReactQueryDevtools }
