'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Car, RefreshCw, Copy, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CarBrand {
  id: string
  name: string
  logo_url?: string
}

interface CarModel {
  id: string
  brand_id: string
  name: string
  year_from?: number
  year_to?: number
  pcd?: string
  center_bore?: number
  diameter_min?: number
  diameter_max?: number
  width_min?: number
  width_max?: number
  et_min?: number
  et_max?: number
  bolts_count?: number
  car_brands?: CarBrand
}

interface CarModelFormData {
  brand_id: string
  name: string
  year_from?: number
  year_to?: number
  pcd: string
  center_bore?: number
  diameter_min?: number
  diameter_max?: number
  width_min?: number
  width_max?: number
  et_min?: number
  et_max?: number
  bolts_count?: number
}

const COMMON_PCD = [
  '4x98', '4x100', '4x108', '4x114.3',
  '5x100', '5x105', '5x108', '5x110', '5x112', '5x114.3', '5x115', '5x120', '5x127', '5x130', '5x139.7',
  '6x114.3', '6x127', '6x139.7'
]

export function CarsManagement() {
  const [brands, setBrands] = useState<CarBrand[]>([])
  const [models, setModels] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreateBrandOpen, setIsCreateBrandOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<CarModel | null>(null)
  const [newBrandName, setNewBrandName] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CarModelFormData>({
    brand_id: '',
    name: '',
    pcd: '',
  })

  const supabase = createClient()

  const fetchBrands = useCallback(async () => {
    const { data } = await supabase
      .from('car_brands')
      .select('*')
      .order('name')
    setBrands(data || [])
  }, [supabase])

  const fetchModels = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('car_models')
        .select('*, car_brands(id, name, logo_url)')
        .order('name')

      if (selectedBrand && selectedBrand !== 'all') {
        query = query.eq('brand_id', selectedBrand)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, selectedBrand, search])

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  const resetForm = () => {
    setFormData({
      brand_id: '',
      name: '',
      pcd: '',
    })
  }

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) return

    try {
      const { error } = await supabase
        .from('car_brands')
        .insert({ name: newBrandName.trim() })

      if (error) throw error

      setNewBrandName('')
      setIsCreateBrandOpen(false)
      fetchBrands()
    } catch (error) {
      console.error('Error creating brand:', error)
      alert('Ошибка при создании марки')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.brand_id || !formData.name) {
      alert('Заполните обязательные поля: марка и модель')
      return
    }

    try {
      const modelData = {
        brand_id: formData.brand_id,
        name: formData.name.trim(),
        year_from: formData.year_from || null,
        year_to: formData.year_to || null,
        pcd: formData.pcd || null,
        center_bore: formData.center_bore || null,
        diameter_min: formData.diameter_min || null,
        diameter_max: formData.diameter_max || null,
        width_min: formData.width_min || null,
        width_max: formData.width_max || null,
        et_min: formData.et_min || null,
        et_max: formData.et_max || null,
        bolts_count: formData.bolts_count || null,
      }

      if (editingModel) {
        const { error } = await supabase
          .from('car_models')
          .update(modelData)
          .eq('id', editingModel.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('car_models')
          .insert(modelData)

        if (error) throw error
      }

      setIsCreateOpen(false)
      setEditingModel(null)
      resetForm()
      fetchModels()
    } catch (error) {
      console.error('Error saving model:', error)
      alert('Ошибка при сохранении модели')
    }
  }

  const handleEdit = (model: CarModel) => {
    setFormData({
      brand_id: model.brand_id,
      name: model.name,
      year_from: model.year_from,
      year_to: model.year_to,
      pcd: model.pcd || '',
      center_bore: model.center_bore,
      diameter_min: model.diameter_min,
      diameter_max: model.diameter_max,
      width_min: model.width_min,
      width_max: model.width_max,
      et_min: model.et_min,
      et_max: model.et_max,
      bolts_count: model.bolts_count,
    })
    setEditingModel(model)
    setIsCreateOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту модель?')) return

    try {
      const { error } = await supabase
        .from('car_models')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchModels()
    } catch (error) {
      console.error('Error deleting model:', error)
      alert('Ошибка при удалении модели')
    }
  }

  const handleCopyParams = (model: CarModel) => {
    setFormData(prev => ({
      ...prev,
      pcd: model.pcd || '',
      center_bore: model.center_bore,
      diameter_min: model.diameter_min,
      diameter_max: model.diameter_max,
      width_min: model.width_min,
      width_max: model.width_max,
      et_min: model.et_min,
      et_max: model.et_max,
      bolts_count: model.bolts_count,
    }))
    setCopiedId(model.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const hasParams = (model: CarModel) => {
    return model.pcd || model.center_bore || model.diameter_min
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего марок
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{brands.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего моделей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{models.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              С параметрами
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {models.filter(hasParams).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по модели..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все марки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все марки</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchModels}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
          <Dialog open={isCreateBrandOpen} onOpenChange={setIsCreateBrandOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Марка
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить марку</DialogTitle>
                <DialogDescription>
                  Введите название новой марки автомобиля
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название марки</Label>
                  <Input
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Например: Toyota"
                  />
                </div>
                <Button onClick={handleCreateBrand} className="w-full">
                  Добавить марку
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog 
            open={isCreateOpen} 
            onOpenChange={(open) => {
              setIsCreateOpen(open)
              if (!open) {
                setEditingModel(null)
                resetForm()
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Модель
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingModel ? 'Редактировать модель' : 'Добавить модель'}
                </DialogTitle>
                <DialogDescription>
                  Укажите модель и параметры совместимости с дисками
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Основная информация */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Основная информация</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Марка *</Label>
                      <Select
                        value={formData.brand_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, brand_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите марку" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Модель *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Например: Camry"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Год выпуска (от)</Label>
                      <Input
                        type="number"
                        value={formData.year_from || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, year_from: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="2018"
                      />
                    </div>
                    <div>
                      <Label>Год выпуска (до)</Label>
                      <Input
                        type="number"
                        value={formData.year_to || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, year_to: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                </div>

                {/* Параметры совместимости */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Параметры совместимости</h3>
                    {models.filter(hasParams).length > 0 && !editingModel && (
                      <Select onValueChange={(id) => {
                        const model = models.find(m => m.id === id)
                        if (model) handleCopyParams(model)
                      }}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Копировать из..." />
                        </SelectTrigger>
                        <SelectContent>
                          {models.filter(hasParams).map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.car_brands?.name} {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Разболтовка (PCD)</Label>
                      <Select
                        value={formData.pcd}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, pcd: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите PCD" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_PCD.map((pcd) => (
                            <SelectItem key={pcd} value={pcd}>
                              {pcd}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Кол-во болтов</Label>
                      <Select
                        value={formData.bolts_count?.toString() || ''}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, bolts_count: value ? Number(value) : undefined }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Центральное отверстие (ЦО), мм</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.center_bore || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, center_bore: e.target.value ? Number(e.target.value) : undefined }))}
                      placeholder="60.1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Диаметр (мин)</Label>
                      <Input
                        type="number"
                        value={formData.diameter_min || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, diameter_min: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="16"
                      />
                    </div>
                    <div>
                      <Label>Диаметр (макс)</Label>
                      <Input
                        type="number"
                        value={formData.diameter_max || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, diameter_max: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="19"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Ширина (мин), J</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={formData.width_min || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, width_min: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="6.5"
                      />
                    </div>
                    <div>
                      <Label>Ширина (макс), J</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={formData.width_max || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, width_max: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="8.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Вылет ET (мин)</Label>
                      <Input
                        type="number"
                        value={formData.et_min || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, et_min: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="35"
                      />
                    </div>
                    <div>
                      <Label>Вылет ET (макс)</Label>
                      <Input
                        type="number"
                        value={formData.et_max || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, et_max: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="50"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingModel ? 'Сохранить изменения' : 'Добавить модель'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Car className="w-4 h-4" />
            Как работает автоматический подбор
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Заполните параметры совместимости для моделей авто. При поиске дисков по автомобилю система автоматически найдет все диски с подходящими параметрами (PCD, ЦО, диаметр, ширина, вылет).
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Загрузка...
            </div>
          ) : models.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Модели не найдены. Добавьте первую модель!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Марка</TableHead>
                  <TableHead>Модель</TableHead>
                  <TableHead>Годы</TableHead>
                  <TableHead>PCD</TableHead>
                  <TableHead>ЦО</TableHead>
                  <TableHead>Диаметр</TableHead>
                  <TableHead>Ширина</TableHead>
                  <TableHead>Вылет</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">
                      {model.car_brands?.name}
                    </TableCell>
                    <TableCell>{model.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {model.year_from && model.year_to
                        ? `${model.year_from}-${model.year_to}`
                        : model.year_from
                        ? `с ${model.year_from}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {model.pcd ? (
                        <Badge variant="secondary">{model.pcd}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {model.center_bore || '-'}
                    </TableCell>
                    <TableCell>
                      {model.diameter_min && model.diameter_max
                        ? `R${model.diameter_min}-R${model.diameter_max}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {model.width_min && model.width_max
                        ? `${model.width_min}-${model.width_max}J`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {model.et_min !== null && model.et_max !== null
                        ? `ET${model.et_min}-${model.et_max}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyParams(model)}
                          title="Копировать параметры"
                          disabled={!hasParams(model)}
                        >
                          {copiedId === model.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(model)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(model.id)}
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
    </div>
  )
}
