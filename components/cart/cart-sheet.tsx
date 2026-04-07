'use client'

import { useCart } from '@/hooks/use-cart'
import { CartItem } from '@/lib/types/order'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function CartSheet() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [cartState, setCartState] = useState<{ items: CartItem[], totalItems: number, totalPrice: number }>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  })

  useEffect(() => {
    setMounted(true)
    // Initial state
    const state = useCart.getState()
    setCartState({
      items: state.items,
      totalItems: state.getTotalItems(),
      totalPrice: state.getTotalPrice(),
    })
    
    // Subscribe to changes
    const unsubscribe = useCart.subscribe((state) => {
      setCartState({
        items: state.items,
        totalItems: state.getTotalItems(),
        totalPrice: state.getTotalPrice(),
      })
    })
    
    return () => unsubscribe()
  }, [])

  const { items, totalItems, totalPrice } = cartState
  const removeItem = useCart.getState().removeItem
  const updateQuantity = useCart.getState().updateQuantity

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Корзина
            {mounted && totalItems > 0 && (
              <span className="text-muted-foreground font-normal">
                ({totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Просмотр и управление товарами в корзине
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Корзина пуста</p>
              <p className="text-muted-foreground mb-4">
                Добавьте диски из каталога
              </p>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/catalog">Перейти в каталог</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.wheel_id}
                  className="flex gap-3 p-3 bg-secondary/50 rounded-lg"
                >
                  {/* Изображение */}
                  <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {item.wheel_image ? (
                      <img
                        src={item.wheel_image}
                        alt={item.wheel_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Информация */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{item.wheel_name}</p>
                    <p className="text-xs text-muted-foreground">{item.wheel_brand}</p>
                    {item.diameter && item.pcd && (
                      <p className="text-xs text-muted-foreground">
                        R{item.diameter} | {item.pcd}
                      </p>
                    )}
                    <p className="font-semibold mt-1">
                      {item.price.toLocaleString('be-BY')} BYN
                    </p>
                  </div>

                  {/* Количество и удаление */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.wheel_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.wheel_id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.wheel_id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {mounted && items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Итого:</span>
                <span className="text-2xl font-bold">
                  {totalPrice.toLocaleString('be-BY')} BYN
                </span>
              </div>
              <Button asChild className="w-full" size="lg" onClick={() => setOpen(false)}>
                <Link href="/checkout">Оформить заказ</Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
