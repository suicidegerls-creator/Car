'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import {
  ChevronLeft,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  ShoppingCart,
  ImageIcon,
  X,
  Move,
  ChevronDown,
} from 'lucide-react'
import type { Wheel } from '@/lib/types/wheel'

interface ARPhotoFittingProps {
  wheel: Wheel | null
  onBack: () => void
  onChangeWheel: () => void
  onAddToCart: () => void
}

export function ARPhotoFitting({ wheel, onBack, onChangeWheel, onAddToCart }: ARPhotoFittingProps) {
  const [carPhoto, setCarPhoto] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Wheel overlay state
  const [wheelPosition, setWheelPosition] = useState({ x: 50, y: 60 }) // percentage
  const [wheelSize, setWheelSize] = useState(25) // percentage of image width
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = document.createElement('img')
      img.onload = () => {
        // Resize image if too large
        const maxSize = 1920
        let width = img.width
        let height = img.height
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }
        
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        setCarPhoto(canvas.toDataURL('image/jpeg', 0.9))
        setIsProcessing(false)
        
        // Reset wheel position to center-bottom area (typical wheel location)
        setWheelPosition({ x: 30, y: 70 })
        setWheelSize(20)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  // Handle drag
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!carPhoto) return
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Check if clicking on wheel area
    const dx = Math.abs(x - wheelPosition.x)
    const dy = Math.abs(y - wheelPosition.y)
    
    if (dx < wheelSize / 2 + 5 && dy < wheelSize / 2 + 5) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }, [carPhoto, wheelPosition, wheelSize])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100
    
    setWheelPosition(prev => ({
      x: Math.max(5, Math.min(95, prev.x + deltaX)),
      y: Math.max(5, Math.min(95, prev.y + deltaY))
    }))
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragStart])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Save composite image
  const saveImage = useCallback(() => {
    if (!carPhoto || !wheel?.images?.[0] || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const carImg = document.createElement('img')
    carImg.crossOrigin = 'anonymous'
    carImg.onload = () => {
      canvas.width = carImg.width
      canvas.height = carImg.height
      
      // Draw car
      ctx.drawImage(carImg, 0, 0)
      
      // Draw wheel
      const wheelImg = document.createElement('img')
      wheelImg.crossOrigin = 'anonymous'
      wheelImg.onload = () => {
        const wheelW = (wheelSize / 100) * canvas.width
        const wheelH = wheelW
        const wheelX = (wheelPosition.x / 100) * canvas.width - wheelW / 2
        const wheelY = (wheelPosition.y / 100) * canvas.height - wheelH / 2
        
        ctx.save()
        ctx.translate(wheelX + wheelW / 2, wheelY + wheelH / 2)
        ctx.rotate((wheelRotation * Math.PI) / 180)
        ctx.drawImage(wheelImg, -wheelW / 2, -wheelH / 2, wheelW, wheelH)
        ctx.restore()
        
        // Download
        const link = document.createElement('a')
        link.download = `${wheel.name}-fitting.jpg`
        link.href = canvas.toDataURL('image/jpeg', 0.9)
        link.click()
      }
      wheelImg.src = wheel.images[0]
    }
    carImg.src = carPhoto
  }, [carPhoto, wheel, wheelPosition, wheelSize, wheelRotation])

  // Reset
  const resetPhoto = useCallback(() => {
    setCarPhoto(null)
    setWheelPosition({ x: 50, y: 60 })
    setWheelSize(25)
    setWheelRotation(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // No wheel selected
  if (!wheel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-center">Сначала выберите диск для примерки</p>
        <Button onClick={onChangeWheel}>Выбрать диск</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold">Примерка диска</h1>
        <div className="w-10" />
      </div>

      {/* Selected wheel info */}
      <div 
        className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onChangeWheel}
      >
        {wheel.images && wheel.images.length > 0 && (
          <div className="w-12 h-12 relative rounded overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={wheel.images[0]}
              alt={wheel.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{wheel.name}</p>
          <p className="text-sm text-muted-foreground">{wheel.brand} R{wheel.diameter}</p>
        </div>
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {!carPhoto ? (
          // Photo capture screen
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">Сфотографируйте автомобиль</h2>
              <p className="text-muted-foreground max-w-xs">
                Сделайте фото сбоку, чтобы было видно колесо. Затем вы сможете примерить на него диск.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              {/* Camera capture button - native camera on mobile */}
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-5 h-5" />
                Сделать фото
              </Button>
              
              {/* Hidden file input with camera capture */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {/* Gallery option */}
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2"
                onClick={() => {
                  // Create separate input for gallery
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = (e) => handleFileSelect(e as unknown as React.ChangeEvent<HTMLInputElement>)
                  input.click()
                }}
              >
                <ImageIcon className="w-5 h-5" />
                Выбрать из галереи
              </Button>
            </div>
          </div>
        ) : (
          // Photo editing screen
          <div className="flex-1 flex flex-col">
            {/* Photo with wheel overlay */}
            <div 
              ref={containerRef}
              className="relative flex-1 bg-black touch-none select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Car photo */}
              <Image
                src={carPhoto}
                alt="Ваш автомобиль"
                fill
                className="object-contain"
                draggable={false}
              />
              
              {/* Wheel overlay */}
              {wheel.images && wheel.images.length > 0 && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${wheelPosition.x}%`,
                    top: `${wheelPosition.y}%`,
                    width: `${wheelSize}%`,
                    transform: `translate(-50%, -50%) rotate(${wheelRotation}deg)`,
                    aspectRatio: '1',
                  }}
                >
                  <Image
                    src={wheel.images[0]}
                    alt={wheel.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    draggable={false}
                  />
                  
                  {/* Drag handle indicator */}
                  <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-full flex items-center justify-center">
                    <div className="bg-white/80 rounded-full p-2">
                      <Move className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full">
                Перетащите диск на колесо
              </div>

              {/* Reset photo button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4"
                onClick={resetPhoto}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4 border-t bg-background">
              {/* Size slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Размер</span>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setWheelSize(s => Math.max(5, s - 2))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setWheelSize(s => Math.min(50, s + 2))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Slider
                  value={[wheelSize]}
                  onValueChange={([v]) => setWheelSize(v)}
                  min={5}
                  max={50}
                  step={1}
                />
              </div>

              {/* Rotation slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Поворот</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setWheelRotation(0)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Сброс
                  </Button>
                </div>
                <Slider
                  value={[wheelRotation]}
                  onValueChange={([v]) => setWheelRotation(v)}
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={saveImage}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
                <Button 
                  className="flex-1"
                  onClick={onAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  В корзину
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for compositing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p>Обработка фото...</p>
          </Card>
        </div>
      )}
    </div>
  )
}
