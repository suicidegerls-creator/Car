'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Check } from 'lucide-react'
import type { Wheel } from '@/lib/types/wheel'
import { WHEEL_TYPE_LABELS } from '@/lib/types/wheel'

interface WheelSelectorProps {
  wheels: Wheel[]
  loading: boolean
  onSelect: (wheel: Wheel) => void
  selectedWheel: Wheel | null
}

export function WheelSelector({ wheels, loading, onSelect, selectedWheel }: WheelSelectorProps) {
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  // Get unique brands
  const brands = Array.from(new Set(wheels.map(w => w.brand))).sort()

  // Filter wheels
  const filteredWheels = wheels.filter(wheel => {
    const matchesSearch = search === '' || 
      wheel.name.toLowerCase().includes(search.toLowerCase()) ||
      wheel.brand.toLowerCase().includes(search.toLowerCase())
    
    const matchesBrand = !selectedBrand || wheel.brand === selectedBrand

    return matchesSearch && matchesBrand
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите диск для примерки</h2>
        <p className="text-muted-foreground">
          Выберите модель диска, которую хотите примерить на ваш автомобиль
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по названию или бренду..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Brand filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedBrand === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedBrand(null)}
        >
          Все бренды
        </Button>
        {brands.map(brand => (
          <Button
            key={brand}
            variant={selectedBrand === brand ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedBrand(brand)}
          >
            {brand}
          </Button>
        ))}
      </div>

      {/* Wheels grid */}
      {filteredWheels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Диски не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWheels.map(wheel => (
            <Card 
              key={wheel.id}
              className={`cursor-pointer transition-all hover:border-accent overflow-hidden ${
                selectedWheel?.id === wheel.id ? 'ring-2 ring-accent' : ''
              }`}
              onClick={() => onSelect(wheel)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
                  {wheel.images && wheel.images.length > 0 ? (
                    <Image
                      src={wheel.images[0]}
                      alt={wheel.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl text-muted-foreground">R{wheel.diameter}</span>
                    </div>
                  )}
                  
                  {selectedWheel?.id === wheel.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{wheel.name}</p>
                  <p className="text-xs text-muted-foreground">{wheel.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      R{wheel.diameter}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {WHEEL_TYPE_LABELS[wheel.wheel_type]}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold mt-2">
                    {wheel.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
