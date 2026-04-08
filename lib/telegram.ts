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
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured')
    return false
  }

  // Формируем список товаров
  const itemsList = order.items
    .map(item => `• ${item.name} — ${item.quantity} шт. — ${item.price.toLocaleString('ru-RU')} BYN`)
    .join('\n')

  // Формируем сообщение
  const message = `
🛒 *Новый заказ #${order.orderId.slice(0, 8)}*

👤 *Клиент:* ${escapeMarkdown(order.customerName)}
📱 *Телефон:* ${escapeMarkdown(order.customerPhone)}
${order.customerEmail ? `📧 *Email:* ${escapeMarkdown(order.customerEmail)}` : ''}

📦 *Способ получения:* ${order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
${order.deliveryType === 'delivery' ? `📍 *Адрес:* ${escapeMarkdown(order.deliveryCity || '')}${order.deliveryAddress ? ', ' + escapeMarkdown(order.deliveryAddress) : ''}` : '📍 *Адрес:* г. Минск, ул. Примерная, 123'}
💳 *Оплата:* ${order.paymentMethod === 'cash' ? 'Наличными' : 'Картой'} при получении
${order.deliveryComment ? `💬 *Комментарий:* ${escapeMarkdown(order.deliveryComment)}` : ''}

🛞 *Товары:*
${itemsList}

${order.deliveryCost > 0 ? `🚚 *Доставка:* ${order.deliveryCost} BYN` : '🚚 *Доставка:* Бесплатно'}
💰 *Итого:* ${order.totalAmount.toLocaleString('ru-RU')} BYN
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
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      }),
    })

    const result = await response.json()
    
    if (!result.ok) {
      console.error('Telegram API error:', result)
      return false
    }

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
