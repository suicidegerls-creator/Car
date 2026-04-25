"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"

const Wheel3D = dynamic(() => import("@/components/wheel-3d").then(mod => ({ default: mod.Wheel3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  ),
})

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        if (rect.bottom > 0) {
          setScrollY(window.scrollY)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Параллакс - диск движется медленнее
  const wheelParallax = scrollY * 0.3
  const textParallax = scrollY * 0.1

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary via-background to-background" />

      {/* 3D Wheel - полноэкранный фон без обрезки */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ 
          transform: `translateY(${wheelParallax}px)`,
          willChange: 'transform'
        }}
      >
        {/* Контейнер колеса с фиксированным размером относительно меньшей стороны экрана */}
        <div 
          className="opacity-20 sm:opacity-30 lg:opacity-40"
          style={{
            width: 'min(90vh, 90vw)',
            height: 'min(90vh, 90vw)',
          }}
        >
          <Wheel3D />
        </div>
      </div>

      {/* Затемнение для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />

      {/* Основной контент с параллаксом */}
      <div 
        className="relative flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32"
        style={{ 
          transform: `translateY(${textParallax}px)`,
          willChange: 'transform'
        }}
      >
        <div className="text-center">
          {/* Подзаголовок */}
          <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8">
            Премиальные диски
          </p>
          
          {/* Главный заголовок */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-tight mb-2 sm:mb-3">
            <span className="text-foreground">Совершенство</span>
            <br />
            <span className="text-primary">в деталях</span>
          </h1>
          
          {/* Описание */}
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-lg mx-auto leading-relaxed mt-6 sm:mt-8 mb-8 sm:mb-10">
            Откройте коллекцию эксклюзивных литых и кованых дисков от ведущих мировых производителей
          </p>

          {/* Кнопка */}
          <div className="flex justify-center mb-10 sm:mb-14">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 shadow-lg">
              <Link href="/catalog">
                Каталог дисков
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-md mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">500+</p>
              <p className="text-muted-foreground text-xs sm:text-sm">Моделей</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">50+</p>
              <p className="text-muted-foreground text-xs sm:text-sm">Брендов</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">10K+</p>
              <p className="text-muted-foreground text-xs sm:text-sm">Клиентов</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/70 animate-bounce">
        <span className="text-[10px] sm:text-xs tracking-widest uppercase">Прокрутите</span>
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </section>
  )
}
