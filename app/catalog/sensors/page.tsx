import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Gauge, ShieldCheck, Car, Phone, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Датчики давления шин | ДискиБел',
  description: 'Качественные датчики TPMS для контроля давления в шинах. Установка и программирование под ваш автомобиль.',
}

const features = [
  {
    icon: ShieldCheck,
    title: 'Безопасность',
    description: 'Мгновенное оповещение о падении давления предотвращает аварийные ситуации',
  },
  {
    icon: Gauge,
    title: 'Точность',
    description: 'Высокоточные датчики с погрешностью измерения менее 1%',
  },
  {
    icon: Car,
    title: 'Совместимость',
    description: 'Подберем датчики, совместимые именно с вашим автомобилем',
  },
]

export default function SensorsPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/catalog" className="hover:text-foreground transition-colors">
              Каталог
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Датчики давления шин</span>
          </nav>

          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Gauge className="w-4 h-4" />
                Система TPMS
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                Датчики давления шин
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Датчики давления в шинах (TPMS) — это важный элемент безопасности вашего автомобиля. 
                Они в реальном времени отслеживают давление в каждом колесе и предупреждают водителя 
                о любых отклонениях от нормы.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/contacts">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Узнать подробнее
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="tel:+375291234567">
                    <Phone className="w-5 h-5 mr-2" />
                    Позвонить
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Sensor Card */}
            <div className="relative">
              <Card className="overflow-hidden border-2 hover:border-blue-500/30 transition-colors">
                <CardContent className="p-0">
                  <div className="relative p-8 flex items-center justify-center min-h-[300px] overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-white">
                    <div className="relative w-48 h-48 md:w-64 md:h-64">
                      <Image
                        src="/images/tpms-sensor.png"
                        alt="Датчик давления шин TPMS"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-card">
                    <h3 className="text-xl font-semibold mb-2">Датчик давления TPMS</h3>
                    <p className="text-muted-foreground mb-4">
                      Универсальные и оригинальные датчики для всех марок автомобилей
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Цена уточняется у консультанта</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-500/20 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/20">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <Gauge className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Зачем нужны датчики давления?
                </h2>
                <div className="text-muted-foreground space-y-4 text-left md:text-center">
                  <p>
                    Правильное давление в шинах — это не только комфорт, но и безопасность. 
                    Недокачанные шины увеличивают тормозной путь, ухудшают управляемость и 
                    повышают расход топлива. Перекачанные — снижают сцепление с дорогой.
                  </p>
                  <p>
                    Датчики TPMS автоматически контролируют давление и температуру в каждом колесе, 
                    мгновенно предупреждая вас о любых проблемах через индикатор на приборной панели.
                  </p>
                </div>
                
                <div className="mt-8 p-6 bg-background rounded-xl border">
                  <p className="text-lg font-medium mb-2">
                    Хотите узнать больше?
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Все уточнения по наличию, совместимости и стоимости датчиков 
                    вы можете узнать у наших консультантов.
                  </p>
                  <Button asChild>
                    <Link href="/contacts">
                      Связаться с консультантом
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
