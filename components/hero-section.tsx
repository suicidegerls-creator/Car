"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"

// Локальные пути к изображениям дисков
const WHEEL_IMAGES = {
  wheel1: "/images/wheels/wheel-1.png",
  wheel2: "/images/wheels/wheel-2.png",
  wheel3: "/images/wheels/wheel-3.png",
}

export function HeroSection() {
  const [visible, setVisible] = useState([false, false, false])

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisible(v => [true, v[1], v[2]]), 500),
      setTimeout(() => setVisible(v => [v[0], true, v[2]]), 3000),
      setTimeout(() => setVisible(v => [v[0], v[1], true]), 5500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

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
        <div className="flex flex-col items-center w-full max-w-5xl">
          
          {/* Верхний ряд */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8">
            
            {/* Диск 1 */}
            <div 
              className={`transition-all duration-1000 ease-out ${
                visible[0] 
                  ? 'opacity-100 translate-x-0 rotate-0' 
                  : 'opacity-0 -translate-x-12 -rotate-12'
              }`}
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
                <Image 
                  src={WHEEL_IMAGES.wheel1} 
                  alt="Премиальный диск" 
                  width={176} 
                  height={176} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Кнопка */}
            <div className={`transition-all duration-700 delay-300 ${
              visible[0] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <Link href="/catalog">
                <Button 
                  size="lg" 
                  className="group relative px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-bold rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    Каталог дисков
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Диск 2 */}
            <div 
              className={`transition-all duration-1000 ease-out ${
                visible[1] 
                  ? 'opacity-100 translate-x-0 rotate-0' 
                  : 'opacity-0 translate-x-12 rotate-12'
              }`}
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
                <Image 
                  src={WHEEL_IMAGES.wheel2} 
                  alt="Спортивный диск" 
                  width={176} 
                  height={176} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Диск 3 снизу */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              visible[2] 
                ? 'opacity-100 translate-y-0 rotate-0' 
                : 'opacity-0 translate-y-12 rotate-6'
            }`}
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
              <Image 
                src={WHEEL_IMAGES.wheel3} 
                alt="Премиум диск" 
                width={192} 
                height={192} 
                className="w-full h-full object-contain"
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
