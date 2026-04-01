"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
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
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary via-background to-background" />

      <div className="relative flex-1 flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-0">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left py-12 lg:py-0 z-10">
          <p className="text-muted-foreground text-sm sm:text-base tracking-[0.3em] uppercase mb-4">
            Премиальные диски
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
            Совершенство
            <br />
            <span className="text-muted-foreground">в деталях</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
            Откройте коллекцию эксклюзивных литых и кованых дисков от ведущих мировых производителей
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
              <Link href="/catalog">
                Каталог дисков
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">500+</p>
              <p className="text-muted-foreground text-sm">Моделей</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">50+</p>
              <p className="text-muted-foreground text-sm">Брендов</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">10K+</p>
              <p className="text-muted-foreground text-sm">Клиентов</p>
            </div>
          </div>
        </div>

        {/* 3D Wheel */}
        <div className="flex-1 w-full h-[400px] sm:h-[500px] lg:h-[600px] relative">
          <Wheel3D />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-xs tracking-widest uppercase">Прокрутите вниз</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  )
}
