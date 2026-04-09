import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendOrderNotification } from '@/lib/telegram'

// POST - создание заказа
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const body = await request.json()
    console.log('[v0] Order request body:', JSON.stringify(body, null, 2))
    const { items, customer_name, customer_phone, customer_email, delivery_type, delivery_city, delivery_address, delivery_comment, payment_method } = body
    
    // Валидация
    if (!items?.length) {
      return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 })
    }
    
    if (!customer_name || !customer_phone) {
      return NextResponse.json({ error: 'Заполните имя и телефон' }, { status: 400 })
    }
    
    // Для доставки требуем город и адрес
    if (delivery_type === 'delivery' && (!delivery_city || !delivery_address)) {
      return NextResponse.json({ error: 'Заполните город и адрес доставки' }, { status: 400 })
    }
    
    // Считаем итоговую сумму
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + item.price * item.quantity, 0
    )
    const items_count = items.reduce((sum: number, item: { quantity: number }) => 
      sum + item.quantity, 0
    )
    
    // Стоимость доставки (бесплатно при самовывозе или заказе от 500 BYN)
    const delivery_cost = delivery_type === 'pickup' ? 0 : (subtotal >= 500 ? 0 : 30)
    const total_amount = subtotal + delivery_cost
    
    // Создаём заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        delivery_type: delivery_type || 'delivery',
        delivery_city: delivery_type === 'pickup' ? 'Самовывоз' : delivery_city,
        delivery_address: delivery_type === 'pickup' ? 'г. Минск, ул. Примерная, 123' : delivery_address,
        delivery_comment: delivery_comment || null,
        payment_method: payment_method || 'cash',
        delivery_cost,
        total_amount,
        items_count,
      })
      .select()
      .single()
    
    if (orderError) {
      console.error('[v0] Order creation error:', orderError)
      return NextResponse.json({ error: 'Ошибка создания заказа: ' + orderError.message }, { status: 500 })
    }
    
    console.log('[v0] Order created:', order.id)
    
    // Добавляем товары в заказ
    const orderItems = items.map((item: {
      wheel_id: string
      wheel_name: string
      wheel_brand: string
      wheel_sku?: string
      wheel_image?: string
      diameter?: number
      width?: number
      pcd?: string
      et?: number
      price: number
      quantity: number
    }) => ({
      order_id: order.id,
      wheel_id: item.wheel_id,
      wheel_name: item.wheel_name,
      wheel_brand: item.wheel_brand,
      wheel_sku: item.wheel_sku || null,
      wheel_image: item.wheel_image || null,
      diameter: item.diameter || null,
      width: item.width || null,
      pcd: item.pcd || null,
      et: item.et || null,
      price: item.price,
      quantity: item.quantity,
    }))
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Удаляем заказ если не удалось добавить товары
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Ошибка добавления товаров' }, { status: 500 })
    }
    
    // Отправляем уведомление в Telegram (не блокируем создание заказа если не получилось)
    try {
      await sendOrderNotification({
        orderId: order.id,
        customerName: customer_name,
        customerPhone: customer_phone,
        customerEmail: customer_email,
        deliveryType: delivery_type || 'delivery',
        deliveryCity: delivery_type === 'pickup' ? 'Самовывоз' : delivery_city,
        deliveryAddress: delivery_type === 'pickup' ? 'г. Минск, ул. Примерная, 123' : delivery_address,
        deliveryComment: delivery_comment,
        paymentMethod: payment_method || 'cash',
        items: items.map((item: { wheel_name: string; quantity: number; price: number }) => ({
          name: item.wheel_name,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryCost: delivery_cost,
        totalAmount: total_amount,
      })
    } catch (telegramError) {
      console.error('Telegram notification error:', telegramError)
      // Не блокируем создание заказа если Telegram недоступен
    }
    
    return NextResponse.json({ 
      success: true, 
      order_id: order.id,
      message: 'Заказ успешно создан! Мы свяжемся с вами для подтверждения.'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

// GET - получение заказов (для админки)
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  
  const status = searchParams.get('status')
  const phone = searchParams.get('phone')
  
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (status) query = query.eq('status', status)
  if (phone) query = query.eq('customer_phone', phone)
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
