'use client'

import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Eye } from 'lucide-react'
import { Wheel, WHEEL_TYPE_LABELS } from '@/lib/types/wheel'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { Button } from '@/components/ui/button'

interface CatalogGridProps {
  wheels: Wheel[]
  loading: boolean
}

// Interactive card component with 3D tilt + glow border effect
function InteractiveCard({ wheel }: { wheel: Wheel }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (max 12 degrees)
    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12

    // Calculate glow position as percentage
    const glowX = (x / rect.width) * 100
    const glowY = (y / rect.height) * 100

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    setGlowPosition({ x: glowX, y: glowY })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTransform('')
    setGlowPosition({ x: 50, y: 50 })
  }, [])

  return (
    <Link href={`/catalog/${wheel.id}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative h-full"
        style={{
          transform: transform,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Animated glow border */}
        <div
          className="absolute -inset-[1px] rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0.1) 40%, transparent 70%)`,
          }}
        />
        
        {/* Outer glow effect */}
        <div
          className="absolute -inset-[2px] rounded-xl opacity-0 blur-md transition-opacity duration-500 pointer-events-none z-0"
          style={{
            opacity: isHovered ? 0.6 : 0,
            background: `radial-gradient(400px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(212, 175, 55, 0.3), transparent 60%)`,
          }}
        />

        <Card className="overflow-hidden h-full relative z-10 bg-card/95 backdrop-blur-sm border-border/50 cursor-pointer">
          <div className="aspect-square relative bg-secondary overflow-hidden">
            {wheel.images?.[0] ? (
              <img
                src={wheel.images[0]}
                alt={wheel.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 ease-out"
                style={{
                  transform: isHovered ? 'scale(1.1) translateZ(20px)' : 'scale(1)',
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package 
                  className="w-16 h-16 text-muted-foreground transition-transform duration-300"
                  style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
                />
              </div>
            )}
            
            {/* Light reflection effect following cursor */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
              }}
            />
            
            {/* Hover overlay with gradient */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-300"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
            
            {/* Quick view button on hover */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-all duration-300"
              style={{ 
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateZ(40px)' : 'translateZ(0)',
              }}
            >
              <div 
                className="bg-background/95 backdrop-blur-sm rounded-full p-3 shadow-lg transition-transform duration-300"
                style={{ transform: isHovered ? 'scale(1)' : 'scale(0.75)' }}
              >
                <Eye className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            {!wheel.in_stock && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="secondary">Нет в наличии</Badge>
              </div>
            )}
            {wheel.old_price && wheel.old_price > wheel.price && (
              <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground animate-pulse">
                -{Math.round((1 - wheel.price / wheel.old_price) * 100)}%
              </Badge>
            )}
          </div>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1 sm:px-2">
                {WHEEL_TYPE_LABELS[wheel.wheel_type]}
              </Badge>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                R{wheel.diameter}
              </span>
            </div>
            <h3 
              className="font-medium text-xs sm:text-sm line-clamp-2 mb-1 transition-colors duration-300"
              style={{ color: isHovered ? 'hsl(var(--primary))' : 'inherit' }}
            >
              {wheel.name}
            </h3>
            <p className="text-[10px] sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-1">
              {wheel.brand} • {wheel.pcd}
            </p>
            <div className="flex items-center justify-between gap-1">
              <div className="min-w-0">
                {wheel.old_price && wheel.old_price > wheel.price && (
                  <span className="text-[10px] sm:text-sm text-muted-foreground line-through mr-1 sm:mr-2 block sm:inline">
                    {wheel.old_price.toLocaleString('be-BY')}
                  </span>
                )}
                <span className="text-sm sm:text-lg font-bold">
                  {wheel.price.toLocaleString('be-BY')}
                </span>
                <span className="text-[10px] sm:text-sm ml-0.5">BYN</span>
              </div>
              <div 
                onClick={(e) => e.preventDefault()} 
                className="flex-shrink-0 transition-transform duration-300"
                style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
              >
                <AddToCartButton wheel={wheel} size="icon" showText={false} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  )
}

export function CatalogGrid({ wheels, loading }: CatalogGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (wheels.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Товары не найдены</h3>
        <p className="text-muted-foreground mb-4">
          Попробуйте изменить параметры фильтрации
        </p>
        <Button variant="outline" asChild>
          <Link href="/catalog">Сбросить фильтры</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {wheels.map((wheel) => (
        <InteractiveCard key={wheel.id} wheel={wheel} />
      ))}
    </div>
  )
}
