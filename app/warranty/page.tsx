import type { Metadata } from 'next'
import { Shield, CheckCircle, XCircle, FileText, Phone, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Гарантия и возврат | ДискиБел - Премиальные литые диски',
  description: 'Гарантия на литые диски от 1 года. 100% оригинальная продукция с сертификатами качества. Условия возврата и обмена. Защита ваших покупок.',
  openGraph: {
    title: 'Гарантия и возврат | ДискиБел',
    description: 'Гарантийные условия и политика возврата литых дисков в магазине ДискиБел.',
    type: 'website',
  },
}

const warrantyCovers = [
  'Заводской брак и дефекты материала',
  'Скрытые дефекты литья',
  'Нарушение геометрии диска',
  'Дефекты лакокрасочного покрытия',
  'Несоответствие заявленным характеристикам',
]

const warrantyDoesNotCover = [
  'Механические повреждения (удары, царапины)',
  'Повреждения при неправильном монтаже',
  'Естественный износ',
  'Коррозия из-за использования агрессивных химикатов',
  'Повреждения из-за ДТП',
]

const returnConditions = [
  {
    title: 'Срок возврата',
    description: '14 дней с момента покупки для товара надлежащего качества',
  },
  {
    title: 'Состояние товара',
    description: 'Диски не должны быть установлены, сохранен товарный вид и упаковка',
  },
  {
    title: 'Документы',
    description: 'Необходим чек или иной документ, подтверждающий покупку',
  },
  {
    title: 'Возврат средств',
    description: 'В течение 7 рабочих дней после получения товара',
  },
]

export default function WarrantyPage() {
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
              Гарантия и возврат
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Мы уверены в качестве продаваемых дисков и предоставляем официальную 
              гарантию на всю продукцию. Ваша покупка защищена.
            </p>
          </div>
        </div>
      </section>

      {/* Warranty Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Warranty Card */}
            <div className="p-8 md:p-10 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Гарантия качества</h2>
                  <p className="text-muted-foreground">На все литые диски</p>
                </div>
              </div>

              <div className="text-5xl md:text-6xl font-bold text-primary mb-4">
                от 1 года
              </div>
              
              <p className="text-muted-foreground mb-6">
                Срок гарантии зависит от производителя и модели дисков. 
                Точный срок указан в гарантийном талоне, который вы получаете при покупке.
              </p>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  <strong>Важно:</strong> Все диски в нашем магазине — 100% оригинальная 
                  продукция от официальных дистрибьюторов с полным комплектом документов.
                </p>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="p-8 md:p-10 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Сертификаты</h2>
                  <p className="text-muted-foreground">Подтверждение качества</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">
                Каждый диск в нашем магазине имеет необходимые сертификаты соответствия 
                и проходит строгий контроль качества на производстве.
              </p>

              <ul className="space-y-3">
                {[
                  'Сертификат TUV (Германия)',
                  'Сертификат JWL/VIA (Япония)',
                  'Документы таможенного оформления',
                  'Гарантийный талон производителя',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Что покрывает гарантия
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Covered */}
            <div className="p-6 md:p-8 rounded-2xl bg-background border border-border">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground mb-6">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Гарантия распространяется
              </h3>
              <ul className="space-y-3">
                {warrantyCovers.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Covered */}
            <div className="p-6 md:p-8 rounded-2xl bg-background border border-border">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground mb-6">
                <XCircle className="w-6 h-6 text-red-500" />
                Гарантия не распространяется
              </h3>
              <ul className="space-y-3">
                {warrantyDoesNotCover.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Return Policy */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Возврат и обмен
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Мы ценим каждого клиента и готовы пойти навстречу в случае, 
              если товар вам не подошел.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {returnConditions.map((condition, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {condition.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {condition.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="mt-8 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Обратите внимание
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Диски, изготовленные под заказ или имеющие нестандартные параметры, 
                    возврату не подлежат. Перед заказом таких дисков убедитесь в 
                    правильности выбранных параметров.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Claim */}
      <section className="py-16 md:py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Как оформить гарантийное обращение
            </h2>

            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Свяжитесь с нами',
                  description: 'Позвоните или напишите нам, опишите проблему с диском.',
                },
                {
                  step: '02',
                  title: 'Предоставьте документы',
                  description: 'Подготовьте чек и гарантийный талон, фото дефекта.',
                },
                {
                  step: '03',
                  title: 'Привезите диск',
                  description: 'Доставьте диск в наш магазин для осмотра специалистом.',
                },
                {
                  step: '04',
                  title: 'Получите решение',
                  description: 'В течение 7 дней мы примем решение о ремонте, замене или возврате.',
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Есть вопросы по гарантии?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Свяжитесь с нами — мы подробно расскажем о гарантийных условиях 
              и поможем решить любую проблему.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="tel:+375296576960">
                  <Phone className="w-5 h-5 mr-2" />
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
    </main>
  )
}
