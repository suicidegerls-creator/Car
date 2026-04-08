'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  ChevronLeft, 
  Camera, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut,
  Move,
  RotateCcw,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  X,
  Download,
  Share2,
  Loader2,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Wheel } from '@/lib/types/wheel'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'

interface ARCameraProps {
  wheel: Wheel | null
  onBack: () => void
  onChangeWheel: () => void
  wheels: Wheel[]
  onWheelChange: (wheel: Wheel) => void
}

export function ARCamera({ wheel, onBack, onChangeWheel, wheels, onWheelChange }: ARCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  
  // Wheel positioning state
  const [wheelPosition, setWheelPosition] = useState({ x: 50, y: 50 })
  const [wheelScale, setWheelScale] = useState(30) // percentage of screen
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // UI state
  const [showControls, setShowControls] = useState(true)
  const [showWheelPicker, setShowWheelPicker] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const { addItem } = useCart()

  // Start camera
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setIsLoading(true)
    setCameraError(null)

    try {
      // Stop existing stream first
      if (videoRef.current?.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream
        oldStream.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }

      console.log('[v0] Requesting camera with mode:', mode)
      
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      console.log('[v0] Got stream:', newStream.getVideoTracks().length, 'video tracks')
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('[v0] Video metadata loaded')
          videoRef.current?.play()
            .then(() => {
              console.log('[v0] Video playing')
              setIsLoading(false)
            })
            .catch((e) => {
              console.error('[v0] Video play error:', e)
              setIsLoading(false)
            })
        }
      }

      setStream(newStream)
    } catch (error) {
      console.error('[v0] Camera error:', error)
      setCameraError('Не удалось получить доступ к камере. Проверьте разрешения в настройках браузера.')
      setIsLoading(false)
    }
  }, [])

  // Initialize camera on mount
  useEffect(() => {
    startCamera(facingMode)

    return () => {
      if (videoRef.current?.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream
        oldStream.getTracks().forEach(track => track.stop())
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Switch camera
  const switchCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(newMode)
    startCamera(newMode)
  }

  // Handle wheel dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.wheel-overlay')) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100

    setWheelPosition(prev => ({
      x: Math.max(10, Math.min(90, prev.x + deltaX)),
      y: Math.max(10, Math.min(90, prev.y + deltaY))
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !containerRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to video size
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame
    ctx.drawImage(video, 0, 0)

    // Draw wheel overlay
    if (wheel && wheel.images && wheel.images.length > 0) {
      const img = document.createElement('img')
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const wheelSize = (wheelScale / 100) * Math.min(canvas.width, canvas.height)
        const wheelX = (wheelPosition.x / 100) * canvas.width - wheelSize / 2
        const wheelY = (wheelPosition.y / 100) * canvas.height - wheelSize / 2

        ctx.save()
        ctx.translate(wheelX + wheelSize / 2, wheelY + wheelSize / 2)
        ctx.rotate((wheelRotation * Math.PI) / 180)
        ctx.drawImage(img, -wheelSize / 2, -wheelSize / 2, wheelSize, wheelSize)
        ctx.restore()

        // Get image data
        const imageData = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedImage(imageData)
      }
      img.src = wheel.images[0]
    }
  }

  // Download captured image
  const downloadImage = () => {
    if (!capturedImage) return
    
    const link = document.createElement('a')
    link.href = capturedImage
    link.download = `ar-fitting-${wheel?.name || 'wheel'}.jpg`
    link.click()
  }

  // Share captured image
  const shareImage = async () => {
    if (!capturedImage) return

    try {
      const blob = await (await fetch(capturedImage)).blob()
      const file = new File([blob], 'ar-fitting.jpg', { type: 'image/jpeg' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'AR-примерка диска',
          text: `Примерка диска ${wheel?.name} от RIMZONE`
        })
      } else {
        // Fallback - copy to clipboard or show message
        toast.info('Сохраните изображение и поделитесь им вручную')
      }
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  // Add to cart
  const handleAddToCart = () => {
    if (!wheel) return
    addItem(wheel)
    toast.success('Диск добавлен в корзину')
  }

  // Reset position
  const resetPosition = () => {
    setWheelPosition({ x: 50, y: 50 })
    setWheelScale(30)
    setWheelRotation(0)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Запуск камеры...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (cameraError) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Ошибка камеры</h2>
          <p className="text-muted-foreground mb-4">{cameraError}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startCamera}>Попробовать снова</Button>
            <Button variant="outline" onClick={onBack}>Назад</Button>
          </div>
        </div>
      </div>
    )
  }

  // Captured image preview
  if (capturedImage) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col">
        <div className="flex-1 relative">
          <Image
            src={capturedImage}
            alt="Captured"
            fill
            className="object-contain"
          />
        </div>
        
        <div className="p-4 bg-background border-t space-y-4">
          {wheel && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                {wheel.images?.[0] && (
                  <Image
                    src={wheel.images[0]}
                    alt={wheel.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{wheel.name}</p>
                <p className="text-xs text-muted-foreground">{wheel.brand} R{wheel.diameter}</p>
              </div>
              <p className="font-bold">{wheel.price.toLocaleString('ru-RU')} ₽</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={downloadImage} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Скачать
            </Button>
            <Button onClick={shareImage} variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setCapturedImage(null)} variant="outline">
              Сделать еще
            </Button>
            <Button onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              В корзину
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Video feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Wheel overlay */}
      {wheel && wheel.images && wheel.images.length > 0 && (
        <div 
          className="wheel-overlay absolute cursor-move"
          style={{
            left: `${wheelPosition.x}%`,
            top: `${wheelPosition.y}%`,
            width: `${wheelScale}vmin`,
            height: `${wheelScale}vmin`,
            transform: `translate(-50%, -50%) rotate(${wheelRotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <Image
            src={wheel.images[0]}
            alt={wheel.name}
            fill
            className="object-contain pointer-events-none"
            draggable={false}
          />
          
          {/* Drag indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <Move className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onBack}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={switchCamera}
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Current wheel info */}
      {wheel && (
        <div 
          className="absolute top-16 left-4 right-4"
          onClick={() => setShowWheelPicker(!showWheelPicker)}
        >
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
              {wheel.images?.[0] && (
                <Image
                  src={wheel.images[0]}
                  alt={wheel.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{wheel.name}</p>
              <p className="text-xs text-muted-foreground">{wheel.brand} R{wheel.diameter}</p>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showWheelPicker ? 'rotate-180' : ''}`} />
          </div>

          {/* Wheel picker dropdown */}
          {showWheelPicker && (
            <div className="mt-2 bg-background/95 backdrop-blur-sm rounded-lg max-h-60 overflow-y-auto">
              {wheels.slice(0, 10).map(w => (
                <div
                  key={w.id}
                  className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 ${
                    w.id === wheel.id ? 'bg-accent/10' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onWheelChange(w)
                    setShowWheelPicker(false)
                  }}
                >
                  <div className="w-8 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                    {w.images?.[0] && (
                      <Image
                        src={w.images[0]}
                        alt={w.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.brand}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">R{w.diameter}</Badge>
                </div>
              ))}
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowWheelPicker(false)
                  onChangeWheel()
                }}
              >
                Показать все диски
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Controls panel */}
      {showControls && (
        <div className="absolute bottom-24 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Размер</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setWheelScale(s => Math.max(10, s - 5))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Slider
                value={[wheelScale]}
                min={10}
                max={60}
                step={1}
                onValueChange={([v]) => setWheelScale(v)}
                className="w-32"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setWheelScale(s => Math.min(60, s + 5))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Поворот</span>
            <Slider
              value={[wheelRotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={([v]) => setWheelRotation(v)}
              className="w-48"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={resetPosition}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Сброс
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowControls(false)}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Show controls button */}
      {!showControls && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
          onClick={() => setShowControls(true)}
        >
          <ChevronUp className="w-4 h-4 mr-2" />
          Настройки
        </Button>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>

          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90"
            onClick={capturePhoto}
          >
            <Camera className="w-6 h-6" />
          </Button>

          <Link href={`/catalog/${wheel?.id}`}>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full"
            >
              Подробнее
            </Button>
          </Link>
        </div>
      </div>

      {/* Instructions overlay (first time) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <p className="text-white/50 text-sm text-center px-8">
          Перетащите диск на колесо автомобиля
        </p>
      </div>
    </div>
  )
}
