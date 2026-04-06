'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, MessageCircle, Plus, ChevronDown, ChevronUp, Send, Headphones } from 'lucide-react'

interface SupportRequest {
  id: string
  subject: string
  message: string
  status: string
  admin_notes: string | null
  created_at: string
}

const SUBJECT_LABELS: Record<string, string> = {
  wheels: 'Подбор дисков',
  order: 'Вопрос по заказу',
  delivery: 'Доставка и оплата',
  other: 'Другое',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новое',
  in_progress: 'В обработке',
  closed: 'Закрыто',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  closed: 'bg-green-100 text-green-800',
}

export default function SupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  })

  const supabase = createClient()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('support_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setRequests(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Получаем профиль для имени и телефона
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, phone')
      .eq('id', user.id)
      .single()

    const { error } = await supabase
      .from('support_requests')
      .insert({
        user_id: user.id,
        customer_name: profile?.first_name || 'Не указано',
        customer_phone: profile?.phone || 'Не указан',
        customer_email: user.email,
        subject: formData.subject,
        message: formData.message,
        status: 'new',
      })

    if (!error) {
      setFormData({ subject: '', message: '' })
      setShowForm(false)
      fetchRequests()
    }

    setSubmitting(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Поддержка</h2>
          <p className="text-muted-foreground">История обращений</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Новое обращение
        </Button>
      </div>

      {/* Форма нового обращения */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Новое обращение</CardTitle>
            <CardDescription>Опишите ваш вопрос, и мы свяжемся с вами</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Тема обращения</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тему" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheels">Подбор дисков</SelectItem>
                    <SelectItem value="order">Вопрос по заказу</SelectItem>
                    <SelectItem value="delivery">Доставка и оплата</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  placeholder="Опишите ваш вопрос подробно..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting || !formData.subject || !formData.message}>
                  {submitting ? (
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
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Список обращений */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Headphones className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Обращений пока нет</h3>
            <p className="text-muted-foreground text-center mb-4">
              Если у вас есть вопрос, создайте обращение
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать обращение
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {SUBJECT_LABELS[request.subject] || request.subject}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(request.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={STATUS_COLORS[request.status] || 'bg-gray-100 text-gray-800'}>
                      {STATUS_LABELS[request.status] || request.status}
                    </Badge>
                    {expandedRequest === request.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedRequest === request.id && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ваше сообщение:</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-md">{request.message}</p>
                    </div>

                    {request.admin_notes && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Ответ поддержки:</p>
                        <p className="text-sm bg-primary/5 p-3 rounded-md border border-primary/20">
                          {request.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
