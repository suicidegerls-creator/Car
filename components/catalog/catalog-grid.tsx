'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Eye, ShoppingCart } from 'lucide-react'
import { Wheel, WHEEL_TYPE_LABELS } from '@/lib/types/wheel'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { Button } from '@/components/ui/button'

interface CatalogGridProps {
  wheels: Wheel[]
  loading: boolean
}

export function CatalogGrid({ wheels, loading }: CatalogGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (wheels.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Товары не найдены</h3>
        <p className="text-muted-foreground mb-4">
          Попробуйте изменить параметры фильтрации
        </p>
        <Button variant="outline" asChild>
          <Link href="/catalog">Сбросить фильтры</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {wheels.map((wheel) => (
        <Link key={wheel.id} href={`/catalog/${wheel.id}`}>
          <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-300 h-full hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer">
            <div className="aspect-square relative bg-secondary overflow-hidden">
              {wheel.images?.[0] ? (
                <img
                  src={wheel.images[0]}
                  alt={wheel.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-muted-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
              )}
              
              {/* Hover overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Quick view button on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-background/95 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              {!wheel.in_stock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="secondary">Нет в наличии</Badge>
                </div>
              )}
              {wheel.old_price && wheel.old_price > wheel.price && (
                <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground animate-pulse">
                  -{Math.round((1 - wheel.price / wheel.old_price) * 100)}%
                </Badge>
              )}
            </div>
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
                <Badge variant="outline" className="text-[10px] sm:text-xs px-1 sm:px-2">
                  {WHEEL_TYPE_LABELS[wheel.wheel_type]}
                </Badge>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  R{wheel.diameter}
                </span>
              </div>
              <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors duration-300">
                {wheel.name}
              </h3>
              <p className="text-[10px] sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-1">
                {wheel.brand} • {wheel.pcd}
              </p>
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  {wheel.old_price && wheel.old_price > wheel.price && (
                    <span className="text-[10px] sm:text-sm text-muted-foreground line-through mr-1 sm:mr-2 block sm:inline">
                      {wheel.old_price.toLocaleString('be-BY')}
                    </span>
                  )}
                  <span className="text-sm sm:text-lg font-bold">
                    {wheel.price.toLocaleString('be-BY')}
                  </span>
                  <span className="text-[10px] sm:text-sm ml-0.5">BYN</span>
                </div>
                <div onClick={(e) => e.preventDefault()} className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                  <AddToCartButton wheel={wheel} size="icon" showText={false} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
