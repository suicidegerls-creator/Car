"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Sparkles, ArrowRight, Percent } from "lucide-react"

export function WheelPromoBanner() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative">
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
          {/* Decorative wheel in background */}
          <div className="absolute -right-20 -top-20 w-64 h-64 md:w-80 md:h-80 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <line
                  key={angle}
                  x1="50"
                  y1="50"
                  x2={50 + 45 * Math.cos((angle * Math.PI) / 180)}
                  y2={50 + 45 * Math.sin((angle * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary"
                />
              ))}
            </svg>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="relative z-10">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Gift className="w-3.5 h-3.5 mr-1.5" />
                Акция для клиентов
              </Badge>
              
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Крутите <span className="text-primary">Колесо Удачи</span>
                <br />и выигрывайте скидки!
              </h2>
              
              <p className="text-muted-foreground mb-6 text-lg">
                Испытайте удачу и получите скидку до <span className="font-bold text-primary">5%</span> на любой заказ. 
                Доступно раз в неделю для зарегистрированных пользователей.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span>Бесплатно</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Percent className="w-4 h-4 text-primary" />
                  </div>
                  <span>До 5% скидки</span>
                </div>
              </div>
              
              <Link href="/wheel">
                <Button size="lg" className="group shadow-lg hover:shadow-xl transition-all">
                  Крутить колесо
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {/* Visual */}
            <div className="relative flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* Animated wheel preview */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-800" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400" />
                <div className="absolute inset-6 rounded-full overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const angle = i * 60 - 90
                      const startRad = (angle * Math.PI) / 180
                      const endRad = ((angle + 60) * Math.PI) / 180
                      const x1 = 50 + 50 * Math.cos(startRad)
                      const y1 = 50 + 50 * Math.sin(startRad)
                      const x2 = 50 + 50 * Math.cos(endRad)
                      const y2 = 50 + 50 * Math.sin(endRad)
                      const colors = [
                        "hsl(var(--muted))",
                        "hsl(45, 80%, 65%)",
                        "hsl(35, 75%, 55%)",
                        "hsl(25, 80%, 50%)",
                        "hsl(15, 85%, 50%)",
                        "hsl(5, 90%, 45%)"
                      ]
                      return (
                        <path
                          key={i}
                          d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                          fill={colors[i]}
                        />
                      )
                    })}
                  </svg>
                </div>
                {/* Center hub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-300 shadow-lg flex items-center justify-center">
                    <span className="text-lg md:text-xl font-bold text-zinc-700">%</span>
                  </div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce">
                  5%
                </div>
                <div className="absolute -bottom-2 -left-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Бесплатно!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
