'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  RefreshCw,
  Eye,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  User,
  Loader2,
} from 'lucide-react'

interface SupportRequest {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'closed'
  admin_notes: string | null
  created_at: string
  updated_at: string
}

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  new: { label: 'Новая', variant: 'default' },
  in_progress: { label: 'В работе', variant: 'secondary' },
  closed: { label: 'Закрыта', variant: 'outline' },
}

const SUBJECT_LABELS: Record<string, string> = {
  wheels: 'Подбор дисков',
  order: 'Вопрос по заказу',
  delivery: 'Доставка и оплата',
  other: 'Другое',
}

export function SupportManagement() {
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const res = await fetch(`/api/support?${params}`)
      const data = await res.json()
      setRequests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching support requests:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const openRequest = (request: SupportRequest) => {
    setSelectedRequest(request)
    setAdminNotes(request.admin_notes || '')
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true)
    try {
      await fetch(`/api/support/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchRequests()
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status: status as SupportRequest['status'] })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const saveNotes = async () => {
    if (!selectedRequest) return
    setUpdating(true)
    try {
      await fetch(`/api/support/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      })
      setSelectedRequest({ ...selectedRequest, admin_notes: adminNotes })
    } catch (error) {
      console.error('Error saving notes:', error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteRequest = async (id: string) => {
    if (!confirm('Удалить это обращение?')) return
    try {
      await fetch(`/api/support/${id}`, { method: 'DELETE' })
      fetchRequests()
      if (selectedRequest?.id === id) {
        setSelectedRequest(null)
      }
    } catch (error) {
      console.error('Error deleting request:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const newCount = requests.filter((r) => r.status === 'new').length

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Новые обращения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{newCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              В работе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {requests.filter((r) => r.status === 'in_progress').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего обращений
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{requests.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Таблица */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Обращения в поддержку</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Фильтр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="closed">Закрытые</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchRequests}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Нет обращений
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Тема</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(request.created_at)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.customer_phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{SUBJECT_LABELS[request.subject]}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_LABELS[request.status].variant}>
                        {STATUS_LABELS[request.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openRequest(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRequest(request.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Модальное окно деталей */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Обращение</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              {/* Контактные данные */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{selectedRequest.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`tel:${selectedRequest.customer_phone}`}
                    className="text-primary hover:underline"
                  >
                    {selectedRequest.customer_phone}
                  </a>
                </div>
                {selectedRequest.customer_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedRequest.customer_email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedRequest.customer_email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(selectedRequest.created_at)}
                  </span>
                </div>
              </div>

              {/* Тема и сообщение */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {SUBJECT_LABELS[selectedRequest.subject]}
                  </Badge>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{selectedRequest.message}</p>
                  </div>
                </div>
              </div>

              {/* Статус */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Статус</label>
                <Select
                  value={selectedRequest.status}
                  onValueChange={(v) => updateStatus(selectedRequest.id, v)}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="closed">Закрыта</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Заметки */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Заметки менеджера</label>
                <Textarea
                  placeholder="Внутренние заметки..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
                <Button
                  size="sm"
                  onClick={saveNotes}
                  disabled={updating || adminNotes === (selectedRequest.admin_notes || '')}
                >
                  {updating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Сохранить заметки'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
