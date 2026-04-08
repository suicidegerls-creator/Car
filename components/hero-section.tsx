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
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary via-background to-background" />

      {/* 3D Wheel - центральный фон с параллаксом */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ 
          transform: `translateY(${wheelParallax}px)`,
          willChange: 'transform'
        }}
      >
        <div className="w-[120vw] h-[120vw] sm:w-[90vw] sm:h-[90vw] md:w-[80vw] md:h-[80vw] lg:w-[70vw] lg:h-[70vw] max-w-[900px] max-h-[900px] opacity-30 sm:opacity-40 lg:opacity-50">
          <Wheel3D />
        </div>
      </div>

      {/* Затемнение для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />

      {/* Основной контент с параллаксом */}
      <div 
        className="relative flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24"
        style={{ 
          transform: `translateY(${textParallax}px)`,
          willChange: 'transform'
        }}
      >
        {/* Верхний текст */}
        <div className="text-center mb-8 lg:mb-12">
          <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.4em] uppercase mb-4 lg:mb-6">
            Премиальные диски
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-foreground leading-tight">
            Совершенство
          </h1>
        </div>

        {/* Центральная область - пространство для колеса */}
        <div className="flex-1 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]" />

        {/* Нижний текст */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-muted-foreground mb-6 lg:mb-8">
            в деталях
          </h2>
          
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-lg mx-auto leading-relaxed mb-8">
            Откройте коллекцию эксклюзивных литых и кованых дисков от ведущих мировых производителей
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 lg:mb-16">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
              <Link href="/catalog">
                Каталог дисков
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-xs tracking-widest uppercase">Прокрутите</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  )
}
