'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface FavoriteItem {
  id: string
  wheel_id: string
  created_at: string
}

interface FavoritesState {
  favorites: string[] // array of wheel IDs
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  checkAuth: () => Promise<boolean>
  addToFavorites: (wheelId: string, wheelName?: string) => Promise<boolean>
  removeFromFavorites: (wheelId: string) => Promise<void>
  isFavorite: (wheelId: string) => boolean
  loadFavorites: () => Promise<void>
  clearFavorites: () => void
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isAuthenticated: false,
      isLoading: false,

      checkAuth: async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        const isAuth = !!user
        set({ isAuthenticated: isAuth })
        return isAuth
      },

      addToFavorites: async (wheelId: string, wheelName?: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          toast.error('Необходимо войти в аккаунт', {
            description: 'Чтобы добавить товар в избранное, войдите в личный кабинет',
            action: {
              label: 'Войти',
              onClick: () => {
                window.location.href = '/auth/login'
              },
            },
            duration: 5000,
          })
          return false
        }

        set({ isLoading: true })
        
        try {
          const { error } = await supabase
            .from('favorites')
            .insert({
              user_id: user.id,
              wheel_id: wheelId,
            })

          if (error) {
            if (error.code === '23505') {
              // Already in favorites
              toast.info('Уже в избранном', {
                description: wheelName ? `${wheelName} уже добавлен в избранное` : 'Этот товар уже в избранном',
              })
            } else {
              throw error
            }
          } else {
            set((state) => ({
              favorites: [...state.favorites, wheelId],
            }))
            toast.success('Добавлено в избранное', {
              description: wheelName || 'Товар добавлен в избранное',
            })
          }
          return true
        } catch (error) {
          console.error('Error adding to favorites:', error)
          toast.error('Ошибка', {
            description: 'Не удалось добавить в избранное',
          })
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      removeFromFavorites: async (wheelId: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        set({ isLoading: true })
        
        try {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('wheel_id', wheelId)

          if (error) throw error

          set((state) => ({
            favorites: state.favorites.filter((id) => id !== wheelId),
          }))
          
          toast.success('Удалено из избранного')
        } catch (error) {
          console.error('Error removing from favorites:', error)
          toast.error('Ошибка', {
            description: 'Не удалось удалить из избранного',
          })
        } finally {
          set({ isLoading: false })
        }
      },

      isFavorite: (wheelId: string) => {
        return get().favorites.includes(wheelId)
      },

      loadFavorites: async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          set({ favorites: [], isAuthenticated: false })
          return
        }

        set({ isLoading: true, isAuthenticated: true })
        
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('wheel_id')
            .eq('user_id', user.id)

          if (error) throw error

          set({
            favorites: data?.map((f) => f.wheel_id) || [],
          })
        } catch (error) {
          console.error('Error loading favorites:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      clearFavorites: () => {
        set({ favorites: [], isAuthenticated: false })
      },
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
)
