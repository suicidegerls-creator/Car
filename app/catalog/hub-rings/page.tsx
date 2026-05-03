import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Circle, Phone, MessageCircle, Target, Zap, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Центровочные кольца | ДискиБел',
  description: 'Центровочные кольца для точной установки дисков на ступицу. Консультация специалистов.',
}

const benefits = [
  {
    title: 'Точная центровка',
    description: 'Идеальное совпадение центра диска и ступицы для плавного хода',
    icon: Target,
  },
  {
    title: 'Без вибраций',
    description: 'Устранение биения и вибраций на высоких скоростях',
    icon: Zap,
  },
  {
    title: 'Защита ступицы',
    description: 'Равномерное распределение нагрузки на болты крепления',
    icon: Shield,
  },
]

export default function HubRingsPage() {
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
                <div className="bg-gradient-to-br from-violet-50 via-slate-50 to-violet-50 p-8 flex items-center justify-center md:w-1/3">
                  <div className="relative w-48 h-48">
                    <Image
                      src="/images/hub-rings.png"
                      alt="Центровочные кольца"
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 p-8 md:p-12 text-white md:w-2/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Circle className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Центровочные кольца</h1>
                  </div>
                  <p className="text-lg text-white/90 max-w-2xl">
                    Центровочные кольца обеспечивают точную посадку диска на ступицу, 
                    устраняя вибрации и обеспечивая плавность хода автомобиля.
                  </p>
                </div>
              </div>
            </Card>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="p-3 bg-violet-500/10 rounded-xl w-fit mb-4 group-hover:bg-violet-500/20 transition-colors">
                      <benefit.icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-500/10 rounded-xl">
                    <Circle className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">Зачем нужны центровочные кольца?</h3>
                    <p className="text-muted-foreground mb-4">
                      Центровочные кольца устанавливаются между ступицей автомобиля и диском. 
                      Они компенсируют разницу между диаметром центрального отверстия диска 
                      и диаметром ступицы, обеспечивая идеальную центровку колеса.
                    </p>
                    <div className="bg-card rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-2">Когда необходимы кольца:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                          Отверстие диска больше диаметра ступицы
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                          Появление вибрации на скорости
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                          Установка неоригинальных дисков
                        </li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Материалы:</strong> пластиковые (лёгкие, не подвержены коррозии) 
                      и алюминиевые (прочные, для высоких нагрузок).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
              <CardContent className="p-6 md:p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Подберём кольца под ваши диски</h3>
                <p className="text-muted-foreground mb-6">
                  Сообщите нам размеры ступицы и диска, и мы подберём нужные центровочные кольца
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-700" asChild>
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
