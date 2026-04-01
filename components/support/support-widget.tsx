'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  MessageCircle,
  X,
  Send,
  Phone,
  CheckCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react'

const SUBJECTS = [
  { value: 'wheels', label: 'Подбор дисков' },
  { value: 'order', label: 'Вопрос по заказу' },
  { value: 'delivery', label: 'Доставка и оплата' },
  { value: 'other', label: 'Другое' },
]

const CONTACTS = [
  {
    name: 'Telegram',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    href: 'https://t.me/rimzone_support',
    color: 'bg-[#0088cc] hover:bg-[#0077b5]'
  },
  {
    name: 'Viber',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.182.518 6.793.377 10.079c-.141 3.287-.083 9.46 5.678 11.085h.004l-.004 2.533s-.039.974.617 1.172c.792.242 1.258-.509 2.015-1.318.415-.445.988-1.098 1.418-1.596 3.9.326 6.9-.418 7.24-.528.783-.254 5.216-.817 5.938-6.665.744-6.032-.36-9.83-2.354-11.539l-.001-.001c-.603-.55-3.013-2.248-8.525-2.218zm.11 1.74c4.668-.024 6.792 1.292 7.271 1.725l.002.001c1.623 1.39 2.476 4.715 1.846 9.846-.576 4.683-4.085 5.094-4.748 5.309-.282.09-2.896.737-6.279.553 0 0-2.486 2.986-3.264 3.768-.122.123-.267.171-.363.149-.135-.031-.172-.18-.171-.399l.024-4.087c-4.556-1.285-4.29-6.095-4.18-8.636.11-2.541.708-4.695 2.149-6.123 1.888-1.73 5.048-2.082 7.713-2.106zm.935 2.838a.358.358 0 0 0-.357.36.36.36 0 0 0 .359.358c1.099.009 2.123.378 2.899 1.095.782.721 1.254 1.726 1.321 2.855a.36.36 0 0 0 .381.336.36.36 0 0 0 .336-.381c-.079-1.32-.639-2.512-1.576-3.374-.93-.858-2.157-1.34-3.458-1.349h-.005zm-3.208 1.46c-.205-.008-.424.032-.596.16l-.019.016c-.244.2-.432.45-.593.713-.191.31-.312.669-.312 1.031 0 .193.04.379.106.556l.004.01c.272.758.677 1.478 1.204 2.134.133.164.27.325.416.479l.013.012.012.014c.153.146.314.283.479.416.656.527 1.376.932 2.134 1.204l.01.004c.177.066.363.106.556.106.362 0 .721-.121 1.031-.312.263-.161.512-.349.713-.593l.016-.019c.256-.345.226-.757.012-1.047a8.074 8.074 0 0 0-.645-.695c-.314-.302-.725-.459-1.06-.315l-.576.238c-.163.067-.361.022-.49-.094a6.098 6.098 0 0 1-.742-.805 5.986 5.986 0 0 1-.597-.9c-.073-.142-.081-.319.013-.46l.315-.527c.159-.291.117-.692-.08-1.017a6.912 6.912 0 0 0-.602-.727c-.196-.203-.507-.319-.774-.318zm3.079.696a.36.36 0 0 0-.073.715c1.143.239 1.997 1.058 2.239 2.147a.36.36 0 0 0 .43.271.36.36 0 0 0 .272-.43c-.3-1.348-1.356-2.366-2.77-2.67a.36.36 0 0 0-.098-.033zm.126 1.418a.358.358 0 0 0-.112.698c.48.14.84.505.952.955a.36.36 0 1 0 .697-.18c-.167-.647-.688-1.166-1.415-1.44a.358.358 0 0 0-.122-.033z"/>
      </svg>
    ),
    href: 'viber://chat?number=%2B375291234567',
    color: 'bg-[#7360f2] hover:bg-[#665acc]'
  },
  {
    name: 'Позвонить',
    icon: <Phone className="w-5 h-5" />,
    href: 'tel:+375291234567',
    color: 'bg-green-600 hover:bg-green-700'
  },
]

type View = 'main' | 'form' | 'success'

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<View>('main')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    subject: 'wheels',
    message: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setView('success')
        setFormData({
          customer_name: '',
          customer_phone: '',
          customer_email: '',
          subject: 'wheels',
          message: '',
        })
      } else {
        const data = await res.json()
        alert(data.error || 'Ошибка отправки')
      }
    } catch (error) {
      alert('Ошибка отправки')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setView('main'), 300)
  }

  return (
    <>
      {/* Кнопка открытия */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Открыть поддержку"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Модальное окно */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Контент */}
          <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                {view !== 'main' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView('main')}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <h2 className="font-semibold">
                  {view === 'main' && 'Связаться с нами'}
                  {view === 'form' && 'Оставить заявку'}
                  {view === 'success' && 'Заявка отправлена'}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Main View */}
            {view === 'main' && (
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Выберите удобный способ связи или оставьте заявку
                </p>

                {/* Быстрая связь */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Быстрая связь
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {CONTACTS.map((contact) => (
                      <a
                        key={contact.name}
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${contact.color} text-white rounded-lg p-3 flex flex-col items-center gap-1.5 transition-colors`}
                      >
                        {contact.icon}
                        <span className="text-xs font-medium">{contact.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Разделитель */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">или</span>
                  </div>
                </div>

                {/* Кнопка формы */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setView('form')}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Оставить заявку
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Режим работы: Пн-Сб 9:00 - 19:00
                </p>
              </div>
            )}

            {/* Form View */}
            {view === 'form' && (
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    placeholder="Ваше имя"
                    value={formData.customer_name}
                    onChange={(e) => handleChange('customer_name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+375 (__) ___-__-__"
                    value={formData.customer_phone}
                    onChange={(e) => handleChange('customer_phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.customer_email}
                    onChange={(e) => handleChange('customer_email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Тема обращения *</Label>
                  <RadioGroup
                    value={formData.subject}
                    onValueChange={(v) => handleChange('subject', v)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {SUBJECTS.map((subject) => (
                      <Label
                        key={subject.value}
                        htmlFor={subject.value}
                        className={`flex items-center justify-center p-2.5 border rounded-lg cursor-pointer text-sm transition-colors ${
                          formData.subject === subject.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <RadioGroupItem
                          value={subject.value}
                          id={subject.value}
                          className="sr-only"
                        />
                        {subject.label}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение *</Label>
                  <Textarea
                    id="message"
                    placeholder="Опишите ваш вопрос..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !formData.customer_name || !formData.customer_phone || !formData.message}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Отправить
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Success View */}
            {view === 'success' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Заявка отправлена!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Мы свяжемся с вами в течение 30 минут в рабочее время
                  </p>
                </div>
                <Button variant="outline" onClick={handleClose}>
                  Закрыть
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
