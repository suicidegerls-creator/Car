import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CircleDot, Wrench, Gauge, Bolt, Circle, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Каталог | ДискиБел',
  description: 'Каталог товаров и услуг: литые и кованые диски, датчики давления шин, шиномонтаж и программирование датчиков.',
}

const categories = [
  {
    id: 'wheels',
    title: 'Диски',
    description: 'Широкий выбор литых, кованых и штампованных дисков для любых автомобилей',
    icon: CircleDot,
    href: '/catalog/wheels',
    image: '/images/hero-wheel-1.png',
    accent: 'bg-primary/10 text-primary',
    featured: true,
  },
  {
    id: 'sensors',
    title: 'Датчики давления шин',
    description: 'Качественные датчики TPMS для контроля давления в шинах вашего автомобиля',
    icon: Gauge,
    href: '/catalog/sensors',
    image: '/images/tpms-sensor.png',
    accent: 'bg-blue-500/10 text-blue-600',
    featured: false,
  },
  {
    id: 'services',
    title: 'Прочие услуги',
    description: 'Программирование датчиков и профессиональный шиномонтаж',
    icon: Wrench,
    href: '/catalog/services',
    image: null,
    accent: 'bg-emerald-500/10 text-emerald-600',
    featured: false,
  },
  {
    id: 'fasteners',
    title: 'Крепёж',
    description: 'Болты, гайки, секретки и другой крепёж для колёсных дисков',
    icon: Bolt,
    href: '/catalog/fasteners',
    image: '/images/fasteners.png',
    accent: 'bg-amber-500/10 text-amber-600',
    featured: false,
  },
  {
    id: 'hub-rings',
    title: 'Центровочные кольца',
    description: 'Центровочные кольца для точной установки дисков на ступицу',
    icon: Circle,
    href: '/catalog/hub-rings',
    image: '/images/hub-rings.png',
    accent: 'bg-violet-500/10 text-violet-600',
    featured: false,
  },
  {
    id: 'spacers',
    title: 'Проставки',
    description: 'Колёсные проставки для изменения вылета и расширения колеи',
    icon: Layers,
    href: '/catalog/spacers',
    image: '/images/spacers.png',
    accent: 'bg-rose-500/10 text-rose-600',
    featured: false,
  },
]

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
              Каталог товаров и услуг
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Выберите интересующий вас раздел. Мы предлагаем качественные диски, 
              датчики давления шин и профессиональные услуги по обслуживанию.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link key={category.id} href={category.href} className="group">
                <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-0">
                    {/* Image/Icon Area */}
                    <div className={`relative h-48 flex items-center justify-center overflow-hidden ${
                      category.id === 'sensors' 
                        ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100' 
                        : category.id === 'wheels'
                        ? 'bg-gradient-to-br from-orange-50 to-amber-100'
                        : category.id === 'fasteners'
                        ? 'bg-gradient-to-br from-amber-50 via-stone-100 to-amber-50'
                        : category.id === 'hub-rings'
                        ? 'bg-gradient-to-br from-violet-50 via-slate-50 to-violet-50'
                        : category.id === 'spacers'
                        ? 'bg-gradient-to-br from-rose-50 via-slate-50 to-rose-50'
                        : category.accent
                    }`}>
                      {category.image ? (
                        <div className="relative w-32 h-32 group-hover:scale-110 transition-transform duration-500">
                          <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className="object-contain drop-shadow-lg"
                          />
                        </div>
                      ) : (
                        <category.icon className="w-24 h-24 opacity-30 group-hover:scale-110 transition-transform duration-500" />
                      )}
                      {category.featured && (
                        <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                          Популярное
                        </span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${category.accent}`}>
                          <category.icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold">{category.title}</h2>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
                        Перейти в раздел
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Info Banner */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Нужна консультация?</h2>
              <p className="text-muted-foreground mb-6">
                Наши специалисты помогут подобрать диски под ваш автомобиль, 
                проконсультируют по датчикам давления и ответят на все вопросы.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contacts">
                    Связаться с нами
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="tel:+375296576960">
                    +375 (29) 657-69-60
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
