// Telegram Bot Integration для уведомлений о заказах

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderNotification {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryType: 'delivery' | 'pickup'
  deliveryCity?: string
  deliveryAddress?: string
  deliveryComment?: string
  paymentMethod: 'cash' | 'card'
  items: OrderItem[]
  deliveryCost: number
  totalAmount: number
}

export async function sendOrderNotification(order: OrderNotification): Promise<boolean> {
  console.log('[v0] Telegram notification called for order:', order.orderId)
  console.log('[v0] TELEGRAM_BOT_TOKEN exists:', !!TELEGRAM_BOT_TOKEN)
  console.log('[v0] TELEGRAM_CHAT_ID exists:', !!TELEGRAM_CHAT_ID)
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('[v0] Telegram credentials not configured - BOT_TOKEN:', !!TELEGRAM_BOT_TOKEN, 'CHAT_ID:', !!TELEGRAM_CHAT_ID)
    return false
  }

  // Формируем список товаров
  const itemsList = order.items
    .map(item => `  - ${item.name} x ${item.quantity} шт. = ${item.price} BYN`)
    .join('\n')

  // Формируем сообщение (без Markdown для избежания ошибок парсинга)
  const message = `
НОВЫЙ ЗАКАЗ #${order.orderId.slice(0, 8)}

Клиент: ${order.customerName}
Телефон: ${order.customerPhone}
${order.customerEmail ? `Email: ${order.customerEmail}` : ''}

Способ: ${order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
Адрес: ${order.deliveryType === 'delivery' ? `${order.deliveryCity || ''}, ${order.deliveryAddress || ''}` : 'г. Минск, ул. Примерная, 123'}
Оплата: ${order.paymentMethod === 'cash' ? 'Наличными' : 'Картой'} при получении
${order.deliveryComment ? `Комментарий: ${order.deliveryComment}` : ''}

Товары:
${itemsList}

Доставка: ${order.deliveryCost > 0 ? order.deliveryCost + ' BYN' : 'Бесплатно'}
ИТОГО: ${order.totalAmount} BYN
`.trim()

  // Кнопки
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ Подтвердить заказ',
          callback_data: `confirm_order:${order.orderId}`
        }
      ],
      [
        {
          text: '📞 Позвонить клиенту',
          url: `tel:${order.customerPhone.replace(/[^+\d]/g, '')}`
        }
      ],
      [
        {
          text: '📋 Открыть в админке',
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://car-two-beta-48.vercel.app'}/admin?token=rimzone-admin-2024`
        }
      ]
    ]
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        reply_markup: keyboard,
      }),
    })

    const result = await response.json()
    console.log('[v0] Telegram API response:', JSON.stringify(result))
    
    if (!result.ok) {
      console.error('[v0] Telegram API error:', result)
      return false
    }

    console.log('[v0] Telegram notification sent successfully')
    return true
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
    return false
  }
}

export async function sendOrderStatusUpdate(
  orderId: string, 
  status: string,
  customerName: string
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return false
  }

  const statusLabels: Record<string, string> = {
    confirmed: '✅ Подтверждён',
    processing: '🔧 В обработке',
    shipped: '🚚 Отправлен',
    delivered: '📦 Доставлен',
    cancelled: '❌ Отменён',
  }

  const message = `
📋 *Статус заказа изменён*

Заказ #${orderId.slice(0, 8)}
Клиент: ${escapeMarkdown(customerName)}
Новый статус: ${statusLabels[status] || status}
`.trim()

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    return (await response.json()).ok
  } catch (error) {
    console.error('Failed to send status update:', error)
    return false
  }
}

// Экранирование специальных символов Markdown
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}
