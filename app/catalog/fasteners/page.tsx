import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Bolt, Phone, MessageCircle, ShieldCheck, Wrench, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Крепёж для дисков | ДискиБел',
  description: 'Болты, гайки, секретки и другой крепёж для колёсных дисков. Консультация специалистов.',
}

const fastenerTypes = [
  {
    title: 'Болты колёсные',
    description: 'Различные размеры и типы головок для всех марок автомобилей',
    icon: Bolt,
  },
  {
    title: 'Гайки колёсные',
    description: 'Открытые и закрытые гайки с разными типами посадочных мест',
    icon: Package,
  },
  {
    title: 'Секретки',
    description: 'Защита ваших дисков от кражи с уникальным ключом',
    icon: ShieldCheck,
  },
]

export default function FastenersPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад в каталог
          </Link>
        </div>

        {/* Hero */}
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <Card className="overflow-hidden mb-8">
              <div className="md:flex">
                <div className="bg-gradient-to-br from-amber-50 via-stone-100 to-amber-50 p-8 flex items-center justify-center md:w-1/3">
                  <div className="relative w-48 h-48">
                    <Image
                      src="/images/fasteners.png"
                      alt="Колёсные болты"
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-8 md:p-12 text-white md:w-2/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Bolt className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Крепёж для дисков</h1>
                  </div>
                  <p className="text-lg text-white/90 max-w-2xl">
                    Качественный крепёж — залог безопасности на дороге. У нас в наличии 
                    болты, гайки и секретки для любых колёсных дисков.
                  </p>
                </div>
              </div>
            </Card>

            {/* Product Types */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {fastenerTypes.map((type, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="p-3 bg-amber-500/10 rounded-xl w-fit mb-4 group-hover:bg-amber-500/20 transition-colors">
                      <type.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                    <p className="text-muted-foreground text-sm">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <Wrench className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">Подбор крепежа</h3>
                    <p className="text-muted-foreground mb-4">
                      Для правильного подбора крепежа важно знать параметры ваших дисков и ступицы: 
                      диаметр резьбы, шаг, длину болта и тип посадочного места (конус, сфера, плоское). 
                      Наши консультанты помогут определить нужный размер и подобрать оптимальный вариант.
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-6">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        Болты и гайки разных размеров (M12, M14 и др.)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        Различные типы головок: конус, сфера, плоские
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        Секретки с уникальным ключом для защиты от кражи
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        Хромированные и чёрные варианты
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-6 md:p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Нужна помощь с выбором?</h3>
                <p className="text-muted-foreground mb-6">
                  Свяжитесь с нашими консультантами для подбора крепежа под ваш автомобиль
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href="/contacts">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Связаться с нами
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="tel:+375296576960">
                      <Phone className="w-4 h-4 mr-2" />
                      +375 (29) 657-69-60
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
