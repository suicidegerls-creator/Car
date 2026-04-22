import type { Metadata } from 'next'
import { Truck, MapPin, CreditCard, Banknote, Clock, CheckCircle, HelpCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Доставка и оплата | DiskLand - Премиальные литые диски',
  description: 'Бесплатный самовывоз из АвтоМолла. Доставка по Минску и всей Беларуси. Оплата наличными, картой или безналичный расчет. Рассрочка до 12 месяцев.',
  openGraph: {
    title: 'Доставка и оплата | DiskLand',
    description: 'Условия доставки и способы оплаты литых дисков в магазине DiskLand.',
    type: 'website',
  },
}

const deliveryOptions = [
  {
    icon: MapPin,
    title: 'Самовывоз',
    price: 'Бесплатно',
    description: 'Заберите заказ из нашего магазина в АвтоМолле, павильон 276. Работаем Вт-Вс с 9:00 до 17:00.',
    features: [
      'Осмотр товара перед покупкой',
      'Консультация специалиста',
      'Помощь с погрузкой',
    ],
  },
  {
    icon: Truck,
    title: 'Доставка по Минску',
    price: 'от 20 BYN',
    description: 'Курьерская доставка по Минску в удобное для вас время. Доставка в день заказа при наличии товара.',
    features: [
      'Доставка до двери',
      'Выбор удобного времени',
      'Проверка при получении',
    ],
  },
  {
    icon: Truck,
    title: 'Доставка по Беларуси',
    price: 'от 30 BYN',
    description: 'Отправляем транспортными компаниями в любой город Беларуси. Срок доставки 1-3 рабочих дня.',
    features: [
      'Надежная упаковка',
      'Страхование груза',
      'Отслеживание посылки',
    ],
  },
]

const paymentOptions = [
  {
    icon: Banknote,
    title: 'Наличными',
    description: 'Оплата наличными при получении заказа в магазине или курьеру.',
  },
  {
    icon: CreditCard,
    title: 'Банковской картой',
    description: 'Принимаем карты Visa, Mastercard, Белкарт. Оплата при получении или онлайн.',
  },
  {
    icon: CreditCard,
    title: 'Безналичный расчет',
    description: 'Для юридических лиц и ИП. Выставляем счет, работаем с НДС.',
  },
  {
    icon: Clock,
    title: 'Рассрочка',
    description: 'Оформление рассрочки до 12 месяцев через банки-партнеры. Без переплат.',
  },
]

const faqItems = [
  {
    question: 'Сколько времени занимает доставка?',
    answer: 'По Минску — в день заказа или на следующий день. По Беларуси — 1-3 рабочих дня в зависимости от города.',
  },
  {
    question: 'Можно ли примерить диски перед покупкой?',
    answer: 'Да, вы можете приехать к нам в магазин и осмотреть диски, а также получить консультацию специалиста по подбору.',
  },
  {
    question: 'Как оформить рассрочку?',
    answer: 'Рассрочка оформляется в магазине при наличии паспорта. Решение по заявке — в течение 15 минут. Первоначальный взнос от 0%.',
  },
  {
    question: 'Работаете ли вы с юридическими лицами?',
    answer: 'Да, мы работаем с юридическими лицами и ИП. Выставляем счет, предоставляем все закрывающие документы.',
  },
  {
    question: 'Есть ли бесплатная доставка?',
    answer: 'Самовывоз из нашего магазина всегда бесплатный. При заказе от определенной суммы возможна бесплатная доставка по Минску — уточняйте у консультанта.',
  },
]

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Доставка и оплата
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Мы предлагаем удобные способы получения заказа и гибкие варианты оплаты. 
              Выберите подходящий вариант, и мы позаботимся о том, чтобы ваши диски 
              были доставлены в целости и сохранности.
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Способы доставки
          </h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {deliveryOptions.map((option, index) => (
              <div 
                key={index}
                className="p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {option.title}
                </h3>
                
                <div className="text-2xl font-bold text-primary mb-4">
                  {option.price}
                </div>
                
                <p className="text-muted-foreground mb-6">
                  {option.description}
                </p>
                
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Способы оплаты
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentOptions.map((option, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-background border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <option.icon className="w-5 h-5 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {option.title}
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Частые вопросы
              </h2>
              <p className="text-lg text-muted-foreground">
                Ответы на популярные вопросы о доставке и оплате
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {item.question}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Остались вопросы?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Свяжитесь с нами — мы подробно расскажем обо всех условиях доставки 
              и поможем выбрать оптимальный вариант.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="tel:+375296576960">
                  +375 (29) 657-69-60
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contacts">
                  Все контакты
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
            "@type": "WebPage",
            "name": "Доставка и оплата | DiskLand",
            "description": "Условия доставки и способы оплаты литых дисков",
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": faqItems.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.answer
                }
              }))
            }
          })
        }}
      />
    </main>
  )
}
