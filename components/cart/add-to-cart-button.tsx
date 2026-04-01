'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { Wheel } from '@/lib/types/wheel'

interface AddToCartButtonProps {
  wheel: Wheel
  quantity?: number
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showText?: boolean
}

export function AddToCartButton({ 
  wheel, 
  quantity = 1, 
  size = 'default',
  className = '',
  showText = true 
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      wheel_id: wheel.id,
      wheel_name: wheel.name,
      wheel_brand: wheel.brand,
      wheel_sku: wheel.sku || undefined,
      wheel_image: wheel.images?.[0] || undefined,
      diameter: wheel.diameter,
      width: wheel.width,
      pcd: wheel.pcd,
      et: wheel.et,
      price: wheel.price,
      quantity,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!wheel.in_stock) {
    return (
      <Button 
        variant="outline" 
        size={size} 
        disabled 
        className={className}
      >
        Нет в наличии
      </Button>
    )
  }

  return (
    <Button
      size={size}
      className={`${className} ${added ? 'bg-green-600 hover:bg-green-600' : ''}`}
      onClick={handleAddToCart}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          {showText && <span className="ml-2">Добавлено</span>}
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {showText && <span className="ml-2">В корзину</span>}
        </>
      )}
    </Button>
  )
}
