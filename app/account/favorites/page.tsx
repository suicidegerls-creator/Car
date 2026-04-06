'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Heart, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'

interface FavoriteItem {
  id: string
  wheel_id: string
  wheel: {
    id: string
    name: string
    brand: string
    price: number
    images: string[]
    width: number
    diameter: number
    in_stock: boolean
  }
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { addItem } = useCart()

  const supabase = createClient()

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('favorites')
        .select(`
          id,
          wheel_id,
          wheel:wheels (
            id,
            name,
            brand,
            price,
            images,
            width,
            diameter,
            in_stock
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setFavorites((data as unknown as FavoriteItem[]) || [])
      setLoading(false)
    }

    fetchFavorites()
  }, [supabase])

  const removeFavorite = async (favoriteId: string) => {
    setRemovingId(favoriteId)
    
    await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId)

    setFavorites(prev => prev.filter(f => f.id !== favoriteId))
    setRemovingId(null)
  }

  const addToCart = (item: FavoriteItem) => {
    addItem({
      id: item.wheel.id,
      name: item.wheel.name,
      brand: item.wheel.brand,
      price: item.wheel.price,
      image: item.wheel.images?.[0] || '/placeholder.svg',
      quantity: 1,
      width: item.wheel.width,
      diameter: item.wheel.diameter,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' BYN'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Избранное</h2>
        <p className="text-muted-foreground">Товары, которые вы добавили в избранное</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Избранное пусто</h3>
            <p className="text-muted-foreground text-center mb-4">
              Добавляйте понравившиеся диски в избранное
            </p>
            <Button asChild>
              <a href="/catalog">Перейти в каталог</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <Link href={`/catalog/${item.wheel_id}`}>
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={item.wheel.images?.[0] || '/placeholder.svg'}
                    alt={item.wheel.name}
                    fill
                    className="object-cover"
                  />
                  {!item.wheel.in_stock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="text-muted-foreground font-medium">Нет в наличии</span>
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/catalog/${item.wheel_id}`}>
                  <h3 className="font-medium hover:text-primary transition-colors">
                    {item.wheel.brand} {item.wheel.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.wheel.width}x{item.wheel.diameter}
                </p>
                <p className="font-bold text-lg mb-3">{formatPrice(item.wheel.price)}</p>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    disabled={!item.wheel.in_stock}
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    В корзину
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeFavorite(item.id)}
                    disabled={removingId === item.id}
                  >
                    {removingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
