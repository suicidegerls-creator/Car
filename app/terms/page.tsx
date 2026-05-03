import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, FileText, Phone, Mail, AlertCircle, Shield, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Условия использования | ДискиБел",
  description: "Условия использования сайта ДискиБел. Информация о публичной оферте и правилах пользования.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" />
              На главную
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Условия использования
              </h1>
              <p className="text-muted-foreground mt-1">
                Правовая информация о сайте
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Main Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Сайт не является публичной офертой
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Информация, размещенная на сайте, не является публичной офертой!
              </p>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="space-y-8">
          
          {/* Section 1 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">1</span>
              Информационный характер сайта
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Обращаем ваше внимание на то, что данный интернет-сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями ст. 405 Гражданского кодекса Республики Беларусь.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">2</span>
              Уточнение информации
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Для получения подробной информации о наличии и стоимости указанных товаров и (или) услуг, пожалуйста, обращайтесь к менеджеру сайта:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="tel:+375296576960">
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="w-4 h-4" />
                  +375 (29) 657-69-60
                </Button>
              </Link>
              <Link href="tel:+375296889188">
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="w-4 h-4" />
                  +375 (29) 688-91-88
                </Button>
              </Link>
              <Link href="/contacts">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Обратная связь
                </Button>
              </Link>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">3</span>
              Технические характеристики и цены
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Вся представленная на сайте информация, касающаяся технических характеристик, наличия, стоимости товара и условий оказания услуг, носит информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями ст. 405 Гражданского кодекса Республики Беларусь.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">4</span>
              Оформление заказов
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Нажатие на кнопку «рассчитать стоимость», «заказать», «перейти к оформлению заказа», а также последующее заполнение тех или иных форм, не накладывает на владельцев сайта никаких обязательств.
              </p>
              <p>
                Присланное по e-mail сообщение, содержащее копию заполненной формы заявки на сайте, не является ответом на сообщение потребителя или подтверждением заказа со стороны владельцев сайта.
              </p>
            </div>
          </section>

          {/* Section 5 - Personal Data */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Персональные данные
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Регистрируясь на сайте или оставляя тем или иным способом свою персональную информацию, Вы делегируете право сотрудникам компании обрабатывать вашу персональную информацию.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 - Analytics */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Аналитика и статистика
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Для аналитических целей на сайте работает система статистики, которая собирает информацию о посещенных страницах сайта, заполненных формах и т.д. Сотрудники компании имеют доступ к этой информации.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptance Notice */}
          <section className="bg-foreground text-background rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Принятие условий
                </h3>
                <p className="text-background/80 leading-relaxed">
                  Оформляя заказ на сайте, или иным способом становясь клиентом нашей компании, вы принимаете данные условия сотрудничества с нами.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Есть вопросы по условиям использования?
          </p>
          <Link href="/contacts">
            <Button variant="outline">
              Связаться с нами
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Не является публичной офертой, носит информационный характер
          </p>
        </div>
      </div>
    </main>
  )
}
