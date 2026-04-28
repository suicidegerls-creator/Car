import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Wrench, Cpu, CircleDot, Phone, MessageCircle, CheckCircle2, Clock, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Прочие услуги | ДискиБел',
  description: 'Программирование датчиков давления шин и профессиональный шиномонтаж для клиентов магазина.',
}

const services = [
  {
    id: 'programming',
    icon: Cpu,
    title: 'Программирование датчиков давления шин',
    shortTitle: 'Программирование датчиков',
    description: 'Профессиональная прошивка и привязка датчиков TPMS к системе вашего автомобиля',
    color: 'emerald',
    features: [
      'Программирование под любую марку автомобиля',
      'Привязка новых датчиков к бортовому компьютеру',
      'Перепрограммирование при замене колес',
      'Диагностика существующих датчиков',
      'Клонирование данных со старых датчиков',
    ],
    info: `При замене дисков или покупке новых датчиков давления необходимо 
           их правильно запрограммировать и привязать к системе вашего автомобиля. 
           Наши специалисты используют профессиональное оборудование, которое 
           поддерживает все современные протоколы TPMS. Процедура занимает 
           от 15 до 30 минут в зависимости от марки автомобиля.`,
  },
  {
    id: 'tire-service',
    icon: CircleDot,
    title: 'Шиномонтаж для клиентов',
    shortTitle: 'Шиномонтаж',
    description: 'Профессиональный шиномонтаж при покупке дисков в нашем магазине',
    color: 'orange',
    features: [
      'Снятие и установка колес',
      'Монтаж и демонтаж шин',
      'Балансировка колес',
      'Установка новых дисков',
      'Проверка и подкачка шин',
    ],
    info: `Для удобства наших клиентов мы предлагаем услугу шиномонтажа 
           прямо при покупке дисков. Вам не нужно искать отдельный сервис — 
           наши мастера профессионально установят новые диски на ваш автомобиль, 
           выполнят балансировку и проверят давление. Услуга доступна для 
           клиентов, приобретающих диски в нашем магазине.`,
  },
]

export default function ServicesPage() {
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
            <span className="text-foreground">Прочие услуги</span>
          </nav>

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Wrench className="w-4 h-4" />
              Сервисные услуги
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
              Прочие услуги
            </h1>
            <p className="text-lg text-muted-foreground">
              Помимо продажи дисков, мы предоставляем дополнительные услуги 
              для полного обслуживания вашего автомобиля
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={`overflow-hidden border-2 hover:border-${service.color}-500/30 transition-all duration-300 hover:shadow-xl`}
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className={`p-6 ${service.color === 'emerald' ? 'bg-emerald-500/10' : 'bg-orange-500/10'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${service.color === 'emerald' ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                        <service.icon className={`w-8 h-8 ${service.color === 'emerald' ? 'text-emerald-600' : 'text-orange-600'}`} />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-2">{service.title}</h2>
                        <p className="text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Features List */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                        Что включает услуга
                      </h3>
                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${service.color === 'emerald' ? 'text-emerald-500' : 'text-orange-500'}`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Info Text */}
                    <div className="p-4 bg-muted/50 rounded-xl mb-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.info}
                      </p>
                    </div>
                    
                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1" asChild>
                        <Link href="/contacts">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Узнать подробнее
                        </Link>
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href="tel:+375291234567">
                          <Phone className="w-4 h-4 mr-2" />
                          Позвонить
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Info */}
          <Card className="bg-gradient-to-br from-muted/50 to-transparent">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Быстро</h3>
                  <p className="text-sm text-muted-foreground">
                    Большинство услуг выполняется в течение 30-60 минут
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Качественно</h3>
                  <p className="text-sm text-muted-foreground">
                    Профессиональное оборудование и опытные мастера
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Консультация</h3>
                  <p className="text-sm text-muted-foreground">
                    Ответим на все вопросы и поможем с выбором
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-6 border-t border-border">
                <p className="text-muted-foreground mb-4">
                  Все уточнения по стоимости и записи на услуги вы можете узнать у наших консультантов
                </p>
                <Button size="lg" asChild>
                  <Link href="/contacts">
                    Связаться с нами
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
