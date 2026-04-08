'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ARPhotoFitting } from './ar-photo-fitting'
import { WheelSelector } from './wheel-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Camera, 
  ChevronLeft,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/hooks/use-cart'
import type { Wheel } from '@/lib/types/wheel'

type Step = 'intro' | 'select-wheel' | 'fitting'

export function ARFittingRoom() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const preselectedWheelId = searchParams.get('wheel')
  
  const [step, setStep] = useState<Step>(preselectedWheelId ? 'fitting' : 'intro')
  const [selectedWheel, setSelectedWheel] = useState<Wheel | null>(null)
  const [wheels, setWheels] = useState<Wheel[]>([])
  const [loading, setLoading] = useState(true)
  
  const { addItem } = useCart()
  const supabase = createClient()

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
    setStep('fitting')
  }

  const handleBack = () => {
    if (step === 'fitting') {
      setStep('select-wheel')
    } else if (step === 'select-wheel') {
      setStep('intro')
    } else {
      router.push('/catalog')
    }
  }

  const handleAddToCart = () => {
    if (selectedWheel) {
      addItem({
        id: selectedWheel.id,
        name: selectedWheel.name,
        price: selectedWheel.price,
        quantity: 1,
        image: selectedWheel.images?.[0],
        brand: selectedWheel.brand,
        diameter: selectedWheel.diameter,
      })
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
            <CardTitle className="text-2xl">Примерка дисков на фото</CardTitle>
            <CardDescription>
              Сфотографируйте ваш автомобиль и примерьте на него диски из нашего каталога
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
                    <p className="font-medium">Сделайте фото</p>
                    <p className="text-sm text-muted-foreground">Сфотографируйте автомобиль сбоку или выберите фото из галереи</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-accent">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Примерьте диск</p>
                    <p className="text-sm text-muted-foreground">Перетащите диск на колесо, настройте размер и сохраните результат</p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setStep('select-wheel')}
            >
              Начать примерку
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Ваши фотографии обрабатываются только на вашем устройстве и не передаются на сервер.
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

  // Photo fitting view
  return (
    <ARPhotoFitting 
      wheel={selectedWheel}
      onBack={handleBack}
      onChangeWheel={() => setStep('select-wheel')}
      onAddToCart={handleAddToCart}
    />
  )
}
