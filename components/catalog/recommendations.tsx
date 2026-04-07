'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, ChevronRight, History, Sparkles } from 'lucide-react'
import { Wheel } from '@/lib/types/wheel'
import { useViewHistory } from '@/hooks/use-view-history'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { createClient } from '@/lib/supabase/client'

interface RecommendationsProps {
  currentWheelId?: string
  title?: string
  type?: 'similar' | 'personalized' | 'recently-viewed'
  limit?: number
}

export function Recommendations({
  currentWheelId,
  title,
  type = 'personalized',
  limit = 6,
}: RecommendationsProps) {
  const [wheels, setWheels] = useState<Wheel[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [hasViewedWheels, setHasViewedWheels] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHasViewedWheels(useViewHistory.getState().viewedWheels.length > 0)
    
    const unsubscribe = useViewHistory.subscribe((state) => {
      setHasViewedWheels(state.viewedWheels.length > 0)
    })
    
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchRecommendations = async () => {
      setLoading(true)
      const supabase = createClient()

      try {
        if (type === 'recently-viewed') {
          // Показываем недавно просмотренные
          const recentIds = useViewHistory.getState().getRecentlyViewed(limit)
            .filter(w => w.id !== currentWheelId)
            .map(w => w.id)

          if (recentIds.length === 0) {
            setWheels([])
            setLoading(false)
            return
          }

          const { data } = await supabase
            .from('wheels')
            .select('*')
            .in('id', recentIds)
            .limit(limit)

          // Сортируем в порядке просмотра
          const orderedData = recentIds
            .map(id => data?.find(w => w.id === id))
            .filter(Boolean) as Wheel[]

          setWheels(orderedData)
        } else {
          // Персонализированные или похожие рекомендации
          const params = useViewHistory.getState().getRecommendationParams()
          
          let query = supabase
            .from('wheels')
            .select('*')
            .eq('in_stock', true)

          // Исключаем текущий товар
          if (currentWheelId) {
            query = query.neq('id', currentWheelId)
          }

          // Исключаем уже просмотренные для персонализированных
          const currentViewedWheels = useViewHistory.getState().viewedWheels
          if (type === 'personalized' && currentViewedWheels.length > 0) {
            const viewedIds = currentViewedWheels.slice(0, 10).map(w => w.id)
            query = query.not('id', 'in', `(${viewedIds.join(',')})`)
          }

          // Применяем фильтры на основе предпочтений
          if (params.preferredBrands.length > 0) {
            query = query.in('brand', params.preferredBrands)
          }

          if (params.preferredDiameters.length > 0) {
            query = query.in('diameter', params.preferredDiameters)
          }

          if (params.preferredColors.length > 0 && type === 'personalized') {
            query = query.in('color', params.preferredColors)
          }

          // Фильтр по цене (+-30% от среднего диапазона)
          if (params.priceRange.min > 0) {
            query = query.gte('price', params.priceRange.min)
            query = query.lte('price', params.priceRange.max)
          }

          query = query.limit(limit)

          const { data, error } = await query

          if (error) {
            console.error('Error fetching recommendations:', error)
            // Fallback: просто показываем популярные
            const { data: fallbackData } = await supabase
              .from('wheels')
              .select('*')
              .eq('in_stock', true)
              .neq('id', currentWheelId || '')
              .order('created_at', { ascending: false })
              .limit(limit)

            setWheels(fallbackData || [])
          } else {
            setWheels(data || [])
          }
        }
      } catch (error) {
        console.error('Error in recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [mounted, type, currentWheelId, limit, hasViewedWheels])

  if (!mounted) return null

  // Не показываем секцию если нет данных для recently-viewed
  if (type === 'recently-viewed' && !hasViewedWheels) {
    return null
  }

  const getTitle = () => {
    if (title) return title
    switch (type) {
      case 'similar':
        return 'Похожие товары'
      case 'recently-viewed':
        return 'Вы недавно смотрели'
      case 'personalized':
      default:
        return 'Рекомендуем для вас'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'recently-viewed':
        return <History className="w-5 h-5" />
      case 'personalized':
        return <Sparkles className="w-5 h-5" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (wheels.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {getIcon()}
          {getTitle()}
        </h2>
        <Link href="/catalog">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Смотреть все
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {wheels.map((wheel) => (
          <Link key={wheel.id} href={`/catalog/${wheel.id}`}>
            <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-300 h-full hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="aspect-square relative bg-secondary overflow-hidden">
                {wheel.images?.[0] ? (
                  <img
                    src={wheel.images[0]}
                    alt={wheel.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {wheel.old_price && wheel.old_price > wheel.price && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
                    -{Math.round((1 - wheel.price / wheel.old_price) * 100)}%
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {wheel.brand} / R{wheel.diameter}
                </p>
                <h3 className="font-medium text-xs line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {wheel.name}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm">
                    {wheel.price.toLocaleString('be-BY')} BYN
                  </span>
                  <div onClick={(e) => e.preventDefault()}>
                    <AddToCartButton wheel={wheel} size="icon" showText={false} className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
