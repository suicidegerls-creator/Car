import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - получить все обращения
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let query = supabase
    .from('support_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - создать новое обращение
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { customer_name, customer_phone, customer_email, subject, message } = body

  if (!customer_name || !customer_phone || !subject || !message) {
    return NextResponse.json(
      { error: 'Заполните все обязательные поля' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('support_requests')
    .insert({
      customer_name,
      customer_phone,
      customer_email,
      subject,
      message,
      status: 'new'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
