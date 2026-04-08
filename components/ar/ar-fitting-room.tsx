'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ARCamera } from './ar-camera'
import { WheelSelector } from './wheel-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Camera, 
  Smartphone, 
  AlertCircle, 
  ChevronLeft,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Wheel } from '@/lib/types/wheel'

type Step = 'intro' | 'select-wheel' | 'camera'

export function ARFittingRoom() {
  const searchParams = useSearchParams()
  const preselectedWheelId = searchParams.get('wheel')
  
  const [step, setStep] = useState<Step>(preselectedWheelId ? 'camera' : 'intro')
  const [selectedWheel, setSelectedWheel] = useState<Wheel | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const [wheels, setWheels] = useState<Wheel[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Check device capabilities
  useEffect(() => {
    const checkDevice = async () => {
      // Check if mobile
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)

      // Check camera availability
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setHasCamera(videoDevices.length > 0)
      } catch {
        setHasCamera(false)
      }
    }

    checkDevice()
  }, [])

  // Load wheels
  useEffect(() => {
    const loadWheels = async () => {
      const { data } = await supabase
        .from('wheels')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) {
        setWheels(data)
        
        // If preselected wheel, find it
        if (preselectedWheelId) {
          const wheel = data.find(w => w.id === preselectedWheelId)
          if (wheel) {
            setSelectedWheel(wheel)
          }
        }
      }
      setLoading(false)
    }

    loadWheels()
  }, [supabase, preselectedWheelId])

  const handleWheelSelect = (wheel: Wheel) => {
    setSelectedWheel(wheel)
    setStep('camera')
  }

  const handleBack = () => {
    if (step === 'camera') {
      setStep('select-wheel')
    } else if (step === 'select-wheel') {
      setStep('intro')
    }
  }

  // Intro screen
  if (step === 'intro') {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Link href="/catalog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Вернуться в каталог
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">AR-примерка дисков</CardTitle>
            <CardDescription>
              Посмотрите, как диски будут выглядеть на вашем автомобиле с помощью камеры
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* How it works */}
            <div className="space-y-4">
              <h3 className="font-medium">Как это работает:</h3>
              <div className="grid gap-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-accent">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Выберите диск</p>
                    <p className="text-sm text-muted-foreground">Выберите модель диска из каталога для примерки</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-accent">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Наведите камеру</p>
                    <p className="text-sm text-muted-foreground">Направьте камеру на колесо вашего автомобиля</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-accent">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Примерьте диск</p>
                    <p className="text-sm text-muted-foreground">Увидьте результат в реальном времени и сделайте фото</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Device check */}
            {!isMobile && (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <Smartphone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Рекомендуется мобильное устройство</p>
                  <p className="text-sm text-muted-foreground">
                    Для лучшего опыта откройте эту страницу на смартфоне или планшете
                  </p>
                </div>
              </div>
            )}

            {!hasCamera && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Камера не найдена</p>
                  <p className="text-sm text-muted-foreground">
                    Для использования AR-примерки необходима камера
                  </p>
                </div>
              </div>
            )}

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setStep('select-wheel')}
              disabled={!hasCamera}
            >
              Начать примерку
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Приложение запросит доступ к камере. Ваши данные не сохраняются и не передаются на сервер.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Wheel selector
  if (step === 'select-wheel') {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={handleBack}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Назад
        </Button>

        <WheelSelector 
          wheels={wheels}
          loading={loading}
          onSelect={handleWheelSelect}
          selectedWheel={selectedWheel}
        />
      </div>
    )
  }

  // Camera view
  return (
    <ARCamera 
      wheel={selectedWheel}
      onBack={handleBack}
      onChangeWheel={() => setStep('select-wheel')}
      wheels={wheels}
      onWheelChange={setSelectedWheel}
    />
  )
}
