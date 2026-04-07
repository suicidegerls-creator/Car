'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Phone,
  Package,
  Truck,
  Shield,
  Check,
} from 'lucide-react'
import { Wheel, WHEEL_TYPE_LABELS } from '@/lib/types/wheel'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { useViewHistory } from '@/hooks/use-view-history'
import { Recommendations } from './recommendations'

interface ProductDetailsProps {
  wheel: Wheel
}

export function ProductDetails({ wheel }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const images = wheel.images?.length > 0 ? wheel.images : []
  
  const trackView = useViewHistory((state) => state.trackView)
  const updateViewDuration = useViewHistory((state) => state.updateViewDuration)
  const viewStartTime = useRef<number>(Date.now())

  // Отслеживаем просмотр товара
  useEffect(() => {
    trackView({
      id: wheel.id,
      name: wheel.name,
      brand: wheel.brand,
      diameter: wheel.diameter,
      color: wheel.color,
      wheel_type: wheel.wheel_type,
      price: wheel.price,
      image: wheel.images?.[0] || null,
    })

    viewStartTime.current = Date.now()

    // Обновляем длительность просмотра каждые 5 секунд
    const durationInterval = setInterval(() => {
      const duration = Math.floor((Date.now() - viewStartTime.current) / 1000)
      if (duration > 0) {
        updateViewDuration(wheel.id, 5)
      }
    }, 5000)

    // При уходе со страницы записываем финальную длительность
    return () => {
      clearInterval(durationInterval)
      const finalDuration = Math.floor((Date.now() - viewStartTime.current) / 1000)
      if (finalDuration > 0) {
        updateViewDuration(wheel.id, finalDuration % 5) // Записываем остаток
      }
    }
  }, [wheel.id, wheel.name, wheel.brand, wheel.diameter, wheel.color, wheel.wheel_type, wheel.price, wheel.images, trackView, updateViewDuration])

  const nextImage = () => {
    if (images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const specs = [
    { label: 'Тип диска', value: WHEEL_TYPE_LABELS[wheel.wheel_type] },
    { label: 'Диаметр', value: `R${wheel.diameter}` },
    { label: 'Ширина', value: `${wheel.width}J` },
    { label: 'PCD (разболтовка)', value: wheel.pcd },
    { label: 'Вылет ET', value: `${wheel.et} мм` },
    { label: 'Диаметр ЦО', value: `${wheel.center_bore} мм` },
    ...(wheel.bolts_count ? [{ label: 'Количество болтов', value: `${wheel.bolts_count}` }] : []),
    ...(wheel.color ? [{ label: 'Цвет', value: wheel.color }] : []),
    ...(wheel.finish ? [{ label: 'Покрытие', value: wheel.finish }] : []),
    ...(wheel.material ? [{ label: 'Материал', value: wheel.material }] : []),
    ...(wheel.weight ? [{ label: 'Вес', value: `${wheel.weight} кг` }] : []),
    ...(wheel.country ? [{ label: 'Страна производства', value: wheel.country }] : []),
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Главная
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-foreground transition-colors">
          Каталог
        </Link>
        <span>/</span>
        <span className="text-foreground">{wheel.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-secondary rounded-lg overflow-hidden">
            {images.length > 0 ? (
              <>
                <img
                  src={images[selectedImage]}
                  alt={wheel.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-muted-foreground" />
              </div>
            )}
            
            {wheel.old_price && wheel.old_price > wheel.price && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                -{Math.round((1 - wheel.price / wheel.old_price) * 100)}%
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-foreground' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{WHEEL_TYPE_LABELS[wheel.wheel_type]}</Badge>
              <Badge variant="secondary">{wheel.brand}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{wheel.name}</h1>
            {wheel.sku && (
              <p className="text-sm text-muted-foreground">Артикул: {wheel.sku}</p>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            {wheel.old_price && wheel.old_price > wheel.price && (
              <span className="text-xl text-muted-foreground line-through">
                {wheel.old_price.toLocaleString('be-BY')} BYN
              </span>
            )}
            <span className="text-3xl md:text-4xl font-bold">
              {wheel.price.toLocaleString('be-BY')} BYN
            </span>
          </div>

          <div className="flex items-center gap-2">
            {wheel.in_stock ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-medium">В наличии</span>
                {wheel.quantity > 0 && (
                  <span className="text-muted-foreground">({wheel.quantity} шт.)</span>
                )}
              </>
            ) : (
              <Badge variant="destructive">Нет в наличии</Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <AddToCartButton wheel={wheel} size="lg" className="flex-1" />
            <Button size="lg" variant="outline">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" className="flex-1" asChild>
              <a href="tel:+375291234567">
                <Phone className="w-4 h-4 mr-2" />
                Позвонить
              </a>
            </Button>
          </div>

          <Separator />

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Доставка</p>
                <p className="text-muted-foreground">По всей Беларуси</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Гарантия</p>
                <p className="text-muted-foreground">1 год</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Возврат</p>
                <p className="text-muted-foreground">14 дней</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Характеристики</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {specs.map((spec, index) => (
                <div key={index} className="flex justify-between py-3 px-4">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {wheel.description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Описание</h2>
          <p className="text-muted-foreground leading-relaxed">{wheel.description}</p>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-12">
        <Recommendations 
          currentWheelId={wheel.id} 
          type="personalized"
          title="Рекомендуем на основе ваших просмотров"
          limit={6}
        />
      </div>

      <div className="mt-8">
        <Recommendations 
          currentWheelId={wheel.id} 
          type="recently-viewed"
          limit={6}
        />
      </div>
    </div>
  )
}
