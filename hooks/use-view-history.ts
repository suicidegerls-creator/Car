'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ViewedWheel {
  id: string
  name: string
  brand: string
  diameter: number
  color: string | null
  wheel_type: string
  price: number
  image: string | null
  viewedAt: number
  viewDuration: number // время просмотра в секундах
}

interface BrandInterest {
  brand: string
  views: number
  totalDuration: number
}

interface ViewHistoryState {
  viewedWheels: ViewedWheel[]
  brandInterests: Record<string, BrandInterest>
  diameterPreferences: Record<number, number>
  colorPreferences: Record<string, number>
  typePreferences: Record<string, number>
  priceRange: { min: number; max: number; count: number }
  
  // Actions
  trackView: (wheel: Omit<ViewedWheel, 'viewedAt' | 'viewDuration'>) => void
  updateViewDuration: (wheelId: string, duration: number) => void
  getRecommendationParams: () => {
    preferredBrands: string[]
    preferredDiameters: number[]
    preferredColors: string[]
    preferredTypes: string[]
    priceRange: { min: number; max: number }
  }
  getRecentlyViewed: (limit?: number) => ViewedWheel[]
  clearHistory: () => void
}

export const useViewHistory = create<ViewHistoryState>()(
  persist(
    (set, get) => ({
      viewedWheels: [],
      brandInterests: {},
      diameterPreferences: {},
      colorPreferences: {},
      typePreferences: {},
      priceRange: { min: 0, max: 0, count: 0 },

      trackView: (wheel) => {
        const now = Date.now()
        
        set((state) => {
          // Убираем дубликаты и добавляем новый просмотр
          const filteredWheels = state.viewedWheels.filter(w => w.id !== wheel.id)
          const newViewedWheels = [
            { ...wheel, viewedAt: now, viewDuration: 0 },
            ...filteredWheels
          ].slice(0, 50) // Храним последние 50 просмотров

          // Обновляем интересы по брендам
          const brandInterests = { ...state.brandInterests }
          if (!brandInterests[wheel.brand]) {
            brandInterests[wheel.brand] = { brand: wheel.brand, views: 0, totalDuration: 0 }
          }
          brandInterests[wheel.brand].views += 1

          // Обновляем предпочтения по диаметру
          const diameterPreferences = { ...state.diameterPreferences }
          diameterPreferences[wheel.diameter] = (diameterPreferences[wheel.diameter] || 0) + 1

          // Обновляем предпочтения по цвету
          const colorPreferences = { ...state.colorPreferences }
          if (wheel.color) {
            colorPreferences[wheel.color] = (colorPreferences[wheel.color] || 0) + 1
          }

          // Обновляем предпочтения по типу
          const typePreferences = { ...state.typePreferences }
          typePreferences[wheel.wheel_type] = (typePreferences[wheel.wheel_type] || 0) + 1

          // Обновляем ценовой диапазон
          const priceRange = { ...state.priceRange }
          if (priceRange.count === 0) {
            priceRange.min = wheel.price
            priceRange.max = wheel.price
          } else {
            priceRange.min = Math.min(priceRange.min, wheel.price * 0.7)
            priceRange.max = Math.max(priceRange.max, wheel.price * 1.3)
          }
          priceRange.count += 1

          return {
            viewedWheels: newViewedWheels,
            brandInterests,
            diameterPreferences,
            colorPreferences,
            typePreferences,
            priceRange,
          }
        })
      },

      updateViewDuration: (wheelId, duration) => {
        set((state) => {
          const viewedWheels = state.viewedWheels.map(w => {
            if (w.id === wheelId) {
              return { ...w, viewDuration: w.viewDuration + duration }
            }
            return w
          })

          // Обновляем длительность для бренда
          const wheel = viewedWheels.find(w => w.id === wheelId)
          if (wheel) {
            const brandInterests = { ...state.brandInterests }
            if (brandInterests[wheel.brand]) {
              brandInterests[wheel.brand].totalDuration += duration
            }
            return { viewedWheels, brandInterests }
          }

          return { viewedWheels }
        })
      },

      getRecommendationParams: () => {
        const state = get()
        
        // Сортируем бренды по интересу (views * 1 + duration * 0.1)
        const sortedBrands = Object.values(state.brandInterests)
          .sort((a, b) => {
            const scoreA = a.views + a.totalDuration * 0.1
            const scoreB = b.views + b.totalDuration * 0.1
            return scoreB - scoreA
          })
          .slice(0, 3)
          .map(b => b.brand)

        // Сортируем диаметры по популярности
        const sortedDiameters = Object.entries(state.diameterPreferences)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([d]) => parseInt(d))

        // Сортируем цвета по популярности
        const sortedColors = Object.entries(state.colorPreferences)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([c]) => c)

        // Сортируем типы по популярности
        const sortedTypes = Object.entries(state.typePreferences)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 2)
          .map(([t]) => t)

        return {
          preferredBrands: sortedBrands,
          preferredDiameters: sortedDiameters,
          preferredColors: sortedColors,
          preferredTypes: sortedTypes,
          priceRange: {
            min: state.priceRange.min || 0,
            max: state.priceRange.max || 100000,
          },
        }
      },

      getRecentlyViewed: (limit = 10) => {
        return get().viewedWheels.slice(0, limit)
      },

      clearHistory: () => {
        set({
          viewedWheels: [],
          brandInterests: {},
          diameterPreferences: {},
          colorPreferences: {},
          typePreferences: {},
          priceRange: { min: 0, max: 0, count: 0 },
        })
      },
    }),
    {
      name: 'wheel-view-history',
    }
  )
)
