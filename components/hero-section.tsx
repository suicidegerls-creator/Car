"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState([false, false, false])

  useEffect(() => {
    setMounted(true)
    const timers = [
      setTimeout(() => setVisible(v => [true, v[1], v[2]]), 500),
      setTimeout(() => setVisible(v => [v[0], true, v[2]]), 3000),
      setTimeout(() => setVisible(v => [v[0], v[1], true]), 5500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Для SSR возвращаем начальное состояние без анимаций
  const isVisible = mounted ? visible : [false, false, false]

  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Контент */}
      <div className="relative flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        
        {/* Заголовок */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.35em] uppercase mb-4 sm:mb-6 font-medium">
            Премиальные диски
          </p>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-5 sm:mb-7">
            <span className="text-foreground">Совершенство</span>
            <br />
            <span className="text-primary">в деталях</span>
          </h1>
          
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-lg mx-auto leading-relaxed">
            Откройте коллекцию эксклюзивных литых и кованых дисков от ведущих мировых производителей
          </p>
        </div>

        {/* Диски и кнопка */}
        <div className="flex flex-col items-center w-full max-w-5xl" suppressHydrationWarning>
          
          {/* Верхний ряд - 2 диска по бокам на мобильном */}
          <div className="flex flex-row items-center justify-center gap-8 sm:gap-8 lg:gap-12 mb-6 sm:mb-8">
            
            {/* Диск 1 - слева */}
            <div 
              className={`transition-all duration-1000 ease-out ${
                isVisible[0] 
                  ? 'opacity-100 translate-x-0 rotate-0' 
                  : 'opacity-0 -translate-x-12 -rotate-12'
              }`}
            >
              <div className="w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 hover:scale-110 transition-transform duration-300 drop-shadow-2xl relative">
                <Image
                  src="/images/hero-wheel-1.png"
                  alt="Литой диск премиум класса"
                  fill
                  className="object-contain mix-blend-multiply dark:mix-blend-lighten"
                  priority
                />
              </div>
            </div>

            {/* Кнопка - по центру на десктопе, скрыта на мобильном в этом месте */}
            <div className={`hidden sm:block transition-all duration-700 delay-300 ${
              isVisible[0] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <Link href="/catalog">
                <Button 
                  size="lg" 
                  className="group relative px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-bold rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    Каталог
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Диск 2 - справа */}
            <div 
              className={`transition-all duration-1000 ease-out ${
                isVisible[1] 
                  ? 'opacity-100 translate-x-0 rotate-0' 
                  : 'opacity-0 translate-x-12 rotate-12'
              }`}
            >
              <div className="w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 hover:scale-110 transition-transform duration-300 drop-shadow-2xl relative">
                <Image
                  src="/images/hero-wheel-2.png"
                  alt="Спортивный литой диск"
                  fill
                  className="object-contain mix-blend-multiply dark:mix-blend-lighten"
                />
              </div>
            </div>
          </div>

          {/* Кнопка - показывается только на мобильном */}
          <div className={`sm:hidden mb-6 transition-all duration-700 delay-300 ${
            isVisible[0] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}>
            <Link href="/catalog">
              <Button 
                size="lg" 
                className="group relative px-8 py-6 text-base font-bold rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Каталог
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Диск 3 снизу по центру */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              isVisible[2] 
                ? 'opacity-100 translate-y-0 rotate-0' 
                : 'opacity-0 translate-y-12 rotate-6'
            }`}
          >
            <div className="w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 hover:scale-110 transition-transform duration-300 drop-shadow-2xl relative">
              <Image
                src="/images/hero-wheel-3.png"
                alt="Премиальный кованый диск"
                fill
                className="object-contain mix-blend-multiply dark:mix-blend-lighten"
              />
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-6 sm:gap-10 text-center">
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">500+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Моделей</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">50+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Брендов</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">10K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Клиентов</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">Прокрутите</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  )
}
