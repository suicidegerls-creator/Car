import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield, Database, Cookie, Eye, UserCheck, Mail, Lock, Server, Trash2, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Политика конфиденциальности | ДискиБел",
  description: "Политика конфиденциальности интернет-сайта автомобильных дисков ДискиБел",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground break-words">
                Политика конфиденциальности
              </h1>
              <p className="text-muted-foreground mt-1">
                Последнее обновление: 27 апреля 2026 г.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Intro */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
          <p className="text-foreground leading-relaxed">
            Настоящая Политика конфиденциальности описывает, как интернет-сайт <strong>ДискиБел</strong> (далее — «мы», «наш», «Компания») собирает, использует и защищает персональные данные пользователей сайта. Используя наш сайт, вы соглашаетесь с условиями данной Политики.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          
          {/* Section 1 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">1. Какие данные мы собираем</h2>
              </div>
            </div>
            <div className="ml-14 space-y-4 text-muted-foreground">
              <p>Мы можем собирать следующую информацию:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-foreground">Контактные данные:</strong> имя, номер телефона, адрес электронной почты</li>
                <li><strong className="text-foreground">Данные для доставки:</strong> адрес доставки, город, почтовый индекс</li>
                <li><strong className="text-foreground">Данные автомобиля:</strong> марка, модель, год выпуска, параметры дисков</li>
                <li><strong className="text-foreground">Технические данные:</strong> IP-адрес, тип браузера, операционная система, данные об устройстве</li>
                <li><strong className="text-foreground">Данные об использовании:</strong> просмотренные страницы, время на сайте, действия пользователя</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">2. Цели сбора данных</h2>
              </div>
            </div>
            <div className="ml-14 space-y-4 text-muted-foreground">
              <p>Собранные данные используются для:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Обработки предварительных списков товаров</li>
                <li>Связи с вами по вопросам подбора товаров</li>
                <li>Предоставления консультаций по подбору дисков</li>
                <li>Улучшения работы сайта и пользовательского опыта</li>
                <li>Отправки информации о новинках и акциях (с вашего согласия)</li>
                <li>Анализа статистики посещаемости</li>
                <li>Предотвращения мошенничества</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">3. Файлы cookie</h2>
              </div>
            </div>
            <div className="ml-14 space-y-4 text-muted-foreground">
              <p>Наш сайт использует файлы cookie для:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-foreground">Необходимые cookie:</strong> обеспечивают работу корзины и авторизации</li>
                <li><strong className="text-foreground">Аналитические cookie:</strong> помогают понять, как посетители используют сайт</li>
                <li><strong className="text-foreground">Функциональные cookie:</strong> запоминают ваши предпочтения (выбранный автомобиль, фильтры)</li>
              </ul>
              <p className="mt-4">
                Вы можете отключить cookie в настройках браузера, однако это может повлиять на функциональность сайта.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">4. Защита данных</h2>
              </div>
            </div>
            <div className="ml-14 space-y-4 text-muted-foreground">
              <p>Мы принимаем все необходимые меры для защиты ваших персональных данных:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Использование SSL-шифрования при передаче данных</li>
                <li>Ограниченный доступ сотрудников к персональным данным</li>
                <li>Регулярное обновление систем безопасности</li>
                <li>Хранение данных на защищённых серверах</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Server className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">5. Передача данных третьим лицам</h2>
              </div>
            </div>
            <div className="ml-14 space-y-4 text-muted-foreground">
              <p>Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-foreground">Службы доставки:</strong> для доставки товаров</li>
                <li><strong className="text-foreground">Государственные органы:</strong> по законному требованию</li>
              </ul>
              <p className="mt-4">
                Все партнёры обязуются соблюдать конфиденциальность данных.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">6. Ваши права</h2>
              </div>
            </div>
            <div className="ml-14 space-y-4 text-muted-foreground">
              <p>Вы имеете право:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Получить информацию о хранящихся у нас ваших данных</li>
                <li>Потребовать исправления неточных данных</li>
                <li>Запросить удаление ваших персональных данных</li>
                <li>Отозвать согласие на обработку данных</li>
                <li>Отказаться от получения рекламных рассылок</li>
              </ul>
              <p className="mt-4">
                Для реализации этих прав свяжитесь с нами любым удобным способом.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">7. Сроки хранения данных</h2>
              </div>
            </div>
            <div className="ml-14 space-y-4 text-muted-foreground">
              <p>Мы храним персональные данные:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-foreground">Данные о товарах:</strong> в течение 3 лет (для гарантийного обслуживания)</li>
                <li><strong className="text-foreground">Данные аккаунта:</strong> до удаления аккаунта пользователем</li>
                <li><strong className="text-foreground">Cookie и аналитика:</strong> до 1 года</li>
              </ul>
              <p className="mt-4">
                После истечения сроков данные удаляются или обезличиваются.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">8. Изменения политики</h2>
              </div>
            </div>
            <div className="ml-14 text-muted-foreground">
              <p>
                Мы оставляем за собой право изменять данную Политику конфиденциальности. 
                Актуальная версия всегда доступна на этой странице. При существенных изменениях 
                мы уведомим вас через сайт или по электронной почте.
              </p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-foreground text-background rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-background/20 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">9. Принятие условий</h2>
              </div>
            </div>
            <div className="ml-14 text-background/80">
              <p>
                Оформляя предварительный список товаров или регистрируясь на сайте, вы подтверждаете, 
                что ознакомились с данной Политикой конфиденциальности и согласны с её условиями.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">10. Контакты</h2>
              </div>
            </div>
            <div className="ml-14 space-y-3 text-muted-foreground">
              <p>По вопросам, связанным с персональными данными, вы можете связаться с нами:</p>
              <div className="space-y-2 mt-4">
                <p><strong className="text-foreground">Телефон:</strong> +375 (29) 657-69-60</p>
                <p><strong className="text-foreground">Telegram:</strong> @diskibel</p>
                <p><strong className="text-foreground">Адрес:</strong> г. Минск, АвтоМолл, павильон 276</p>
              </div>
            </div>
          </section>

        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
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
