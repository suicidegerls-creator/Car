"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

interface DiscountWheelProps {
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

export function DiscountWheel({ onSpinComplete, disabled, className }: DiscountWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<number | null>(null)

  const spinWheel = useCallback(() => {
    if (isSpinning || disabled) return

    setIsSpinning(true)
    setResult(null)

    // Weighted random - lower discounts more likely
    const weights = [30, 25, 20, 12, 8, 5] // 0%, 1%, 2%, 3%, 4%, 5%
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight
    let selectedIndex = 0
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        selectedIndex = i
        break
      }
    }

    const segmentAngle = 360 / SEGMENTS.length
    const targetSegmentCenter = selectedIndex * segmentAngle + segmentAngle / 2
    // Spin 5-8 full rotations + land on segment
    const fullRotations = (5 + Math.random() * 3) * 360
    const finalRotation = rotation + fullRotations + (360 - targetSegmentCenter)

    setRotation(finalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setResult(SEGMENTS[selectedIndex].value)
      onSpinComplete(SEGMENTS[selectedIndex].value)
      
      // Confetti for discounts > 0
      if (SEGMENTS[selectedIndex].value > 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74']
        })
      }
    }, 4000)
  }, [isSpinning, disabled, rotation, onSpinComplete])

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
              
              const pathD = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`
              
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
                    x2={x1}
                    y2={y1}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
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
      </div>

      {/* Spin Button */}
      <Button
        onClick={spinWheel}
        disabled={isSpinning || disabled}
        size="lg"
        className="px-10 py-6 text-lg font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
      >
        {isSpinning ? "Крутится..." : "Крутить колесо"}
      </Button>

      {/* Result */}
      {result !== null && !isSpinning && (
        <div className={cn(
          "text-center p-4 rounded-xl animate-in fade-in zoom-in duration-300",
          result > 0 ? "bg-primary/10 border border-primary" : "bg-muted"
        )}>
          {result > 0 ? (
            <>
              <p className="text-2xl font-bold text-primary">Поздравляем!</p>
              <p className="text-lg text-foreground">Вы выиграли скидку <span className="font-bold text-primary">{result}%</span></p>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold text-muted-foreground">В этот раз не повезло</p>
              <p className="text-sm text-muted-foreground">Попробуйте снова через неделю!</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
