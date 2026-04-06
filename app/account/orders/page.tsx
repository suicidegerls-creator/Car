'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Package, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'

interface OrderItem {
  id: string
  wheel_name: string
  wheel_brand: string
  wheel_size: string
  quantity: number
  price: number
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  delivery_address: string
  delivery_city: string
  created_at: string
  items?: OrderItem[]
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает обработки',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({})

  const supabase = createClient()

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Получаем заказы пользователя по email (так как user_id мог не быть при создании заказа)
      const { data } = await supabase
        .from('orders')
        .select('*')
        .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
        .order('created_at', { ascending: false })

      setOrders(data || [])
      setLoading(false)
    }

    fetchOrders()
  }, [supabase])

  const toggleOrder = async (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
      return
    }

    setExpandedOrder(orderId)

    // Загружаем товары заказа если ещё не загружены
    if (!orderItems[orderId]) {
      const { data } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      setOrderItems(prev => ({ ...prev, [orderId]: data || [] }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
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
        <h2 className="text-2xl font-bold">Мои заказы</h2>
        <p className="text-muted-foreground">История ваших заказов</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Заказов пока нет</h3>
            <p className="text-muted-foreground text-center mb-4">
              Когда вы оформите заказ, он появится здесь
            </p>
            <Button asChild>
              <a href="/catalog">Перейти в каталог</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Заказ #{order.order_number}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(order.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}>
                      {STATUS_LABELS[order.status] || order.status}
                    </Badge>
                    <span className="font-semibold">{formatPrice(order.total_amount)}</span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedOrder === order.id && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4 space-y-4">
                    {/* Адрес доставки */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Адрес доставки:</p>
                      <p className="text-sm">{order.delivery_city}, {order.delivery_address}</p>
                    </div>

                    {/* Товары */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Товары:</p>
                      {orderItems[order.id] ? (
                        <div className="space-y-2">
                          {orderItems[order.id].map((item) => (
                            <div 
                              key={item.id} 
                              className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
                            >
                              <div>
                                <p className="font-medium">{item.wheel_brand} {item.wheel_name}</p>
                                <p className="text-sm text-muted-foreground">{item.wheel_size}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatPrice(item.price)}</p>
                                <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
