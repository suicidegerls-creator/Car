'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CircleDot, Wrench, Gauge, Bolt, Circle, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const categories = [
  {
    id: 'wheels',
    title: 'Диски',
    description: 'Литые, кованые и штампованные диски для любых автомобилей',
    icon: CircleDot,
    href: '/catalog/wheels',
    image: '/images/hero-wheel-1.png',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-100',
  },
  {
    id: 'sensors',
    title: 'Датчики давления',
    description: 'TPMS датчики для контроля давления в шинах',
    icon: Gauge,
    href: '/catalog/sensors',
    image: '/images/tpms-sensor.png',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    id: 'fasteners',
    title: 'Крепёж',
    description: 'Болты, гайки и секретки для дисков',
    icon: Bolt,
    href: '/catalog/fasteners',
    image: '/images/fasteners.png',
    gradient: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-50 to-yellow-50',
  },
  {
    id: 'hub-rings',
    title: 'Центровочные кольца',
    description: 'Для точной установки дисков на ступицу',
    icon: Circle,
    href: '/catalog/hub-rings',
    image: '/images/hub-rings.png',
    gradient: 'from-violet-500 to-purple-500',
    bgGradient: 'from-violet-50 to-purple-50',
  },
  {
    id: 'spacers',
    title: 'Проставки',
    description: 'Колёсные проставки для изменения вылета',
    icon: Layers,
    href: '/catalog/spacers',
    image: '/images/spacers.png',
    gradient: 'from-rose-500 to-pink-500',
    bgGradient: 'from-rose-50 to-pink-50',
  },
  {
    id: 'services',
    title: 'Услуги',
    description: 'Шиномонтаж и программирование датчиков',
    icon: Wrench,
    href: '/catalog/services',
    image: null,
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
]

export function CatalogShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Наш каталог
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
            Всё для ваших колёс
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Выберите интересующий раздел. Качественные товары и профессиональные услуги 
            для вашего автомобиля.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className="group overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Image Area */}
                <div className={`relative h-40 flex items-center justify-center overflow-hidden bg-gradient-to-br ${category.bgGradient}`}>
                  {/* Decorative circles */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${category.gradient} opacity-10 group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className={`absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-br ${category.gradient} opacity-10 group-hover:scale-150 transition-transform duration-700`}></div>
                  
                  {category.image ? (
                    <div className="relative w-28 h-28 z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                  ) : (
                    <div className={`p-6 rounded-full bg-gradient-to-br ${category.gradient} text-white z-10 group-hover:scale-110 transition-transform duration-500`}>
                      <category.icon className="w-12 h-12" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.gradient} text-white`}>
                      <category.icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold">{category.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <Link href={category.href}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                    >
                      Перейти
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/catalog">
            <Button size="lg" className="gap-2">
              Смотреть весь каталог
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
