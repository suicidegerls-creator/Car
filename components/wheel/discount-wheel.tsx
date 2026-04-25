"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

interface DiscountWheelProps {
  onSpinStart: () => Promise<number | null> // Возвращает скидку от API
  onSpinComplete: (discount: number) => void
  disabled?: boolean
  className?: string
}

const SEGMENTS = [
  { value: 0, label: "0%", color: "hsl(var(--muted))" },
  { value: 1, label: "1%", color: "hsl(45, 80%, 65%)" },
  { value: 2, label: "2%", color: "hsl(35, 75%, 55%)" },
  { value: 3, label: "3%", color: "hsl(25, 80%, 50%)" },
  { value: 4, label: "4%", color: "hsl(15, 85%, 50%)" },
  { value: 5, label: "5%", color: "hsl(5, 90%, 45%)" },
]

export function DiscountWheel({ onSpinStart, onSpinComplete, disabled, className }: DiscountWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const spinWheel = async () => {
    if (isSpinning || disabled) return

    setIsSpinning(true)

    // Получаем результат от API ДО анимации
    const discount = await onSpinStart()
    
    if (discount === null) {
      setIsSpinning(false)
      return
    }

    // Находим индекс сегмента для выигранной скидки
    const selectedIndex = SEGMENTS.findIndex(s => s.value === discount)
    
    const segmentAngle = 360 / SEGMENTS.length // 60 градусов на сегмент
    
    // Текущая позиция колеса (нормализованная к 0-360)
    const currentRotation = rotation % 360
    
    // Центр нужного сегмента (сегмент 0 уже сверху при rotation=0)
    // Сегмент с индексом N находится на угле N * 60 градусов от верха
    const targetAngle = selectedIndex * segmentAngle + segmentAngle / 2
    
    // Сколько нужно довернуть от текущей позиции чтобы попасть на нужный сегмент
    // Указатель сверху, колесо крутится по часовой стрелке
    // Чтобы сегмент оказался сверху, нужно повернуть на (360 - targetAngle)
    let angleToTarget = (360 - targetAngle) - currentRotation
    if (angleToTarget < 0) angleToTarget += 360
    
    // Спин 5-8 полных оборотов + довернуть до нужного сегмента
    const fullRotations = (5 + Math.floor(Math.random() * 3)) * 360
    const finalRotation = rotation + fullRotations + angleToTarget

    setRotation(finalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      onSpinComplete(discount)
      
      // Конфетти для скидок > 0
      if (discount > 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74']
        })
      }
    }, 4000)
  }

  if (!mounted) {
    return (
      <div className={cn("flex flex-col items-center gap-6", className)}>
        <div className="w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Pointer */}
      <div className="relative z-10 -mb-4">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
      </div>

      {/* Wheel Container */}
      <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px]">
        {/* Outer rim - like a tire */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-2xl" />
        
        {/* Tire texture ring */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-800 shadow-inner" />
        
        {/* Chrome lip */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 shadow-lg" />

        {/* Main wheel with segments */}
        <div 
          className="absolute inset-6 rounded-full overflow-hidden shadow-inner transition-transform ease-out"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? "4s" : "0s",
            transitionTimingFunction: "cubic-bezier(0.17, 0.67, 0.12, 0.99)"
          }}
        >
          {/* Segments as spokes */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {SEGMENTS.map((segment, index) => {
              const angle = (360 / SEGMENTS.length) * index
              const startAngle = angle - 90
              const endAngle = startAngle + (360 / SEGMENTS.length)
              
              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180
              
              const x1 = 50 + 50 * Math.cos(startRad)
              const y1 = 50 + 50 * Math.sin(startRad)
              const x2 = 50 + 50 * Math.cos(endRad)
              const y2 = 50 + 50 * Math.sin(endRad)
              
              const largeArc = endAngle - startAngle > 180 ? 1 : 0
              
              const pathD = `M 50 50 L ${x1.toFixed(2)} ${y1.toFixed(2)} A 50 50 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
              
              // Text position
              const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180
              const textX = 50 + 32 * Math.cos(midAngle)
              const textY = 50 + 32 * Math.sin(midAngle)
              const textRotation = (startAngle + endAngle) / 2 + 90
              
              return (
                <g key={index}>
                  <path
                    d={pathD}
                    fill={segment.color}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                  />
                  {/* Spoke line effect */}
                  <line
                    x1="50"
                    y1="50"
                    x2={x1.toFixed(2)}
                    y2={y1.toFixed(2)}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="2"
                  />
                  <text
                    x={textX.toFixed(2)}
                    y={textY.toFixed(2)}
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation.toFixed(2)}, ${textX.toFixed(2)}, ${textY.toFixed(2)})`}
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {segment.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Center hub */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-300 shadow-lg flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-200 shadow-inner flex items-center justify-center">
              {/* Center bolt pattern */}
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                {[0, 72, 144, 216, 288].map((angle, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-zinc-600 shadow-inner"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-14px)`
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-zinc-500 shadow-inner" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spin button overlay */}
        <button
          onClick={spinWheel}
          disabled={isSpinning || disabled}
          className="absolute inset-0 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed z-10"
          aria-label="Крутить колесо"
        >
          <span className="sr-only">{isSpinning ? "Крутится..." : "Крутить колесо"}</span>
        </button>
      </div>

      {/* Spin instruction */}
      <p className="text-sm text-muted-foreground text-center">
        {isSpinning ? "Колесо крутится..." : disabled ? "Нажмите, чтобы крутить" : "Нажмите на колесо, чтобы крутить"}
      </p>
    </div>
  )
}
