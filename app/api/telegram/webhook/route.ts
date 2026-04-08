import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// Supabase client с service role для обновления заказов
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Обработка callback query (нажатие на кнопку)
    if (body.callback_query) {
      const callbackQuery = body.callback_query
      const data = callbackQuery.data
      const chatId = callbackQuery.message.chat.id
      const messageId = callbackQuery.message.message_id
      
      // Подтверждение заказа
      if (data.startsWith('confirm_order:')) {
        const orderId = data.replace('confirm_order:', '')
        
        // Обновляем статус заказа в БД
        const { data: order, error } = await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .eq('id', orderId)
          .select('customer_name')
          .single()
        
        if (error) {
          await answerCallbackQuery(callbackQuery.id, '❌ Ошибка при подтверждении заказа')
          return NextResponse.json({ ok: true })
        }
        
        // Отвечаем на callback
        await answerCallbackQuery(callbackQuery.id, '✅ Заказ подтверждён!')
        
        // Обновляем сообщение - добавляем отметку о подтверждении
        const originalText = callbackQuery.message.text
        const updatedText = originalText + '\n\n✅ *ЗАКАЗ ПОДТВЕРЖДЁН*'
        
        // Обновляем кнопки - убираем кнопку подтверждения
        const newKeyboard = {
          inline_keyboard: [
            [
              {
                text: '📞 Позвонить клиенту',
                url: `tel:${extractPhone(originalText)}`
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
        
        await editMessage(chatId, messageId, updatedText, newKeyboard)
      }
      
      return NextResponse.json({ ok: true })
    }
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

async function answerCallbackQuery(callbackQueryId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text,
      show_alert: true,
    }),
  })
}

async function editMessage(chatId: number, messageId: number, text: string, replyMarkup: object) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: 'Markdown',
      reply_markup: replyMarkup,
    }),
  })
}

function extractPhone(text: string): string {
  const match = text.match(/Телефон:\s*([+\d\s\-()]+)/)
  return match ? match[1].replace(/[^+\d]/g, '') : ''
}

// GET endpoint для проверки и настройки webhook
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  if (action === 'setup') {
    // Устанавливаем webhook
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/telegram/webhook`
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['callback_query'],
      }),
    })
    
    const result = await response.json()
    return NextResponse.json(result)
  }
  
  if (action === 'info') {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`)
    const result = await response.json()
    return NextResponse.json(result)
  }
  
  return NextResponse.json({ status: 'Telegram webhook endpoint' })
}
