'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package } from 'lucide-react'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {wheels.map((wheel) => (
        <Link key={wheel.id} href={`/catalog/${wheel.id}`}>
          <Card className="overflow-hidden group hover:border-foreground/30 transition-colors h-full">
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
                  <Package className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
              {!wheel.in_stock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="secondary">Нет в наличии</Badge>
                </div>
              )}
              {wheel.old_price && wheel.old_price > wheel.price && (
                <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                  -{Math.round((1 - wheel.price / wheel.old_price) * 100)}%
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {WHEEL_TYPE_LABELS[wheel.wheel_type]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  R{wheel.diameter} {wheel.width}J
                </span>
              </div>
              <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-accent transition-colors">
                {wheel.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {wheel.brand} • {wheel.pcd} • ET{wheel.et}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  {wheel.old_price && wheel.old_price > wheel.price && (
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      {wheel.old_price.toLocaleString('be-BY')} BYN
                    </span>
                  )}
                  <span className="text-lg font-bold">
                    {wheel.price.toLocaleString('be-BY')} BYN
                  </span>
                </div>
                <div onClick={(e) => e.preventDefault()}>
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
