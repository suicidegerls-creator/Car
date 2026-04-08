'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, ShoppingBag, CheckCircle, Truck, Phone, MapPin, Store, Banknote, CreditCard } from 'lucide-react'
import Link from 'next/link'

const CITIES = [
  'Минск',
  'Брест',
  'Витебск',
  'Гомель',
  'Гродно',
  'Могилёв',
  'Бобруйск',
  'Барановичи',
  'Борисов',
  'Пинск',
  'Орша',
  'Мозырь',
  'Солигорск',
  'Новополоцк',
  'Лида',
  'Молодечно',
  'Полоцк',
  'Жлобин',
  'Светлогорск',
  'Речица',
]

export function CheckoutForm() {
  const router = useRouter()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_type: 'delivery' as 'delivery' | 'pickup',
    delivery_city: '',
    delivery_address: '',
    delivery_comment: '',
    payment_method: 'cash' as 'cash' | 'card',
  })
  
  // Стоимость доставки (бесплатно при заказе от 500 BYN или самовывозе)
  const deliveryCost = formData.delivery_type === 'pickup' ? 0 : (getTotalPrice() >= 500 ? 0 : 30)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalPrice = mounted ? getTotalPrice() : 0
  const totalItems = mounted ? getTotalItems() : 0

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка оформления заказа')
      }

      setOrderId(data.order_id)
      setSuccess(true)
      clearCart()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Заказ оформлен!</h2>
          <p className="text-muted-foreground mb-4">
            Номер заказа: <span className="font-mono font-medium">{orderId?.slice(0, 8)}</span>
          </p>
          <p className="text-muted-foreground mb-6">
            Мы свяжемся с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/catalog">Продолжить покупки</Link>
            </Button>
            <Button asChild>
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Корзина пуста</h2>
          <p className="text-muted-foreground mb-6">
            Добавьте товары из каталога для оформления заказа
          </p>
          <Button asChild>
            <Link href="/catalog">Перейти в каталог</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Форма */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Контактные данные */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Контактные данные
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Имя *</Label>
                  <Input
                    id="customer_name"
                    placeholder="Иван Иванов"
                    value={formData.customer_name}
                    onChange={(e) => handleChange('customer_name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Телефон *</Label>
                  <Input
                    id="customer_phone"
                    type="tel"
                    placeholder="+375 (29) 123-45-67"
                    value={formData.customer_phone}
                    onChange={(e) => handleChange('customer_phone', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email (необязательно)</Label>
                <Input
                  id="customer_email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.customer_email}
                  onChange={(e) => handleChange('customer_email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Способ получения */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Способ получения
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.delivery_type}
                onValueChange={(v) => handleChange('delivery_type', v)}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="delivery"
                  className={`flex flex-col items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.delivery_type === 'delivery' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                  <Truck className="w-8 h-8" />
                  <div className="text-center">
                    <p className="font-medium">Доставка</p>
                    <p className="text-xs text-muted-foreground">По всей Беларуси</p>
                  </div>
                </Label>
                <Label
                  htmlFor="pickup"
                  className={`flex flex-col items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.delivery_type === 'pickup' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                  <Store className="w-8 h-8" />
                  <div className="text-center">
                    <p className="font-medium">Самовывоз</p>
                    <p className="text-xs text-muted-foreground">Бесплатно</p>
                  </div>
                </Label>
              </RadioGroup>

              {formData.delivery_type === 'pickup' ? (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="font-medium">Адрес самовывоза:</p>
                  <p className="text-sm text-muted-foreground">
                    г. Минск, ул. Примерная, 123
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Режим работы: Пн-Сб 9:00 - 19:00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Телефон: +375 (29) 123-45-67
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_city">Город *</Label>
                    <Select
                      value={formData.delivery_city || 'none'}
                      onValueChange={(v) => handleChange('delivery_city', v === 'none' ? '' : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите город" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Выберите город</SelectItem>
                        {CITIES.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_address">Адрес доставки *</Label>
                    <Input
                      id="delivery_address"
                      placeholder="ул. Пример, д. 1, кв. 1"
                      value={formData.delivery_address}
                      onChange={(e) => handleChange('delivery_address', e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="delivery_comment">Комментарий к заказу</Label>
                <Textarea
                  id="delivery_comment"
                  placeholder={formData.delivery_type === 'pickup' 
                    ? "Удобное время для самовывоза..." 
                    : "Удобное время доставки, особые пожелания..."}
                  value={formData.delivery_comment}
                  onChange={(e) => handleChange('delivery_comment', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Способ оплаты */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                Способ оплаты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.payment_method}
                onValueChange={(v) => handleChange('payment_method', v)}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="cash"
                  className={`flex flex-col items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.payment_method === 'cash' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <RadioGroupItem value="cash" id="cash" className="sr-only" />
                  <Banknote className="w-8 h-8" />
                  <div className="text-center">
                    <p className="font-medium">Наличными</p>
                    <p className="text-xs text-muted-foreground">При получении</p>
                  </div>
                </Label>
                <Label
                  htmlFor="card"
                  className={`flex flex-col items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.payment_method === 'card' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <RadioGroupItem value="card" id="card" className="sr-only" />
                  <CreditCard className="w-8 h-8" />
                  <div className="text-center">
                    <p className="font-medium">Картой</p>
                    <p className="text-xs text-muted-foreground">При получении</p>
                  </div>
                </Label>
              </RadioGroup>
              
              <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                {formData.payment_method === 'cash' ? (
                  <p>Оплата наличными {formData.delivery_type === 'pickup' ? 'в магазине при самовывозе' : 'курьеру при получении заказа'}.</p>
                ) : (
                  <p>Оплата банковской картой {formData.delivery_type === 'pickup' ? 'в магазине при самовывозе' : 'курьеру при получении заказа'}. Курьер приедет с терминалом.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading || !formData.customer_name || !formData.customer_phone || (formData.delivery_type === 'delivery' && (!formData.delivery_city || !formData.delivery_address))}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Оформляем заказ...
              </>
            ) : (
              'Оформить заказ'
            )}
          </Button>
        </form>
      </div>

      {/* Сводка заказа */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ваш заказ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.wheel_id} className="flex gap-3">
                <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  {item.wheel_image ? (
                    <img
                      src={item.wheel_image}
                      alt={item.wheel_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{item.wheel_name}</p>
                  <p className="text-xs text-muted-foreground">{item.quantity} шт.</p>
                  <p className="text-sm font-semibold">
                    {(item.price * item.quantity).toLocaleString('be-BY')} BYN
                  </p>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Товаров:</span>
                <span>{totalItems} шт.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Сумма товаров:</span>
                <span>{totalPrice.toLocaleString('be-BY')} BYN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {formData.delivery_type === 'pickup' ? 'Самовывоз:' : 'Доставка:'}
                </span>
                <span className={deliveryCost === 0 ? 'text-green-600' : ''}>
                  {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} BYN`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Оплата:</span>
                <span>{formData.payment_method === 'cash' ? 'Наличными' : 'Картой'}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="font-medium">Итого к оплате:</span>
              <span className="text-xl font-bold">
                {(totalPrice + deliveryCost).toLocaleString('be-BY')} BYN
              </span>
            </div>

            {deliveryCost === 0 && formData.delivery_type === 'delivery' && (
              <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg text-center">
                Бесплатная доставка при заказе от 500 BYN
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
