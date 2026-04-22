import type { Metadata } from 'next'
import { Phone, MapPin, Clock, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Контакты | DiskLand - Премиальные литые диски в Минске',
  description: 'Свяжитесь с нами: +375 (29) 657-69-60. Магазин DiskLand в АвтоМолле, павильон 276. Работаем Вт-Вс с 9:00 до 17:00. Консультации по подбору дисков.',
  openGraph: {
    title: 'Контакты | DiskLand',
    description: 'Магазин премиальных литых дисков в Минске. АвтоМолл, павильон 276.',
    type: 'website',
  },
}

export default function ContactsPage() {
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
              Контакты
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Приезжайте к нам в магазин или свяжитесь удобным способом. 
              Мы всегда готовы помочь с выбором идеальных дисков для вашего автомобиля.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Map */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Телефон
                  </h3>
                  <a 
                    href="tel:+375296576960" 
                    className="text-2xl md:text-3xl font-bold text-foreground hover:text-primary transition-colors"
                  >
                    +375 (29) 657-69-60
                  </a>
                  <p className="text-muted-foreground mt-2">
                    Звоните для консультации и оформления заказа
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Адрес
                  </h3>
                  <p className="text-xl md:text-2xl font-semibold text-foreground">
                    АвтоМолл, павильон 276
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Щомыслицкий сельсовет, 126<br />
                    Минский район, Беларусь
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Время работы
                  </h3>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground">
                      Вторник - Воскресенье: 9:00 - 17:00
                    </p>
                    <p className="text-muted-foreground">
                      Понедельник: выходной
                    </p>
                  </div>
                </div>
              </div>

              {/* Messengers */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Мессенджеры
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <a 
                      href="https://t.me/+375296576960" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                      </svg>
                      Telegram
                    </a>
                    <a 
                      href="viber://chat?number=%2B375296576960" 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7360f2]/10 text-[#7360f2] hover:bg-[#7360f2]/20 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.031 1.002c-1.167.008-5.457.124-7.72 2.226C2.066 5.44 1.534 8.616 1.466 12.55c-.068 3.935-.157 11.314 6.924 13.263l.009.002h.005l.002-.01c.056-.178.057-2.25.058-2.667l-.006-.003a7.576 7.576 0 01-1.199-.366 5.033 5.033 0 01-.928-.454 5.476 5.476 0 01-.807-.595 5.88 5.88 0 01-.67-.706 5.53 5.53 0 01-.52-.795c-.254-.47-.443-.985-.525-1.527a.483.483 0 01.128-.4.437.437 0 01.387-.137c.165.025.31.138.371.29.235.587.575 1.104 1.022 1.553.378.38.838.702 1.36.918.527.219 1.084.334 1.64.411.285.039.572.063.862.076.29.013.583.014.878.005.295-.01.592-.03.891-.06.3-.03.6-.072.9-.126.15-.027.3-.058.45-.094.15-.037.299-.078.447-.124a6.418 6.418 0 00.872-.327c.284-.127.56-.276.824-.448.132-.086.26-.178.384-.276.124-.098.245-.2.36-.31.116-.109.226-.224.33-.345.104-.12.202-.247.292-.38a5.6 5.6 0 00.375-.676c.2-.417.336-.88.397-1.372a.567.567 0 01.107-.26.395.395 0 01.218-.148.36.36 0 01.253.025.44.44 0 01.193.194c.18.365.264.787.227 1.22-.024.288-.081.57-.167.842a4.776 4.776 0 01-.604 1.247c-.14.2-.293.392-.46.573-.167.181-.347.35-.54.506-.193.155-.398.298-.615.426a6.545 6.545 0 01-1.359.617c-.237.08-.478.149-.723.206-.245.057-.493.102-.744.136l-.003.003.003.004c.008.495.024 1.94.072 2.41l.003.003.013-.001c2.447-.486 4.317-1.468 5.613-2.933 1.435-1.623 2.197-3.93 2.267-6.857.072-2.99.009-5.383-1.085-7.24-.602-1.02-1.463-1.836-2.497-2.452-1.095-.65-2.35-1.064-3.648-1.298a17.27 17.27 0 00-2.094-.245 21.73 21.73 0 00-1.053-.047l-.265-.003zm-.094 2.084c.35.003.707.018 1.07.047.682.054 1.37.166 2.045.35a7.98 7.98 0 011.867.78c.577.327 1.11.73 1.575 1.21.466.48.862 1.037 1.16 1.658.298.62.496 1.303.575 2.024.039.36.052.728.036 1.1-.016.374-.06.752-.133 1.132a9.07 9.07 0 01-.283 1.083 7.747 7.747 0 01-.43 1.015c-.167.32-.358.628-.574.92a6.923 6.923 0 01-.7.82 7.245 7.245 0 01-.808.707c-.143.107-.29.21-.442.308-.152.099-.308.193-.468.282-.16.09-.325.174-.493.253-.337.157-.687.293-1.048.407a9.96 9.96 0 01-1.103.283c-.19.038-.38.07-.573.097-.192.027-.386.048-.581.063-.39.031-.783.04-1.178.024a10.45 10.45 0 01-1.179-.1 9.65 9.65 0 01-1.155-.233 8.503 8.503 0 01-1.107-.377c-.176-.073-.348-.153-.517-.24a6.59 6.59 0 01-.492-.278 6.242 6.242 0 01-.46-.315c-.149-.112-.293-.231-.432-.356a5.79 5.79 0 01-.758-.82 5.453 5.453 0 01-.58-.949 5.265 5.265 0 01-.38-1.044 5.453 5.453 0 01-.164-1.096c-.02-.371-.009-.747.035-1.12.045-.374.12-.746.225-1.11.106-.366.24-.723.403-1.066.163-.344.354-.674.573-.986.218-.312.463-.607.733-.88a7.14 7.14 0 011.783-1.36 8.188 8.188 0 012.024-.823c.352-.094.712-.167 1.076-.218.365-.05.734-.08 1.105-.086.186-.004.372-.003.559.002z"/>
                      </svg>
                      Viber
                    </a>
                    <a 
                      href="https://wa.me/375296576960" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/catalog">
                    Перейти в каталог
                  </Link>
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="rounded-2xl overflow-hidden border border-border bg-card">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=27.420706%2C53.854045&z=16&pt=27.420706%2C53.854045%2Cpm2rdm"
                    width="100%"
                    height="450"
                    frameBorder="0"
                    allowFullScreen
                    className="w-full"
                    title="Карта расположения магазина DiskLand"
                  />
                </div>
                <div className="mt-4 p-4 rounded-xl bg-card border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Как добраться</h4>
                  <p className="text-sm text-muted-foreground">
                    АвтоМолл расположен на кольцевой дороге. При въезде на территорию двигайтесь 
                    к павильону 276. Удобная парковка рядом со входом.
                  </p>
                  <a 
                    href="https://yandex.ru/maps/?pt=27.420706,53.854045&z=16&l=map"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
                  >
                    <MapPin className="w-4 h-4" />
                    Открыть в Яндекс.Картах
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Остались вопросы?
            </h2>
            <p className="text-muted-foreground mb-8">
              Напишите нам через форму обратной связи или воспользуйтесь виджетом поддержки 
              в правом нижнем углу экрана. Мы ответим в кратчайшие сроки.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="tel:+375296576960">
                  <Phone className="w-5 h-5 mr-2" />
                  Позвонить
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/account/support">
                  Написать в поддержку
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
            "@type": "LocalBusiness",
            "name": "DiskLand",
            "description": "Магазин премиальных литых дисков в Минске",
            "image": "https://car-two-beta-48.vercel.app/logo.png",
            "telephone": "+375296576960",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "АвтоМолл, павильон 276, Щомыслицкий сельсовет, 126",
              "addressLocality": "Минск",
              "addressRegion": "Минская область",
              "addressCountry": "BY"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 53.854045,
              "longitude": 27.420706
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "09:00",
                "closes": "17:00"
              }
            ],
            "url": "https://car-two-beta-48.vercel.app/contacts"
          })
        }}
      />
    </main>
  )
}
