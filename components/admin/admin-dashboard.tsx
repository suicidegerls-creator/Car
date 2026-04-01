'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Package, LogOut, RefreshCw, ShoppingBag, Headphones } from 'lucide-react'
import { Wheel, WHEEL_TYPE_LABELS } from '@/lib/types/wheel'
import { WheelForm } from './wheel-form'
import { OrdersManagement } from './orders-management'
import { SupportManagement } from './support-management'

export function AdminDashboard() {
  const [wheels, setWheels] = useState<Wheel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingWheel, setEditingWheel] = useState<Wheel | null>(null)
  const [total, setTotal] = useState(0)

  const fetchWheels = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (search) params.set('search', search)
      
      const res = await fetch(`/api/wheels?${params}`)
      const json = await res.json()
      setWheels(json.data || [])
      setTotal(json.total || 0)
    } catch (error) {
      console.error('Error fetching wheels:', error)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchWheels()
  }, [fetchWheels])

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот диск?')) return
    
    try {
      console.log('[v0] Deleting wheel:', id)
      const res = await fetch(`/api/wheels/${id}`, { method: 'DELETE' })
      const data = await res.json()
      console.log('[v0] Delete response:', res.status, data)
      
      if (!res.ok) {
        alert(`Ошибка удаления: ${data.error || 'Неизвестная ошибка'}`)
        return
      }
      
      fetchWheels()
    } catch (error) {
      console.error('[v0] Error deleting wheel:', error)
      alert('Ошибка при удалении диска')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    window.location.reload()
  }

  const handleSuccess = () => {
    setIsCreateOpen(false)
    setEditingWheel(null)
    fetchWheels()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="font-bold text-lg">RIMZONE Admin</h1>
              <p className="text-sm text-muted-foreground">Управление каталогом</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Товары
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Обращения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего товаров
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                В наличии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {wheels.filter(w => w.in_stock).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Нет в наличии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {wheels.filter(w => !w.in_stock).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, бренду..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchWheels}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить диск
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Добавить новый диск</DialogTitle>
                </DialogHeader>
                <WheelForm onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Загрузка...
              </div>
            ) : wheels.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Товары не найдены. Добавьте первый диск!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Фото</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead>PCD</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Наличие</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wheels.map((wheel) => (
                    <TableRow key={wheel.id}>
                      <TableCell>
                        {wheel.images?.[0] ? (
                          <img
                            src={wheel.images[0]}
                            alt={wheel.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{wheel.name}</p>
                          <p className="text-sm text-muted-foreground">{wheel.brand}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {WHEEL_TYPE_LABELS[wheel.wheel_type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        R{wheel.diameter} {wheel.width}J
                      </TableCell>
                      <TableCell>{wheel.pcd}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {wheel.price.toLocaleString('be-BY')} BYN
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={wheel.in_stock ? 'default' : 'destructive'}>
                          {wheel.in_stock ? 'В наличии' : 'Нет'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={editingWheel?.id === wheel.id}
                            onOpenChange={(open) => !open && setEditingWheel(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setEditingWheel(wheel)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Редактировать диск</DialogTitle>
                              </DialogHeader>
                              <WheelForm wheel={wheel} onSuccess={handleSuccess} />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(wheel.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>

          <TabsContent value="support">
            <SupportManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
