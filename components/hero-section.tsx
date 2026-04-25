"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"

// Реалистичный диск 1 - Классический 5-спицевый
function PremiumWheel1({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        {/* Градиент для обода */}
        <linearGradient id="rimGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B8B8B" />
          <stop offset="30%" stopColor="#C0C0C0" />
          <stop offset="50%" stopColor="#E8E8E8" />
          <stop offset="70%" stopColor="#A0A0A0" />
          <stop offset="100%" stopColor="#707070" />
        </linearGradient>
        {/* Градиент для спиц */}
        <linearGradient id="spokeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8A8A8" />
          <stop offset="50%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#888888" />
        </linearGradient>
        {/* Градиент центра */}
        <radialGradient id="centerGradient1" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#F0F0F0" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#606060" />
        </radialGradient>
        {/* Тень */}
        <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
      </defs>
      
      <g filter="url(#shadow1)">
        {/* Шина */}
        <circle cx="100" cy="100" r="98" fill="#1a1a1a" />
        <circle cx="100" cy="100" r="96" fill="#2d2d2d" />
        <circle cx="100" cy="100" r="94" stroke="#3d3d3d" strokeWidth="1" fill="none" />
        
        {/* Внешний обод */}
        <circle cx="100" cy="100" r="85" fill="url(#rimGradient1)" />
        <circle cx="100" cy="100" r="83" stroke="#999" strokeWidth="1" fill="none" />
        <circle cx="100" cy="100" r="78" fill="#1a1a1a" />
        
        {/* 5 спиц */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180
          const rad2 = (angle - 90 + 15) * Math.PI / 180
          const rad3 = (angle - 90 - 15) * Math.PI / 180
          return (
            <path
              key={i}
              d={`
                M ${100 + 22 * Math.cos(rad3)} ${100 + 22 * Math.sin(rad3)}
                L ${100 + 75 * Math.cos(rad3 + 0.08)} ${100 + 75 * Math.sin(rad3 + 0.08)}
                A 75 75 0 0 1 ${100 + 75 * Math.cos(rad2 - 0.08)} ${100 + 75 * Math.sin(rad2 - 0.08)}
                L ${100 + 22 * Math.cos(rad2)} ${100 + 22 * Math.sin(rad2)}
                Z
              `}
              fill="url(#spokeGradient1)"
              stroke="#666"
              strokeWidth="0.5"
            />
          )
        })}
        
        {/* Центральная часть */}
        <circle cx="100" cy="100" r="24" fill="url(#centerGradient1)" />
        <circle cx="100" cy="100" r="22" stroke="#888" strokeWidth="1" fill="none" />
        
        {/* Болты */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180
          return (
            <g key={`bolt-${i}`}>
              <circle 
                cx={100 + 15 * Math.cos(rad)} 
                cy={100 + 15 * Math.sin(rad)} 
                r="4" 
                fill="#888"
              />
              <circle 
                cx={100 + 15 * Math.cos(rad) - 1} 
                cy={100 + 15 * Math.sin(rad) - 1} 
                r="2" 
                fill="#bbb"
              />
            </g>
          )
        })}
        
        {/* Центральный колпачок */}
        <circle cx="100" cy="100" r="10" fill="#333" />
        <circle cx="98" cy="98" r="4" fill="#555" />
      </g>
    </svg>
  )
}

// Реалистичный диск 2 - Многоспицевый спортивный
function PremiumWheel2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        <linearGradient id="rimGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#707070" />
          <stop offset="40%" stopColor="#B8B8B8" />
          <stop offset="60%" stopColor="#D0D0D0" />
          <stop offset="100%" stopColor="#606060" />
        </linearGradient>
        <linearGradient id="spokeGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C8C8C8" />
          <stop offset="50%" stopColor="#F0F0F0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
        <radialGradient id="centerGradient2" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="60%" stopColor="#A0A0A0" />
          <stop offset="100%" stopColor="#505050" />
        </radialGradient>
        <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="5" stdDeviation="5" floodOpacity="0.35" />
        </filter>
      </defs>
      
      <g filter="url(#shadow2)">
        {/* Шина */}
        <circle cx="100" cy="100" r="98" fill="#151515" />
        <circle cx="100" cy="100" r="95" fill="#252525" />
        
        {/* Обод */}
        <circle cx="100" cy="100" r="86" fill="url(#rimGradient2)" />
        <circle cx="100" cy="100" r="84" stroke="#aaa" strokeWidth="0.5" fill="none" />
        <circle cx="100" cy="100" r="76" fill="#181818" />
        
        {/* 10 тонких спиц */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = i * 36 - 90
          const rad = angle * Math.PI / 180
          const rad1 = (angle - 6) * Math.PI / 180
          const rad2 = (angle + 6) * Math.PI / 180
          return (
            <path
              key={i}
              d={`
                M ${100 + 20 * Math.cos(rad1)} ${100 + 20 * Math.sin(rad1)}
                L ${100 + 73 * Math.cos(rad1 + 0.02)} ${100 + 73 * Math.sin(rad1 + 0.02)}
                L ${100 + 73 * Math.cos(rad2 - 0.02)} ${100 + 73 * Math.sin(rad2 - 0.02)}
                L ${100 + 20 * Math.cos(rad2)} ${100 + 20 * Math.sin(rad2)}
                Z
              `}
              fill="url(#spokeGradient2)"
              stroke="#777"
              strokeWidth="0.3"
            />
          )
        })}
        
        {/* Внутреннее кольцо */}
        <circle cx="100" cy="100" r="20" fill="url(#centerGradient2)" />
        <circle cx="100" cy="100" r="18" stroke="#999" strokeWidth="1" fill="none" />
        
        {/* Болты */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180
          return (
            <circle 
              key={`bolt-${i}`}
              cx={100 + 12 * Math.cos(rad)} 
              cy={100 + 12 * Math.sin(rad)} 
              r="3" 
              fill="#666"
              stroke="#888"
              strokeWidth="0.5"
            />
          )
        })}
        
        {/* Лого центр */}
        <circle cx="100" cy="100" r="8" fill="#2a2a2a" />
        <circle cx="98" cy="98" r="3" fill="#444" />
      </g>
    </svg>
  )
}

// Реалистичный диск 3 - Кованый премиум
function PremiumWheel3({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        <linearGradient id="rimGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="25%" stopColor="#8a8a8a" />
          <stop offset="50%" stopColor="#b0b0b0" />
          <stop offset="75%" stopColor="#7a7a7a" />
          <stop offset="100%" stopColor="#3a3a3a" />
        </linearGradient>
        <linearGradient id="spokeGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9a9a9a" />
          <stop offset="30%" stopColor="#d8d8d8" />
          <stop offset="70%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#808080" />
        </linearGradient>
        <radialGradient id="centerGradient3" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#d0d0d0" />
          <stop offset="50%" stopColor="#909090" />
          <stop offset="100%" stopColor="#404040" />
        </radialGradient>
        <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodOpacity="0.4" />
        </filter>
        <filter id="innerShadow3">
          <feOffset dx="1" dy="1" />
          <feGaussianBlur stdDeviation="1" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="black" floodOpacity="0.2" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>
      
      <g filter="url(#shadow3)">
        {/* Шина */}
        <circle cx="100" cy="100" r="98" fill="#0f0f0f" />
        <circle cx="100" cy="100" r="96" fill="#1f1f1f" />
        <circle cx="100" cy="100" r="93" stroke="#333" strokeWidth="0.5" fill="none" />
        
        {/* Обод с канавкой */}
        <circle cx="100" cy="100" r="87" fill="url(#rimGradient3)" />
        <circle cx="100" cy="100" r="85" stroke="#666" strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="100" r="82" stroke="#444" strokeWidth="0.5" fill="none" />
        <circle cx="100" cy="100" r="79" fill="#111" />
        
        {/* 6 широких Y-образных спиц */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = i * 60 - 90
          const rad = angle * Math.PI / 180
          const rad1 = (angle - 12) * Math.PI / 180
          const rad2 = (angle + 12) * Math.PI / 180
          const rad3 = (angle - 5) * Math.PI / 180
          const rad4 = (angle + 5) * Math.PI / 180
          return (
            <g key={i} filter="url(#innerShadow3)">
              <path
                d={`
                  M ${100 + 25 * Math.cos(rad3)} ${100 + 25 * Math.sin(rad3)}
                  L ${100 + 50 * Math.cos(rad1)} ${100 + 50 * Math.sin(rad1)}
                  L ${100 + 76 * Math.cos(rad1 + 0.05)} ${100 + 76 * Math.sin(rad1 + 0.05)}
                  A 76 76 0 0 1 ${100 + 76 * Math.cos(rad2 - 0.05)} ${100 + 76 * Math.sin(rad2 - 0.05)}
                  L ${100 + 50 * Math.cos(rad2)} ${100 + 50 * Math.sin(rad2)}
                  L ${100 + 25 * Math.cos(rad4)} ${100 + 25 * Math.sin(rad4)}
                  Z
                `}
                fill="url(#spokeGradient3)"
                stroke="#555"
                strokeWidth="0.5"
              />
            </g>
          )
        })}
        
        {/* Центральная часть */}
        <circle cx="100" cy="100" r="26" fill="url(#centerGradient3)" />
        <circle cx="100" cy="100" r="24" stroke="#777" strokeWidth="1" fill="none" />
        <circle cx="100" cy="100" r="20" stroke="#555" strokeWidth="0.5" fill="none" />
        
        {/* Болты */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180
          return (
            <g key={`bolt-${i}`}>
              <circle 
                cx={100 + 15 * Math.cos(rad)} 
                cy={100 + 15 * Math.sin(rad)} 
                r="4.5" 
                fill="#555"
              />
              <circle 
                cx={100 + 15 * Math.cos(rad) - 1} 
                cy={100 + 15 * Math.sin(rad) - 1} 
                r="2" 
                fill="#888"
              />
            </g>
          )
        })}
        
        {/* Центральный колпачок с логотипом */}
        <circle cx="100" cy="100" r="12" fill="#222" />
        <circle cx="100" cy="100" r="10" stroke="#444" strokeWidth="0.5" fill="none" />
        <circle cx="97" cy="97" r="4" fill="#3a3a3a" />
      </g>
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
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,transparent_0%,transparent_49%,hsl(var(--border)/0.1)_50%,transparent_51%,transparent_100%)]" />
      
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
          
          {/* Верхний ряд: 2 диска + кнопка */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8">
            
            {/* Диск 1 */}
            <div 
              className={`transition-all duration-1000 ease-out ${
                visible[0] 
                  ? 'opacity-100 translate-x-0 rotate-0' 
                  : 'opacity-0 -translate-x-16 -rotate-12'
              }`}
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-52 lg:h-52 hover:scale-105 hover:rotate-6 transition-all duration-500 cursor-pointer">
                <PremiumWheel1 className="w-full h-full" />
              </div>
            </div>

            {/* Кнопка каталога */}
            <div 
              className={`transition-all duration-1000 ease-out delay-200 ${
                visible[1] 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-75'
              }`}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 sm:px-14 py-7 sm:py-8 text-lg sm:text-xl font-bold shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-110 transition-all duration-300 rounded-full border-2 border-primary-foreground/10"
              >
                <Link href="/catalog">
                  Каталог дисков
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
            </div>

            {/* Диск 2 */}
            <div 
              className={`transition-all duration-1000 ease-out ${
                visible[1] 
                  ? 'opacity-100 translate-x-0 rotate-0' 
                  : 'opacity-0 translate-x-16 rotate-12'
              }`}
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-52 lg:h-52 hover:scale-105 hover:-rotate-6 transition-all duration-500 cursor-pointer">
                <PremiumWheel2 className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Диск 3 - снизу по центру */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              visible[2] 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-12 scale-75'
            }`}
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 hover:scale-105 transition-all duration-500 cursor-pointer">
              <PremiumWheel3 className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-10 sm:gap-20 max-w-xl mx-auto mt-12 sm:mt-16">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">500+</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">Моделей</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">50+</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">Брендов</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">10K+</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">Клиентов</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 animate-bounce">
        <span className="text-[10px] sm:text-xs tracking-widest uppercase">Прокрутите</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  )
}
