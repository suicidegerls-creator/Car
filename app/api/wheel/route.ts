import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - получить текущую скидку и статус
export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Получаем последний спин пользователя
  const { data: lastSpin } = await supabase
    .from("user_discounts")
    .select("*")
    .eq("user_id", user.id)
    .order("spun_at", { ascending: false })
    .limit(1)
    .single()

  // Проверяем, может ли пользователь крутить (прошла ли неделя)
  let canSpin = true
  let nextSpinAt = null
  
  if (lastSpin) {
    const lastSpinDate = new Date(lastSpin.spun_at)
    const weekLater = new Date(lastSpinDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    if (new Date() < weekLater) {
      canSpin = false
      nextSpinAt = weekLater.toISOString()
    }
  }

  // Получаем активную (неиспользованную, не истекшую) скидку
  const { data: activeDiscount } = await supabase
    .from("user_discounts")
    .select("*")
    .eq("user_id", user.id)
    .is("used_at", null)
    .not("activated_at", "is", null)
    .gt("expires_at", new Date().toISOString())
    .order("activated_at", { ascending: false })
    .limit(1)
    .single()

  // Получаем неактивированную скидку (выиграна, но не применена)
  const { data: pendingDiscount } = await supabase
    .from("user_discounts")
    .select("*")
    .eq("user_id", user.id)
    .is("activated_at", null)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("spun_at", { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({
    canSpin,
    nextSpinAt,
    activeDiscount,
    pendingDiscount,
    lastSpin
  })
}

// POST - крутить колесо
export async function POST() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Проверяем, может ли пользователь крутить
  const { data: lastSpin } = await supabase
    .from("user_discounts")
    .select("spun_at")
    .eq("user_id", user.id)
    .order("spun_at", { ascending: false })
    .limit(1)
    .single()

  if (lastSpin) {
    const lastSpinDate = new Date(lastSpin.spun_at)
    const weekLater = new Date(lastSpinDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    if (new Date() < weekLater) {
      return NextResponse.json({ 
        error: "Too soon", 
        nextSpinAt: weekLater.toISOString() 
      }, { status: 429 })
    }
  }

  // Генерируем скидку с весами (меньшие скидки более вероятны)
  const weights = [30, 25, 20, 12, 8, 5] // 0%, 1%, 2%, 3%, 4%, 5%
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight
  let discountPercent = 0
  
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      discountPercent = i
      break
    }
  }

  // Сохраняем результат
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 часа
  
  const { data: discount, error } = await supabase
    .from("user_discounts")
    .insert({
      user_id: user.id,
      discount_percent: discountPercent,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating discount:", error)
    return NextResponse.json({ error: "Failed to create discount" }, { status: 500 })
  }

  return NextResponse.json({ discount })
}

// PATCH - активировать скидку
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { discountId } = await request.json()

  if (!discountId) {
    return NextResponse.json({ error: "Discount ID required" }, { status: 400 })
  }

  // Проверяем что скидка принадлежит пользователю и не истекла
  const { data: discount } = await supabase
    .from("user_discounts")
    .select("*")
    .eq("id", discountId)
    .eq("user_id", user.id)
    .is("activated_at", null)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (!discount) {
    return NextResponse.json({ error: "Discount not found or expired" }, { status: 404 })
  }

  // Активируем скидку
  const { data: updatedDiscount, error } = await supabase
    .from("user_discounts")
    .update({ activated_at: new Date().toISOString() })
    .eq("id", discountId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to activate discount" }, { status: 500 })
  }

  return NextResponse.json({ discount: updatedDiscount })
}
