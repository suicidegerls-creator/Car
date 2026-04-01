'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/lib/types/order'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (wheelId: string) => void
  updateQuantity: (wheelId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(i => i.wheel_id === item.wheel_id)
        
        if (existingIndex >= 0) {
          // Увеличиваем количество
          const newItems = [...items]
          newItems[existingIndex].quantity += item.quantity
          set({ items: newItems })
        } else {
          // Добавляем новый товар
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (wheelId) => {
        set({ items: get().items.filter(i => i.wheel_id !== wheelId) })
      },
      
      updateQuantity: (wheelId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(wheelId)
          return
        }
        
        const items = get().items.map(item =>
          item.wheel_id === wheelId ? { ...item, quantity } : item
        )
        set({ items })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'rimzone-cart',
    }
  )
)
