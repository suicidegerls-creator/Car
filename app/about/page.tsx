import type { Metadata } from 'next'
import { Shield, Award, Users, Truck, CheckCircle, Star, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'О компании | ДискиБел - Премиальные литые диски',
  description: 'ДискиБел - ваш надежный партнер в мире премиальных литых дисков. Оригинальная продукция от ведущих мировых производителей. Профессиональные консультации и гарантия качества.',
  openGraph: {
    title: 'О компании ДискиБел',
    description: 'Премиальные литые диски от ведущих мировых производителей в Минске.',
    type: 'website',
  },
}

const features = [
  {
    icon: Shield,
    title: 'Гарантия подлинности',
    description: 'Мы работаем напрямую с официальными дистрибьюторами и гарантируем 100% оригинальность каждого диска в нашем каталоге.',
  },
  {
    icon: Award,
    title: 'Премиальное качество',
    description: 'В нашем ассортименте только проверенные бренды: Techline, RST, K&K, SKAD, iFree, Alcasta и другие.',
  },
  {
    icon: Users,
    title: 'Экспертные консультации',
    description: 'Наши специалисты помогут подобрать идеальные диски под ваш автомобиль с учетом всех технических параметров.',
  },
  {
    icon: Truck,
    title: 'Удобная доставка',
    description: 'Доставляем по всей Беларуси. Возможен самовывоз из нашего магазина в АвтоМолле.',
  },
]

const stats = [
  { value: '500+', label: 'Моделей дисков' },
  { value: '20+', label: 'Премиум брендов' },
  { value: '1000+', label: 'Довольных клиентов' },
  { value: '100%', label: 'Оригинальная продукция' },
]

const brands = [
  'Techline', 'RST', 'Venti', 'K&K', 'SKAD', 'SL', 
  'iFree', 'Alcasta', 'Carwel', 'Vector', 'Megami', 'X-Trike'
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              О компании ДискиБел
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Мы специализируемся на продаже премиальных литых дисков от ведущих мировых 
              производителей. Наша миссия — помочь каждому автовладельцу найти идеальные 
              диски, которые подчеркнут индивидуальность автомобиля и обеспечат безупречное 
              качество на долгие годы.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Мы ценим доверие каждого клиента и делаем всё, чтобы покупка дисков 
              стала приятным и безопасным опытом.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Наши бренды
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Мы представляем лучшие мировые бренды литых дисков, 
              известные своим качеством и инновационным дизайном.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand, index) => (
              <div 
                key={index}
                className="p-4 md:p-6 rounded-xl bg-background border border-border text-center hover:border-primary/50 transition-colors"
              >
                <span className="font-semibold text-foreground">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Наши принципы работы
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                За годы работы мы выработали принципы, которые помогают нам 
                оставаться лучшим выбором для тех, кто ценит качество и надежность.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Только оригинальная продукция от производителей',
                  'Честные цены без скрытых наценок',
                  'Профессиональная консультация перед покупкой',
                  'Помощь в подборе по параметрам автомобиля',
                  'Гарантия на всю продукцию',
                  'Быстрая доставка по всей Беларуси',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 md:p-10">
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
                &ldquo;Наша цель — не просто продать диски, а помочь каждому клиенту 
                сделать правильный выбор. Мы верим, что качественные диски — это 
                инвестиция в безопасность и стиль вашего автомобиля.&rdquo;
              </blockquote>
              <div className="text-muted-foreground">
                — Команда ДискиБел
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Готовы выбрать идеальные диски?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Загляните в наш каталог или свяжитесь с нами для персональной консультации. 
              Мы поможем подобрать диски, которые идеально подойдут вашему автомобилю.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/catalog">
                  Перейти в каталог
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contacts">
                  Связаться с нами
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ДискиБел",
            "description": "Магазин премиальных литых дисков в Минске",
            "url": "https://car-two-beta-48.vercel.app",
            "logo": "https://car-two-beta-48.vercel.app/logo.png",
            "telephone": "+375296576960",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "АвтоМолл, павильон 276, Щомыслицкий сельсовет, 126",
              "addressLocality": "Минск",
              "addressRegion": "Минская область",
              "addressCountry": "BY"
            },
            "sameAs": [
              "https://t.me/+375296576960"
            ]
          })
        }}
      />
    </main>
  )
}
