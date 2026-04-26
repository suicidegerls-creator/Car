"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        
        {/* 4 - Wheel - 4 composition */}
        <div className={`flex items-center justify-center gap-2 sm:gap-4 mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Left "4" */}
          <span className="text-[80px] sm:text-[120px] md:text-[160px] font-black text-foreground leading-none select-none drop-shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            4
          </span>
          
          {/* Flat tire wheel as "0" */}
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 flex-shrink-0">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                {/* Gradients */}
                <linearGradient id="rimGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#444" />
                  <stop offset="50%" stopColor="#333" />
                  <stop offset="100%" stopColor="#222" />
                </linearGradient>
                <linearGradient id="tireGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2a2a2a" />
                  <stop offset="100%" stopColor="#1a1a1a" />
                </linearGradient>
                <linearGradient id="hubGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#666" />
                  <stop offset="50%" stopColor="#444" />
                  <stop offset="100%" stopColor="#333" />
                </linearGradient>
                {/* Shadow filter */}
                <filter id="shadow404" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.4" />
                </filter>
              </defs>

              <g filter="url(#shadow404)">
                {/* Outer tire - flat at bottom */}
                <path 
                  d="M 25 100 
                     C 25 50, 50 20, 100 20 
                     C 150 20, 175 50, 175 100 
                     C 175 145, 155 172, 100 178
                     C 45 172, 25 145, 25 100"
                  fill="url(#tireGradient404)"
                />
                
                {/* Tire tread pattern */}
                <path 
                  d="M 32 100 
                     C 32 55, 55 28, 100 28 
                     C 145 28, 168 55, 168 100 
                     C 168 140, 150 165, 100 170
                     C 50 165, 32 140, 32 100"
                  fill="none"
                  stroke="#333"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                />

                {/* Rim */}
                <ellipse cx="100" cy="100" rx="58" ry="58" fill="url(#rimGradient404)" />
                
                {/* Inner rim detail */}
                <ellipse cx="100" cy="100" rx="50" ry="50" fill="none" stroke="#555" strokeWidth="2" />

                {/* Spokes - 5 spoke design */}
                <path d="M100 100 L100 50 L85 55 L100 100 L115 55 L100 50" fill="#555" />
                <path d="M100 100 L147 77 L140 63 L100 100 L152 90 L147 77" fill="#555" />
                <path d="M100 100 L135 140 L148 130 L100 100 L140 150 L135 140" fill="#555" />
                <path d="M100 100 L65 140 L52 130 L100 100 L60 150 L65 140" fill="#555" />
                <path d="M100 100 L53 77 L60 63 L100 100 L48 90 L53 77" fill="#555" />

                {/* Center hub */}
                <circle cx="100" cy="100" r="24" fill="url(#hubGradient404)" />
                <circle cx="100" cy="100" r="20" fill="none" stroke="#555" strokeWidth="1" />
                
                {/* Center cap */}
                <circle cx="100" cy="100" r="14" fill="#3a3a3a" />
                <circle cx="100" cy="100" r="10" fill="#2a2a2a" />
                
                {/* Lug nuts */}
                <circle cx="100" cy="84" r="3" fill="#555" />
                <circle cx="115" cy="95" r="3" fill="#555" />
                <circle cx="110" cy="112" r="3" fill="#555" />
                <circle cx="90" cy="112" r="3" fill="#555" />
                <circle cx="85" cy="95" r="3" fill="#555" />

                {/* Air escaping animation */}
                <g className="animate-pulse">
                  <circle cx="42" cy="155" r="4" fill="hsl(var(--muted-foreground) / 0.4)" />
                  <circle cx="32" cy="162" r="3" fill="hsl(var(--muted-foreground) / 0.3)" />
                  <circle cx="50" cy="165" r="3" fill="hsl(var(--muted-foreground) / 0.3)" />
                </g>
              </g>
            </svg>
          </div>
          
          {/* Right "4" */}
          <span className="text-[80px] sm:text-[120px] md:text-[160px] font-black text-foreground leading-none select-none drop-shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            4
          </span>
        </div>

        {/* Title */}
        <h2 className={`text-2xl md:text-3xl font-bold text-foreground mb-3 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Упс! Колесо спустило...
        </h2>

        {/* Description */}
        <p className={`text-muted-foreground mb-8 text-lg transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Страница укатилась в неизвестном направлении. 
          <br className="hidden sm:block" />
          Но мы поможем вам вернуться на трассу!
        </p>

        {/* Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
              <Home className="w-5 h-5" />
              На главную
            </Button>
          </Link>
          <Link href="/catalog">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base">
              <Search className="w-5 h-5" />
              В каталог
            </Button>
          </Link>
        </div>

        {/* Fun fact */}
        <p className={`mt-12 text-sm text-muted-foreground/60 transition-all duration-700 delay-1200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          Знаете ли вы? В нашем каталоге более 500 моделей дисков!
        </p>
      </div>
    </div>
  )
}
