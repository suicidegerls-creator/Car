"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DiscountWheel } from "@/components/wheel/discount-wheel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { Check, Clock, Gift, Info, Lock, Sparkles, Timer, Zap } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface DiscountData {
  id: string
  discount_percent: number
  spun_at: string
  expires_at: string
  activated_at: string | null
  used_at: string | null
}

interface WheelStatus {
  canSpin: boolean
  nextSpinAt: string | null
  activeDiscount: DiscountData | null
  pendingDiscount: DiscountData | null
}

export default function WheelPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<WheelStatus | null>(null)
  const [lastWonDiscount, setLastWonDiscount] = useState<number | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/wheel")
      if (res.ok) {
        const data = await res.json()
        setStatus(data)
      }
    } catch (error) {
      console.error("Failed to fetch wheel status:", error)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
      if (user) {
        fetchStatus()
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchStatus()
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchStatus])

  // Вызывается при нажатии на колесо - запрашивает скидку у API
  const handleSpinStart = async (): Promise<number | null> => {
    if (!user || !status?.canSpin) {
      toast.error("Вы не можете крутить колесо сейчас")
      return null
    }
    
    try {
      const res = await fetch("/api/wheel", { method: "POST" })
      
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Не удалось крутить колесо")
        return null
      }
      
      const data = await res.json()
      return data.discount?.discount_percent ?? 0
    } catch (error) {
      toast.error("Ошибка при вращении колеса")
      return null
    }
  }

  // Вызывается после остановки колеса
  const handleSpinComplete = async (discount: number) => {
    setLastWonDiscount(discount)
    await fetchStatus()
    
    if (discount > 0) {
      toast.success(`Вы выиграли скидку ${discount}%!`, {
        description: "Активируйте её в течение 24 часов"
      })
    } else {
      toast.info("В этот раз не повезло", {
        description: "Попробуйте снова через неделю"
      })
    }
  }

  const handleActivate = async () => {
    if (!status?.pendingDiscount) return
    
    try {
      const res = await fetch("/api/wheel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountId: status.pendingDiscount.id })
      })
      
      if (res.ok) {
        toast.success("Скидка активирована!", {
          description: "Она будет применена к вашему следующему заказу"
        })
        setLastWonDiscount(null)
        await fetchStatus()
      } else {
        toast.error("Не удалось активировать скидку")
      }
    } catch (error) {
      toast.error("Ошибка при активации скидки")
    }
  }

  const formatTimeLeft = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    
    if (diff <= 0) return "Истекло"
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} дн. ${hours % 24} ч.`
    }
    
    return `${hours} ч. ${minutes} мин.`
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12 pt-24">
        {/* Hero */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            <Sparkles className="w-4 h-4 mr-1" />
            Эксклюзивно для клиентов
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Колесо <span className="text-primary">Удачи</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Испытайте удачу и выиграйте скидку до 5% на любой заказ!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Wheel Section */}
          <div className="flex flex-col items-center">
            {loading ? (
              <div className="w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-full bg-muted animate-pulse" />
            ) : !user ? (
              <Card className="w-full max-w-md text-center p-8">
                <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Только для зарегистрированных</h3>
                <p className="text-muted-foreground mb-6">
                  Войдите или зарегистрируйтесь, чтобы крутить колесо удачи
                </p>
                <Link href="/auth">
                  <Button size="lg" className="w-full">
                    Войти / Регистрация
                  </Button>
                </Link>
              </Card>
            ) : (
              <>
                <DiscountWheel
                  onSpinStart={handleSpinStart}
                  onSpinComplete={handleSpinComplete}
                  disabled={!status?.canSpin}
                />
                
                {/* Result message */}
                {lastWonDiscount !== null && (
                  <div className={`mt-6 text-center p-4 rounded-xl animate-in fade-in zoom-in duration-300 ${
                    lastWonDiscount > 0 ? "bg-primary/10 border border-primary" : "bg-muted"
                  }`}>
                    {lastWonDiscount > 0 ? (
                      <>
                        <p className="text-2xl font-bold text-primary">Поздравляем!</p>
                        <p className="text-lg text-foreground">
                          Вы выиграли скидку <span className="font-bold text-primary">{lastWonDiscount}%</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-semibold text-muted-foreground">В этот раз не повезло</p>
                        <p className="text-sm text-muted-foreground">Попробуйте снова через неделю!</p>
                      </>
                    )}
                  </div>
                )}
                
                {!status?.canSpin && status?.nextSpinAt && (
                  <div className="mt-6 text-center p-4 bg-muted rounded-xl">
                    <Clock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Следующая попытка через:
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {formatTimeLeft(status.nextSpinAt)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Pending Discount - needs activation */}
            {user && status?.pendingDiscount && status.pendingDiscount.discount_percent > 0 && (
              <Card className="border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Gift className="w-5 h-5" />
                    Ваш выигрыш!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <span className="text-5xl font-bold text-primary">
                      {status.pendingDiscount.discount_percent}%
                    </span>
                    <p className="text-muted-foreground mt-1">скидка на заказ</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Timer className="w-4 h-4" />
                    Осталось: {formatTimeLeft(status.pendingDiscount.expires_at)}
                  </div>
                  <Button onClick={handleActivate} className="w-full" size="lg">
                    <Zap className="w-4 h-4 mr-2" />
                    Активировать скидку
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Active Discount */}
            {user && status?.activeDiscount && (
              <Card className="border-green-500 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    Активная скидка
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-green-600">
                      {status.activeDiscount.discount_percent}%
                    </span>
                    <p className="text-muted-foreground mt-1">
                      Будет применена к следующему заказу
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                      <Timer className="w-4 h-4" />
                      Действует: {formatTimeLeft(status.activeDiscount.expires_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Правила акции
                </CardTitle>
                <CardDescription>
                  Ознакомьтесь с условиями участия
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Только для зарегистрированных</p>
                    <p className="text-sm text-muted-foreground">
                      Войдите в аккаунт или создайте новый для участия
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Одна попытка в неделю</p>
                    <p className="text-sm text-muted-foreground">
                      Крутить колесо можно раз в 7 дней
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">24 часа на активацию</p>
                    <p className="text-sm text-muted-foreground">
                      Активируйте скидку в течение суток после выигрыша
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Один заказ — одна скидка</p>
                    <p className="text-sm text-muted-foreground">
                      Скидка применяется к одному заказу и не суммируется
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <div>
                    <p className="font-medium">Скидка до 5%</p>
                    <p className="text-sm text-muted-foreground">
                      Выигрыш от 0% до 5% определяется случайным образом
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Probabilities */}
            <Card>
              <CardHeader>
                <CardTitle>Шансы на выигрыш</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { percent: 5, chance: "5%", color: "bg-red-500" },
                    { percent: 4, chance: "8%", color: "bg-orange-500" },
                    { percent: 3, chance: "12%", color: "bg-amber-500" },
                    { percent: 2, chance: "20%", color: "bg-yellow-500" },
                    { percent: 1, chance: "25%", color: "bg-lime-500" },
                    { percent: 0, chance: "30%", color: "bg-gray-400" },
                  ].map((item) => (
                    <div key={item.percent} className="flex items-center gap-3">
                      <div className={`w-10 h-6 rounded ${item.color} flex items-center justify-center text-white text-xs font-bold`}>
                        {item.percent}%
                      </div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: item.chance }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10">
                        {item.chance}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
