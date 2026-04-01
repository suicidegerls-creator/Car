import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
  validateUIMessages,
} from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

// Инструмент поиска дисков
const searchWheelsTool = tool({
  description: 'Поиск дисков в каталоге по параметрам. Используй этот инструмент когда пользователь спрашивает о дисках, хочет подобрать диски или узнать что есть в наличии.',
  inputSchema: z.object({
    brand: z.string().nullable().describe('Бренд/производитель дисков'),
    diameter: z.number().nullable().describe('Диаметр диска (R14-R22)'),
    pcd: z.string().nullable().describe('Разболтовка, например 5x112'),
    wheel_type: z.enum(['forged', 'cast', 'stamped']).nullable().describe('Тип диска: forged=кованые, cast=литые, stamped=штампованные'),
    max_price: z.number().nullable().describe('Максимальная цена в BYN'),
  }),
  execute: async ({ brand, diameter, pcd, wheel_type, max_price }) => {
    const supabase = await createClient()
    
    let query = supabase
      .from('wheels')
      .select('id, name, brand, diameter, width, pcd, et, price, in_stock, wheel_type')
      .eq('in_stock', true)
      .limit(5)
    
    if (brand) query = query.ilike('brand', `%${brand}%`)
    if (diameter) query = query.eq('diameter', diameter)
    if (pcd) query = query.eq('pcd', pcd)
    if (wheel_type) query = query.eq('wheel_type', wheel_type)
    if (max_price) query = query.lte('price', max_price)
    
    const { data, error } = await query
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    if (!data || data.length === 0) {
      return { 
        success: true, 
        message: 'К сожалению, дисков по вашим параметрам не найдено. Попробуйте изменить критерии поиска.',
        wheels: []
      }
    }
    
    return {
      success: true,
      message: `Найдено ${data.length} диск(ов)`,
      wheels: data.map(w => ({
        name: w.name,
        brand: w.brand,
        size: `R${w.diameter} ${w.width}J`,
        pcd: w.pcd,
        et: `ET${w.et}`,
        price: `${w.price} BYN`,
        type: w.wheel_type === 'forged' ? 'кованые' : w.wheel_type === 'cast' ? 'литые' : 'штампованные'
      }))
    }
  }
})

// Инструмент проверки статуса заказа
const getOrderStatusTool = tool({
  description: 'Получить статус заказа по номеру телефона клиента. Используй когда клиент спрашивает о своём заказе.',
  inputSchema: z.object({
    phone: z.string().describe('Номер телефона клиента для поиска заказа')
  }),
  execute: async ({ phone }) => {
    const supabase = await createClient()
    
    // Нормализуем телефон (убираем пробелы, скобки и т.д.)
    const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '')
    
    const { data, error } = await supabase
      .from('orders')
      .select('id, status, total_amount, items_count, created_at, delivery_city')
      .or(`customer_phone.ilike.%${normalizedPhone}%,customer_phone.ilike.%${phone}%`)
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (error) {
      return { success: false, error: 'Ошибка при поиске заказа' }
    }
    
    if (!data || data.length === 0) {
      return { 
        success: true, 
        message: 'Заказы по данному номеру телефона не найдены. Проверьте правильность номера или обратитесь к менеджеру.',
        orders: []
      }
    }
    
    const statusLabels: Record<string, string> = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтверждён',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменён'
    }
    
    return {
      success: true,
      message: `Найдено ${data.length} заказ(ов)`,
      orders: data.map(o => ({
        orderNumber: o.id.slice(0, 8).toUpperCase(),
        status: statusLabels[o.status] || o.status,
        total: `${o.total_amount} BYN`,
        itemsCount: o.items_count,
        city: o.delivery_city,
        date: new Date(o.created_at).toLocaleDateString('ru-RU')
      }))
    }
  }
})

// Инструмент получения информации о доставке
const getDeliveryInfoTool = tool({
  description: 'Информация о доставке, сроках и стоимости. Используй когда клиент спрашивает о доставке.',
  inputSchema: z.object({
    city: z.string().nullable().describe('Город доставки')
  }),
  execute: async ({ city }) => {
    return {
      success: true,
      info: {
        coverage: 'Доставка по всей Беларуси',
        freeDelivery: 'Бесплатно при заказе от 500 BYN',
        standardDelivery: 'от 15 BYN',
        timing: {
          minsk: '1-2 рабочих дня',
          regions: '2-5 рабочих дней'
        },
        pickup: 'Самовывоз из Минска — бесплатно',
        payment: ['Наличными при получении', 'Банковская карта', 'ЕРИП']
      }
    }
  }
})

const tools = {
  searchWheels: searchWheelsTool,
  getOrderStatus: getOrderStatusTool,
  getDeliveryInfo: getDeliveryInfoTool,
}

const systemPrompt = `Ты — AI-консультант интернет-магазина автомобильных дисков RIMZONE в Беларуси.

ТВОИ ЗАДАЧИ:
1. Помогать подобрать диски по параметрам автомобиля или техническим характеристикам
2. Отвечать на вопросы о статусе заказа (нужен номер телефона клиента)
3. Консультировать по доставке, оплате и гарантии
4. Объяснять технические термины (PCD, ET, ЦО и т.д.)

ПРАВИЛА:
- Отвечай на русском языке
- Будь вежливым и профессиональным
- Если не знаешь ответ — предложи связаться с менеджером по телефону +375 (29) 123-45-67
- Цены в белорусских рублях (BYN)
- При подборе дисков всегда уточняй: марку авто, год выпуска, желаемый диаметр и бюджет
- Если клиент спрашивает о заказе — попроси номер телефона для поиска

ИНФОРМАЦИЯ О МАГАЗИНЕ:
- Название: RIMZONE
- Страна: Беларусь
- Телефон: +375 (29) 123-45-67
- Бесплатная доставка от 500 BYN
- Гарантия на все диски: 1 год
- Работаем: Пн-Пт 9:00-19:00, Сб 10:00-16:00`

export async function POST(req: Request) {
  const body = await req.json()

  const messages = await validateUIMessages({
    messages: body.messages as UIMessage[],
    tools,
  })

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  })

  return result.toUIMessageStreamResponse()
}
