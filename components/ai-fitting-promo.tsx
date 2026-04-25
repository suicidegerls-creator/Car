'use client'

import Link from 'next/link'
import { Sparkles, Camera, Zap, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AIFittingPromo() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Text content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 rounded-full border border-primary/30">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Эксклюзивная функция</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Примерьте диски на 
                <span className="text-primary"> ваш автомобиль</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Загрузите фото вашего авто и посмотрите, как будут смотреться новые диски. 
                Наша ИИ-технология мгновенно покажет результат — никаких догадок!
              </p>
              
              <ul className="space-y-3">
                {[
                  'Загрузите фото или используйте камеру',
                  'Выберите любой диск из каталога',
                  'Увидите результат за секунды',
                  'Сохраните и поделитесь с друзьями'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/ar-fitting">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105">
                    <Camera className="w-5 h-5 mr-2" />
                    Попробовать сейчас
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl">
                    Смотреть каталог
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right side - Visual showcase */}
            <div className="relative">
              {/* Main card */}
              <div className="relative bg-card rounded-3xl p-8 shadow-2xl border border-border">
                {/* Phone mockup with preview */}
                <div className="aspect-[4/5] bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Simulated phone screen */}
                  <div className="absolute inset-4 bg-background rounded-xl shadow-inner flex flex-col">
                    {/* Phone header */}
                    <div className="h-8 bg-muted/50 rounded-t-xl flex items-center justify-center">
                      <div className="w-16 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>
                    
                    {/* Phone content - Car silhouette */}
                    <div className="flex-1 flex items-center justify-center p-4 relative">
                      <div className="w-full h-full bg-gradient-to-b from-muted/30 to-muted rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 200 100" className="w-full h-auto text-muted-foreground/40">
                          <path 
                            fill="currentColor" 
                            d="M20,70 Q30,40 60,40 L90,40 Q100,25 120,25 L150,25 Q165,25 175,40 L190,40 Q195,50 195,60 L195,75 Q195,80 190,80 L170,80 Q165,95 150,95 Q135,95 130,80 L70,80 Q65,95 50,95 Q35,95 30,80 L10,80 Q5,80 5,75 L5,60 Q5,50 20,70 Z"
                          />
                          {/* Wheels */}
                          <circle cx="50" cy="80" r="12" className="fill-primary" />
                          <circle cx="150" cy="80" r="12" className="fill-primary" />
                          <circle cx="50" cy="80" r="6" className="fill-background" />
                          <circle cx="150" cy="80" r="6" className="fill-background" />
                        </svg>
                      </div>
                      
                      {/* AI sparkle effect */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                    
                    {/* Phone bottom bar */}
                    <div className="h-12 bg-muted/30 rounded-b-xl flex items-center justify-center gap-2 px-4">
                      <div className="flex-1 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-xs text-primary-foreground font-medium">Применить</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Бесплатно
                </div>
                
                <div className="absolute -bottom-3 left-8 bg-card border border-border px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Работает на любом устройстве
                </div>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -z-10 top-1/2 -translate-y-1/2 -right-8 grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-primary/30 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
