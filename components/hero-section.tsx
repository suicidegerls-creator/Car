"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer1 = setTimeout(() => setContentVisible(true), 300)
    return () => {
      clearTimeout(timer1)
    }
  }, [])

  const isContentVisible = mounted ? contentVisible : false

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Основной контент */}
      <div className="relative flex-1 flex flex-col w-full px-6 sm:px-8 md:px-12 lg:px-16 pt-24 md:pt-28 pb-20">
        
        {/* ДЕСКТОП ВЕРСИЯ - Полноэкранная машина */}
        <div className="hidden md:block absolute inset-0">
          
          {/* Машина как фон на весь экран */}
          <div className={`absolute inset-0 transition-all duration-1000 ease-out delay-300 ${
            isContentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}>
            <Image
              src="https://ibnoxxcnwq9eia7i.public.blob.vercel-storage.com/images/1000066017.png"
              alt="Спортивный автомобиль с премиальными литыми дисками"
              fill
              className="object-cover object-right mix-blend-screen"
              priority
              sizes="100vw"
            />
          </div>
          
          {/* Градиент слева для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent w-[60%]" />
          
          {/* Контент слева */}
          <div className="absolute inset-0 flex items-center">
            <div className={`max-w-xl ml-8 lg:ml-16 xl:ml-24 transition-all duration-1000 ease-out ${
              isContentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.35em] uppercase mb-4 font-medium">
                Премиальные диски в Минске
              </p>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6">
                <span className="text-foreground">Совершенство</span>
                <br />
                <span className="text-primary">в деталях</span>
              </h1>
              
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8">
                Откройте коллекцию эксклюзивных литых и кованых дисков от ведущих мировых производителей. Бесплатная примерка на ваш автомобиль.
              </p>
              
              {/* Кнопки */}
              <div className="flex flex-row gap-4 mb-10">
                <Link href="/catalog">
                  <Button 
                    size="lg" 
                    className="group relative px-10 py-7 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Каталог
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link href="/ar-fitting">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-8 py-7 text-base font-semibold rounded-full border-2 bg-background/60 backdrop-blur-sm hover:bg-secondary transition-all duration-300"
                  >
                    Примерка дисков
                  </Button>
                </Link>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-3 gap-10">
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground mt-1">Моделей дисков</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">50+</div>
                  <div className="text-sm text-muted-foreground mt-1">Брендов</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">10K+</div>
                  <div className="text-sm text-muted-foreground mt-1">Довольных клиентов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Пустой контейнер для сохранения высоты на десктопе */}
        <div className="hidden md:block flex-1" />

        {/* МОБИЛЬНАЯ ВЕРСИЯ */}
        <div className="flex md:hidden flex-col">
          
          {/* Текст */}
          <div className={`text-center z-10 transition-all duration-1000 ease-out ${
            isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.35em] uppercase mb-2 font-medium">
              Премиальные диски в Минске
            </p>
            
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] mb-2">
              <span className="text-foreground">Совершенство</span>
              <br />
              <span className="text-primary">в деталях</span>
            </h1>
            
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Откройте коллекцию эксклюзивных литых и кованых дисков от ведущих мировых производителей. Бесплатная примерка на ваш автомобиль.
            </p>
          </div>

          {/* Изображение автомобиля */}
          <div className={`relative -mt-2 -mx-4 sm:-mx-6 transition-all duration-1000 ease-out delay-300 ${
            isContentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}>
            <div className="relative w-full h-[220px] sm:h-[280px] overflow-visible">
              {/* Градиентные маски для плавного перехода */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
              </div>
              <Image
                src="https://ibnoxxcnwq9eia7i.public.blob.vercel-storage.com/images/1000066017.png"
                alt="Спортивный автомобиль с премиальными литыми дисками"
                fill
                className="object-cover object-center mix-blend-screen"
                priority
                sizes="100vw"
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className={`flex flex-col sm:flex-row gap-3 justify-center mt-0 transition-all duration-700 delay-400 ${
            isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Link href="/catalog" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="group relative px-8 py-6 text-base font-bold rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 w-full"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Каталог
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/ar-fitting" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-base font-semibold rounded-full border-2 hover:bg-secondary transition-all duration-300 w-full"
              >
                Примерка дисков
              </Button>
            </Link>
          </div>

          {/* Статистика */}
          <div className={`grid grid-cols-3 gap-6 mt-8 text-center w-full transition-all duration-700 delay-500 ${
            isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Моделей</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">50+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Брендов</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Клиентов</div>
            </div>
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
