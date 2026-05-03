import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Layers, Phone, MessageCircle, MoveHorizontal, Car, Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Проставки колёсные | ДискиБел',
  description: 'Колёсные проставки для изменения вылета и расширения колеи автомобиля. Консультация специалистов.',
}

const features = [
  {
    title: 'Расширение колеи',
    description: 'Улучшение устойчивости автомобиля за счёт более широкой колеи',
    icon: MoveHorizontal,
  },
  {
    title: 'Изменение вылета',
    description: 'Корректировка вылета диска для идеальной посадки в арке',
    icon: Car,
  },
  {
    title: 'Точная подгонка',
    description: 'Решение проблем с касанием суппорта или элементов подвески',
    icon: Settings,
  },
]

export default function SpacersPage() {
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
                <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-rose-50 p-8 flex items-center justify-center md:w-1/3">
                  <div className="relative w-48 h-48">
                    <Image
                      src="/images/spacers.png"
                      alt="Колёсные проставки"
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-red-600 p-8 md:p-12 text-white md:w-2/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Layers className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Колёсные проставки</h1>
                  </div>
                  <p className="text-lg text-white/90 max-w-2xl">
                    Проставки позволяют изменить вылет диска, расширить колею автомобиля 
                    и добиться идеального внешнего вида колёс в арках.
                  </p>
                </div>
              </div>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="p-3 bg-rose-500/10 rounded-xl w-fit mb-4 group-hover:bg-rose-500/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-rose-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-500/10 rounded-xl">
                    <Layers className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">О колёсных проставках</h3>
                    <p className="text-muted-foreground mb-4">
                      Колёсные проставки — это специальные кольца, устанавливаемые между ступицей 
                      и диском. Они увеличивают расстояние от центра автомобиля до колеса, 
                      что позволяет добиться различных эффектов.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-card rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-rose-600">Типы проставок:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Тонкие (3-10 мм)</li>
                          <li>• Средние (15-25 мм)</li>
                          <li>• Толстые (30-50 мм)</li>
                          <li>• Со ступицей (болты в комплекте)</li>
                        </ul>
                      </div>
                      <div className="bg-card rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-rose-600">Применение:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Расширение колеи для устойчивости</li>
                          <li>• Установка широких дисков</li>
                          <li>• Коррекция вылета</li>
                          <li>• Тюнинг внешнего вида</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg">
                      <strong className="text-foreground">Важно:</strong> При выборе проставок необходимо учитывать 
                      разболтовку, диаметр ступицы и длину болтов. Неправильный подбор может повлиять 
                      на безопасность. Проконсультируйтесь с нашими специалистами.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
              <CardContent className="p-6 md:p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Подберём проставки под ваш автомобиль</h3>
                <p className="text-muted-foreground mb-6">
                  Наши консультанты помогут выбрать проставки нужной толщины с учётом всех параметров
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-rose-600 hover:bg-rose-700" asChild>
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
