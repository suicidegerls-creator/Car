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
  ChevronDown,
  Maximize2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Wheel overlay state
  const [wheelPosition, setWheelPosition] = useState({ x: 50, y: 60 }) // percentage
  const [wheelScaleX, setWheelScaleX] = useState(25) // ширина в процентах
  const [wheelScaleY, setWheelScaleY] = useState(25) // высота в процентах
  const [wheelRotateZ, setWheelRotateZ] = useState(0) // обычный поворот
  const [wheelRotateX, setWheelRotateX] = useState(0) // наклон вперед/назад
  const [wheelRotateY, setWheelRotateY] = useState(0) // перспектива влево/вправо
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<'size' | 'rotate'>('size')
  
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
        setWheelScaleX(20)
        setWheelScaleY(20)
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
    
    if (dx < wheelScaleX / 2 + 5 && dy < wheelScaleY / 2 + 5) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }, [carPhoto, wheelPosition, wheelScaleX, wheelScaleY])

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

  // Получаем изображение диска для AR (прозрачное если есть, иначе обычное)
  const getWheelImageForAR = useCallback(() => {
    if (!wheel) return null
    return wheel.image_transparent || wheel.images?.[0] || null
  }, [wheel])

// Save composite image by manual canvas rendering
  const saveImage = useCallback(async () => {
    const wheelImageUrl = getWheelImageForAR()
    if (!carPhoto || !wheelImageUrl || !containerRef.current) return
    
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    
    // Загружаем оба изображения
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    }
    
    try {
      const [carImg, wheelImg] = await Promise.all([
        loadImage(carPhoto),
        loadImage(wheelImageUrl)
      ])
      
      // Создаём canvas размером с контейнер (как на экране)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // Используем размер контейнера для точного соответствия
      const scale = 2 // Для качества
      canvas.width = containerRect.width * scale
      canvas.height = containerRect.height * scale
      ctx.scale(scale, scale)
      
      // Заливаем черным фоном
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, containerRect.width, containerRect.height)
      
      // Рассчитываем как изображение авто отображается с object-contain
      const imgAspect = carImg.width / carImg.height
      const containerAspect = containerRect.width / containerRect.height
      
      let drawWidth: number, drawHeight: number, drawX: number, drawY: number
      
      if (imgAspect > containerAspect) {
        drawWidth = containerRect.width
        drawHeight = containerRect.width / imgAspect
        drawX = 0
        drawY = (containerRect.height - drawHeight) / 2
      } else {
        drawHeight = containerRect.height
        drawWidth = containerRect.height * imgAspect
        drawX = (containerRect.width - drawWidth) / 2
        drawY = 0
      }
      
      // Рисуем авто
      ctx.drawImage(carImg, drawX, drawY, drawWidth, drawHeight)
      
// Рассчитываем позицию и размер контейнера диска (в пикселях)
      const wheelCenterX = (wheelPosition.x / 100) * containerRect.width
      const wheelCenterY = (wheelPosition.y / 100) * containerRect.height
      const wheelContainerW = (wheelScaleX / 100) * containerRect.width
      const wheelContainerH = (wheelScaleY / 100) * containerRect.height
      
      // Применяем object-contain для диска (сохраняем пропорции)
      const wheelImgAspect = wheelImg.width / wheelImg.height
      const wheelContainerAspect = wheelContainerW / wheelContainerH
      
      let wheelW: number, wheelH: number
      if (wheelImgAspect > wheelContainerAspect) {
        // Диск шире - ограничен по ширине
        wheelW = wheelContainerW
        wheelH = wheelContainerW / wheelImgAspect
      } else {
        // Диск выше - ограничен по высоте
        wheelH = wheelContainerH
        wheelW = wheelContainerH * wheelImgAspect
      }
      
      // Рисуем диск с трансформациями
      ctx.save()
      ctx.translate(wheelCenterX, wheelCenterY)
      
      // Применяем 3D трансформации (эмуляция через scale)
      const rotZ = (wheelRotateZ * Math.PI) / 180
      const scaleXFactor = Math.cos((wheelRotateY * Math.PI) / 180)
      const scaleYFactor = Math.cos((wheelRotateX * Math.PI) / 180)
      
      ctx.rotate(rotZ)
      ctx.scale(scaleXFactor, scaleYFactor)
      
      ctx.drawImage(wheelImg, -wheelW / 2, -wheelH / 2, wheelW, wheelH)
      ctx.restore()
      
      // Создаём Blob и скачиваем
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
      const fileName = `${wheel?.name || 'disk'}-fitting.jpg`
      
      // Конвертируем в Blob
      const byteString = atob(dataUrl.split(',')[1])
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: 'image/jpeg' })
      const blobUrl = URL.createObjectURL(blob)
      
      // Пробуем Web Share API
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], fileName, { type: 'image/jpeg' })
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Примерка диска' })
            URL.revokeObjectURL(blobUrl)
            return
          }
        } catch { /* fallback to download */ }
      }
      
      // Скачиваем
      const link = document.createElement('a')
      link.download = fileName
      link.href = blobUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
      
    } catch (error) {
      console.error('Save failed:', error)
      alert('Не удалось сохранить изображение. Попробуйте ещё раз.')
    }
  }, [carPhoto, wheel, wheelPosition, wheelScaleX, wheelScaleY, wheelRotateX, wheelRotateY, wheelRotateZ, getWheelImageForAR])

  // Reset
  const resetPhoto = useCallback(() => {
    setCarPhoto(null)
    setWheelPosition({ x: 50, y: 60 })
    setWheelScaleX(25)
    setWheelScaleY(25)
    setWheelRotateZ(0)
    setWheelRotateX(0)
    setWheelRotateY(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // Reset wheel only
  const resetWheel = useCallback(() => {
    setWheelPosition({ x: 50, y: 60 })
    setWheelScaleX(25)
    setWheelScaleY(25)
    setWheelRotateZ(0)
    setWheelRotateX(0)
    setWheelRotateY(0)
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
                Сделайте фото сбоку, чтобы было ��идно колесо. Затем вы сможете примерить на него диск.
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
                Сде��ат�� фото
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
              
              {/* Wheel overlay with 3D transforms */}
              {getWheelImageForAR() && (
                <div
                  className="absolute cursor-move"
                  style={{
                    left: `${wheelPosition.x}%`,
                    top: `${wheelPosition.y}%`,
                    width: `${wheelScaleX}%`,
                    height: `${wheelScaleY}%`,
                    transform: `translate(-50%, -50%) perspective(500px) rotateX(${wheelRotateX}deg) rotateY(${wheelRotateY}deg) rotateZ(${wheelRotateZ}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                  }}
                >
                  <Image
                    src={getWheelImageForAR()!}
                    alt={wheel.name}
                    fill
                    className="object-contain drop-shadow-2xl pointer-events-none"
                    draggable={false}
                  />
                </div>
              )}
              
              {/* Hint */}
              <div className="hint-overlay absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full">
                Перетащите диск на колесо
              </div>

              {/* Reset photo button */}
              <Button
                variant="secondary"
                size="icon"
                className="hint-overlay absolute top-4 right-4"
                onClick={resetPhoto}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3 border-t bg-background">
              {/* Tabs */}
              <div className="flex gap-2 border-b pb-2">
                <Button 
                  variant={activeTab === 'size' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setActiveTab('size')}
                  className="flex-1"
                >
                  <Maximize2 className="w-4 h-4 mr-1" />
                  Размер
                </Button>
                <Button 
                  variant={activeTab === 'rotate' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setActiveTab('rotate')}
                  className="flex-1"
                >
                  <RotateCw className="w-4 h-4 mr-1" />
                  Поворот
                </Button>
              </div>

              {activeTab === 'size' && (
                <>
                  {/* Width */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-[70px]">
                      <FlipHorizontal className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">Ширина</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => setWheelScaleX(s => Math.max(5, s - 2))}
                      >
                        <ZoomOut className="w-3 h-3" />
                      </Button>
                      <Slider
                        value={[wheelScaleX]}
                        min={3}
                        max={100}
                        step={1}
                        onValueChange={([v]) => setWheelScaleX(v)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => setWheelScaleX(s => Math.min(100, s + 2))}
                      >
                        <ZoomIn className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Height */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-[70px]">
                      <FlipVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">Высота</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => setWheelScaleY(s => Math.max(5, s - 2))}
                      >
                        <ZoomOut className="w-3 h-3" />
                      </Button>
                      <Slider
                        value={[wheelScaleY]}
                        min={3}
                        max={100}
                        step={1}
                        onValueChange={([v]) => setWheelScaleY(v)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => setWheelScaleY(s => Math.min(100, s + 2))}
                      >
                        <ZoomIn className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'rotate' && (
                <>
                  {/* Rotate Z (normal rotation) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <span className="text-xs font-medium text-primary">Z</span>
                      <span className="text-xs">Вращение</span>
                    </div>
                    <Slider
                      value={[wheelRotateZ]}
                      min={-180}
                      max={180}
                      step={1}
                      onValueChange={([v]) => setWheelRotateZ(v)}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">{wheelRotateZ}°</span>
                  </div>

                  {/* Rotate X (tilt forward/backward) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <span className="text-xs font-medium text-green-500">X</span>
                      <span className="text-xs">Наклон</span>
                    </div>
                    <Slider
                      value={[wheelRotateX]}
                      min={-90}
                      max={90}
                      step={1}
                      onValueChange={([v]) => setWheelRotateX(v)}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">{wheelRotateX}°</span>
                  </div>

                  {/* Rotate Y (tilt left/right) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <span className="text-xs font-medium text-blue-500">Y</span>
                      <span className="text-xs">Перспектива</span>
                    </div>
                    <Slider
                      value={[wheelRotateY]}
                      min={-90}
                      max={90}
                      step={1}
                      onValueChange={([v]) => setWheelRotateY(v)}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">{wheelRotateY}°</span>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetWheel}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Сброс
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={saveImage}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
                <Button 
                  size="sm"
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
