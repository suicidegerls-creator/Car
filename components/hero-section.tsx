"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"

// Диск 1 - 5 симметричных широких спиц
function PremiumWheel1({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        <linearGradient id="rim1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#888" />
          <stop offset="50%" stopColor="#ddd" />
          <stop offset="100%" stopColor="#666" />
        </linearGradient>
        <linearGradient id="spoke1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bbb" />
          <stop offset="50%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#999" />
        </linearGradient>
        <radialGradient id="center1" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#eee" />
          <stop offset="100%" stopColor="#666" />
        </radialGradient>
      </defs>
      
      {/* Шина */}
      <circle cx="100" cy="100" r="98" fill="#1a1a1a" />
      <circle cx="100" cy="100" r="94" fill="#252525" />
      
      {/* Обод */}
      <circle cx="100" cy="100" r="82" fill="url(#rim1)" />
      <circle cx="100" cy="100" r="78" fill="#1a1a1a" />
      
      {/* 5 спиц - симметричные, каждые 72 градуса */}
      {/* Спица 1: 90° (вверх) */}
      <polygon points="95,75 100,25 105,75 105,35 95,35" fill="url(#spoke1)" />
      {/* Спица 2: 162° */}
      <polygon points="78,82 35,52 83,87 42,62 38,67" fill="url(#spoke1)" />
      {/* Спица 3: 234° */}
      <polygon points="80,112 42,155 85,115 48,148 53,152" fill="url(#spoke1)" />
      {/* Спица 4: 306° */}
      <polygon points="115,115 152,152 120,112 158,148 153,155" fill="url(#spoke1)" />
      {/* Спица 5: 18° */}
      <polygon points="117,87 158,67 122,82 165,52 162,57" fill="url(#spoke1)" />
      
      {/* Центр */}
      <circle cx="100" cy="100" r="28" fill="url(#center1)" />
      <circle cx="100" cy="100" r="24" stroke="#888" strokeWidth="2" fill="none" />
      
      {/* 5 болтов */}
      <circle cx="100" cy="82" r="5" fill="#555" />
      <circle cx="117" cy="89" r="5" fill="#555" />
      <circle cx="111" cy="110" r="5" fill="#555" />
      <circle cx="89" cy="110" r="5" fill="#555" />
      <circle cx="83" cy="89" r="5" fill="#555" />
      
      {/* Колпачок */}
      <circle cx="100" cy="100" r="12" fill="#333" />
      <circle cx="97" cy="97" r="5" fill="#555" />
    </svg>
  )
}

// Диск 2 - 10 тонких спиц спортивный
function PremiumWheel2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        <linearGradient id="rim2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#777" />
          <stop offset="50%" stopColor="#ccc" />
          <stop offset="100%" stopColor="#555" />
        </linearGradient>
        <linearGradient id="spoke2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ccc" />
          <stop offset="50%" stopColor="#fff" />
          <stop offset="100%" stopColor="#aaa" />
        </linearGradient>
        <radialGradient id="center2" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ddd" />
          <stop offset="100%" stopColor="#555" />
        </radialGradient>
      </defs>
      
      {/* Шина */}
      <circle cx="100" cy="100" r="98" fill="#151515" />
      <circle cx="100" cy="100" r="93" fill="#222" />
      
      {/* Обод */}
      <circle cx="100" cy="100" r="84" fill="url(#rim2)" />
      <circle cx="100" cy="100" r="80" fill="#181818" />
      
      {/* 10 тонких спиц - каждые 36 градусов */}
      <line x1="100" y1="78" x2="100" y2="25" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="113" y1="80" x2="147" y2="35" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="120" y1="91" x2="170" y2="70" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="120" y1="109" x2="170" y2="130" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="113" y1="120" x2="147" y2="165" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="122" x2="100" y2="175" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="87" y1="120" x2="53" y2="165" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="109" x2="30" y2="130" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="91" x2="30" y2="70" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      <line x1="87" y1="80" x2="53" y2="35" stroke="url(#spoke2)" strokeWidth="4" strokeLinecap="round" />
      
      {/* Центр */}
      <circle cx="100" cy="100" r="22" fill="url(#center2)" />
      <circle cx="100" cy="100" r="18" stroke="#777" strokeWidth="1.5" fill="none" />
      
      {/* 5 болтов */}
      <circle cx="100" cy="86" r="4" fill="#555" />
      <circle cx="113" cy="91" r="4" fill="#555" />
      <circle cx="108" cy="106" r="4" fill="#555" />
      <circle cx="92" cy="106" r="4" fill="#555" />
      <circle cx="87" cy="91" r="4" fill="#555" />
      
      {/* Колпачок */}
      <circle cx="100" cy="100" r="9" fill="#2a2a2a" />
      <circle cx="98" cy="98" r="3" fill="#444" />
    </svg>
  )
}

// Диск 3 - 6 Y-образных широких спиц премиум
function PremiumWheel3({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        <linearGradient id="rim3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#666" />
          <stop offset="50%" stopColor="#bbb" />
          <stop offset="100%" stopColor="#444" />
        </linearGradient>
        <linearGradient id="spoke3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#aaa" />
          <stop offset="50%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#888" />
        </linearGradient>
        <radialGradient id="center3" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ccc" />
          <stop offset="100%" stopColor="#444" />
        </radialGradient>
      </defs>
      
      {/* Шина */}
      <circle cx="100" cy="100" r="98" fill="#111" />
      <circle cx="100" cy="100" r="94" fill="#1e1e1e" />
      
      {/* Обод */}
      <circle cx="100" cy="100" r="85" fill="url(#rim3)" />
      <circle cx="100" cy="100" r="82" stroke="#555" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="78" fill="#141414" />
      
      {/* 6 широких спиц - каждые 60 градусов */}
      {/* Спица 0° (вправо) */}
      <polygon points="118,95 175,85 175,115 118,105" fill="url(#spoke3)" />
      {/* Спица 60° */}
      <polygon points="109,118 155,160 135,170 104,123" fill="url(#spoke3)" />
      {/* Спица 120° */}
      <polygon points="91,118 65,170 45,160 96,123" fill="url(#spoke3)" />
      {/* Спица 180° (влево) */}
      <polygon points="82,105 25,115 25,85 82,95" fill="url(#spoke3)" />
      {/* Спица 240° */}
      <polygon points="91,82 45,40 65,30 96,77" fill="url(#spoke3)" />
      {/* Спица 300° */}
      <polygon points="109,82 135,30 155,40 104,77" fill="url(#spoke3)" />
      
      {/* Центр */}
      <circle cx="100" cy="100" r="26" fill="url(#center3)" />
      <circle cx="100" cy="100" r="22" stroke="#666" strokeWidth="1.5" fill="none" />
      
      {/* 5 болтов с бликами */}
      <circle cx="100" cy="82" r="5" fill="#444" />
      <circle cx="117" cy="89" r="5" fill="#444" />
      <circle cx="111" cy="109" r="5" fill="#444" />
      <circle cx="89" cy="109" r="5" fill="#444" />
      <circle cx="83" cy="89" r="5" fill="#444" />
      
      <circle cx="99" cy="81" r="2" fill="#777" />
      <circle cx="116" cy="88" r="2" fill="#777" />
      <circle cx="110" cy="108" r="2" fill="#777" />
      <circle cx="88" cy="108" r="2" fill="#777" />
      <circle cx="82" cy="88" r="2" fill="#777" />
      
      {/* Колпачок */}
      <circle cx="100" cy="100" r="12" fill="#222" />
      <circle cx="100" cy="100" r="9" stroke="#444" strokeWidth="0.5" fill="none" />
      <circle cx="97" cy="97" r="4" fill="#333" />
    </svg>
  )
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
                <PremiumWheel1 className="w-full h-full" />
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
                <PremiumWheel2 className="w-full h-full" />
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
              <PremiumWheel3 className="w-full h-full" />
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
