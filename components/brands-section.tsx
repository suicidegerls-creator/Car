"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const brands = [
  "BBS",
  "OZ Racing",
  "Vossen",
  "Enkei",
  "Work Wheels",
  "Rays",
  "HRE",
  "ADV.1",
  "Rotiform",
  "Forgiato",
]

export function BrandsSection() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Auto-scroll animation
  useEffect(() => {
    if (isHovered || isDragging) return
    
    const container = scrollRef.current
    if (!container) return

    const scrollSpeed = 1
    let animationId: number

    const autoScroll = () => {
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0
      } else {
        container.scrollLeft += scrollSpeed
      }
      animationId = requestAnimationFrame(autoScroll)
    }

    animationId = requestAnimationFrame(autoScroll)
    return () => cancelAnimationFrame(animationId)
  }, [isHovered, isDragging])

  // Check scroll position
  const checkScroll = () => {
    const container = scrollRef.current
    if (!container) return
    
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    
    container.addEventListener("scroll", checkScroll)
    checkScroll()
    
    return () => container.removeEventListener("scroll", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return
    
    const scrollAmount = 300
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  // Drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsHovered(false)
  }

  // Navigate to catalog with brand filter
  const handleBrandClick = (brand: string) => {
    if (isDragging) return
    router.push(`/catalog?brand=${encodeURIComponent(brand)}`)
  }

  return (
    <section id="brands" className="py-16 sm:py-24 bg-secondary/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">
            Официальный дилер
          </p>
        </div>

        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left scroll button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity ${!canScrollLeft ? 'invisible' : ''}`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 sm:gap-10 px-8 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {[...brands, ...brands, ...brands].map((brand, index) => (
              <button
                key={index}
                onClick={() => handleBrandClick(brand)}
                className="flex-shrink-0 text-2xl sm:text-3xl lg:text-4xl font-bold text-muted-foreground/40 hover:text-accent transition-all duration-300 whitespace-nowrap py-4 hover:scale-110"
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Right scroll button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity ${!canScrollRight ? 'invisible' : ''}`}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-secondary/30 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-secondary/30 to-transparent pointer-events-none" />
        </div>

        <p className="text-center text-muted-foreground/60 text-sm mt-6">
          Нажмите на бренд для просмотра каталога
        </p>
      </div>
    </section>
  )
}
