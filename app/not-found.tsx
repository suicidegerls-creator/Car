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

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Flat tire wheel illustration */}
        <div className={`relative w-64 h-64 mx-auto mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              {/* Gradients */}
              <linearGradient id="rimGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="50%" stopColor="hsl(var(--primary) / 0.8)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
              </linearGradient>
              <linearGradient id="tireGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
              <linearGradient id="hubGradient404" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#888" />
                <stop offset="50%" stopColor="#666" />
                <stop offset="100%" stopColor="#444" />
              </linearGradient>
              {/* Shadow filter */}
              <filter id="shadow404" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Shadow on ground */}
            <ellipse cx="100" cy="185" rx="70" ry="10" fill="hsl(var(--foreground) / 0.1)" />

            {/* Flat tire - deformed ellipse at bottom */}
            <g filter="url(#shadow404)">
              {/* Outer tire - flat at bottom */}
              <path 
                d="M 30 100 
                   C 30 55, 55 25, 100 25 
                   C 145 25, 170 55, 170 100 
                   C 170 140, 150 165, 100 170
                   C 50 165, 30 140, 30 100"
                fill="url(#tireGradient404)"
              />
              
              {/* Tire tread pattern */}
              <path 
                d="M 35 100 
                   C 35 60, 57 32, 100 32 
                   C 143 32, 165 60, 165 100 
                   C 165 135, 147 158, 100 163
                   C 53 158, 35 135, 35 100"
                fill="none"
                stroke="#333"
                strokeWidth="2"
                strokeDasharray="8 4"
              />

              {/* Rim */}
              <ellipse cx="100" cy="100" rx="55" ry="55" fill="url(#rimGradient404)" />
              
              {/* Inner rim detail */}
              <ellipse cx="100" cy="100" rx="48" ry="48" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2" />

              {/* Spokes */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const x1 = 100 + 20 * Math.cos(rad)
                const y1 = 100 + 20 * Math.sin(rad)
                const x2 = 100 + 45 * Math.cos(rad)
                const y2 = 100 + 45 * Math.sin(rad)
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(var(--primary) / 0.6)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                )
              })}

              {/* Center hub */}
              <circle cx="100" cy="100" r="22" fill="url(#hubGradient404)" />
              <circle cx="100" cy="100" r="18" fill="none" stroke="#555" strokeWidth="1" />
              
              {/* Center cap */}
              <circle cx="100" cy="100" r="12" fill="#444" />
              <circle cx="100" cy="100" r="8" fill="#333" />
              
              {/* Lug nuts */}
              {[0, 72, 144, 216, 288].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const x = 100 + 15 * Math.cos(rad)
                const y = 100 + 15 * Math.sin(rad)
                return <circle key={i} cx={x} cy={y} r="3" fill="#555" />
              })}

              {/* Air escaping animation */}
              <g className="animate-pulse">
                <circle cx="45" cy="145" r="3" fill="hsl(var(--muted-foreground) / 0.4)" />
                <circle cx="38" cy="150" r="2" fill="hsl(var(--muted-foreground) / 0.3)" />
                <circle cx="50" cy="152" r="2.5" fill="hsl(var(--muted-foreground) / 0.3)" />
              </g>
            </g>
          </svg>
          
          {/* Sad expression overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl opacity-0">
            
          </div>
        </div>

        {/* 404 text */}
        <h1 className={`text-8xl md:text-9xl font-bold text-primary/20 mb-2 transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          404
        </h1>

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
