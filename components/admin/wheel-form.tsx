'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, X, Loader2, Plus, Trash2, Car } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Wheel,
  CarCompatibility,
  WHEEL_TYPE_LABELS,
  PCD_OPTIONS,
  DIAMETER_OPTIONS,
  WIDTH_OPTIONS,
  BRAND_OPTIONS,
  CENTER_BORE_OPTIONS,
  ET_OPTIONS,
  BOLTS_COUNT_OPTIONS,
  COLOR_OPTIONS,
  FINISH_OPTIONS,
  MATERIAL_OPTIONS,
  COUNTRY_OPTIONS,
  CAR_BRANDS,
  CAR_YEARS,
  CAR_MODELS,
} from '@/lib/types/wheel'

interface WheelFormProps {
  wheel?: Wheel
  onSuccess: () => void
}

export function WheelForm({ wheel, onSuccess }: WheelFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(wheel?.images || [])
  const [carCompatibility, setCarCompatibility] = useState<CarCompatibility[]>(
    wheel?.car_compatibility || []
  )
  const [isUniversal, setIsUniversal] = useState(
    wheel?.car_compatibility?.length === 0 || !wheel?.car_compatibility
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: wheel?.name || '',
    brand: wheel?.brand || '',
    model: wheel?.model || '',
    sku: wheel?.sku || '',
    description: wheel?.description || '',
    price: wheel?.price?.toString() || '',
    old_price: wheel?.old_price?.toString() || '',
    in_stock: wheel?.in_stock ?? true,
    quantity: wheel?.quantity?.toString() || '0',
    wheel_type: wheel?.wheel_type || 'cast',
    diameter: wheel?.diameter?.toString() || '17',
    width: wheel?.width?.toString() || '7.0',
    pcd: wheel?.pcd || '5x114.3',
    et: wheel?.et?.toString() || '40',
    center_bore: wheel?.center_bore?.toString() || '67.1',
    bolts_count: wheel?.bolts_count?.toString() || '',
    color: wheel?.color || '',
    finish: wheel?.finish || '',
    material: wheel?.material || '',
    weight: wheel?.weight?.toString() || '',
    country: wheel?.country || '',
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)

    for (const file of Array.from(files)) {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })
        const data = await res.json()
        
        if (!res.ok) {
          alert(`Ошибка загрузки: ${data.error || 'Неизвестная ошибка'}`)
          continue
        }
        
        if (data.url) {
          setImages((prev) => [...prev, data.url])
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Ошибка при загрузке изображения')
      }
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Функции для совместимости с авто
  const addCarCompatibility = () => {
    setCarCompatibility((prev) => [
      ...prev,
      { car_brand: '', car_model: '', car_year_from: undefined, car_year_to: undefined, car_modification: undefined, all_models: false }
    ])
  }

  const toggleUniversal = (checked: boolean) => {
    setIsUniversal(checked)
    if (checked) {
      setCarCompatibility([])
    }
  }

  const updateCarCompatibility = (index: number, field: keyof CarCompatibility, value: string | number | undefined) => {
    setCarCompatibility((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeCarCompatibility = (index: number) => {
    setCarCompatibility((prev) => prev.filter((_, i) => i !== index))
  }

  const getModelsForBrand = (brand: string) => {
    return CAR_MODELS[brand] || []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model || null,
      sku: formData.sku || null,
      description: formData.description || null,
      price: parseFloat(formData.price),
      old_price: formData.old_price ? parseFloat(formData.old_price) : null,
      in_stock: formData.in_stock,
      quantity: parseInt(formData.quantity) || 0,
      wheel_type: formData.wheel_type,
      diameter: parseInt(formData.diameter),
      width: parseFloat(formData.width),
      pcd: formData.pcd,
      et: parseInt(formData.et),
      center_bore: parseFloat(formData.center_bore),
      bolts_count: formData.bolts_count ? parseInt(formData.bolts_count) : null,
      color: formData.color || null,
      finish: formData.finish || null,
      material: formData.material || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      country: formData.country || null,
      images,
      car_compatibility: isUniversal ? [] : carCompatibility.filter(c => c.car_brand && (c.all_models || c.car_model)),
      is_universal: isUniversal,
    }

    try {
      const url = wheel ? `/api/wheels/${wheel.id}` : '/api/wheels'
      const method = wheel ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        onSuccess()
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка сохранения')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Изображения */}
      <div className="space-y-2">
        <Label>Изображения</Label>
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-20 h-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 border-2 border-dashed border-border rounded flex items-center justify-center cursor-pointer hover:border-foreground transition-colors">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="w-5 h-5 text-muted-foreground" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="BBS CI-R 19"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Бренд *</Label>
          <Select value={formData.brand || 'none'} onValueChange={(v) => handleChange('brand', v === 'none' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите бренд" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Выберите бренд</SelectItem>
              {BRAND_OPTIONS.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Модель</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="CI-R"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">Артикул</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="BBS-CIR-19-85"
          />
        </div>
      </div>

      {/* Цена и наличие */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Цена (Р) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="45000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="old_price">Старая цена (Р)</Label>
          <Input
            id="old_price"
            type="number"
            value={formData.old_price}
            onChange={(e) => handleChange('old_price', e.target.value)}
            placeholder="50000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Количество</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>В наличии</Label>
          <div className="pt-2">
            <Switch
              checked={formData.in_stock}
              onCheckedChange={(v) => handleChange('in_stock', v)}
            />
          </div>
        </div>
      </div>

      {/* Технические характеристики */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Технические характеристики</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Тип диска *</Label>
            <Select value={formData.wheel_type} onValueChange={(v) => handleChange('wheel_type', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(WHEEL_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Диаметр *</Label>
            <Select value={formData.diameter} onValueChange={(v) => handleChange('diameter', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIAMETER_OPTIONS.map((d) => (
                  <SelectItem key={d} value={d.toString()}>R{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ширина (J) *</Label>
            <Select value={formData.width} onValueChange={(v) => handleChange('width', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WIDTH_OPTIONS.map((w) => (
                  <SelectItem key={w} value={w}>{w}J</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>PCD (разболтовка) *</Label>
            <Select value={formData.pcd} onValueChange={(v) => handleChange('pcd', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PCD_OPTIONS.map((pcd) => (
                  <SelectItem key={pcd} value={pcd}>{pcd}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Вылет ET *</Label>
            <Select value={formData.et} onValueChange={(v) => handleChange('et', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ET_OPTIONS.map((et) => (
                  <SelectItem key={`et-${et}`} value={et}>ET {et}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>ЦО (мм) *</Label>
            <Select value={formData.center_bore} onValueChange={(v) => handleChange('center_bore', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CENTER_BORE_OPTIONS.map((cb) => (
                  <SelectItem key={cb} value={cb}>{cb}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Кол-во болтов</Label>
            <Select
              value={formData.bolts_count || 'none'}
              onValueChange={(v) => handleChange('bolts_count', v === 'none' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не указано</SelectItem>
                {BOLTS_COUNT_OPTIONS.map((b) => (
                  <SelectItem key={b} value={b.toString()}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Вес (кг)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="9.5"
            />
          </div>
        </div>
      </div>

      {/* Дополнительные характеристики */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Дополнительные характеристики</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Цвет</Label>
            <Select
              value={formData.color || 'none'}
              onValueChange={(v) => handleChange('color', v === 'none' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите цвет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не указан</SelectItem>
                {COLOR_OPTIONS.map((color) => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Покрытие</Label>
            <Select
              value={formData.finish || 'none'}
              onValueChange={(v) => handleChange('finish', v === 'none' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите покрытие" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не указано</SelectItem>
                {FINISH_OPTIONS.map((finish) => (
                  <SelectItem key={finish} value={finish}>{finish}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Материал</Label>
            <Select
              value={formData.material || 'none'}
              onValueChange={(v) => handleChange('material', v === 'none' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите материал" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не указан</SelectItem>
                {MATERIAL_OPTIONS.map((material) => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Страна производства</Label>
            <Select
              value={formData.country || 'none'}
              onValueChange={(v) => handleChange('country', v === 'none' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите страну" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не указана</SelectItem>
                {COUNTRY_OPTIONS.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Совместимость с автомобилями */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Car className="w-4 h-4" />
            Совместимость с автомобилями
          </h3>
        </div>

        {/* Универсальный диск */}
        <div className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/30">
          <Checkbox 
            id="universal" 
            checked={isUniversal}
            onCheckedChange={toggleUniversal}
          />
          <div className="space-y-0.5">
            <Label htmlFor="universal" className="font-medium cursor-pointer">
              Универсальный диск
            </Label>
            <p className="text-xs text-muted-foreground">
              Подходит для всех автомобилей с подходящими техническими параметрами (PCD, ЦО, ET)
            </p>
          </div>
        </div>

        {/* Выбор конкретных авто */}
        {!isUniversal && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Или укажите конкретные совместимые автомобили:
              </p>
              <Button type="button" variant="outline" size="sm" onClick={addCarCompatibility}>
                <Plus className="w-4 h-4 mr-1" />
                Добавить
              </Button>
            </div>

            {carCompatibility.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Нажмите «Добавить» чтобы указать совместимые автомобили
              </p>
            ) : (
              <div className="space-y-3">
                {carCompatibility.map((car, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4 bg-background">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Автомобиль {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCarCompatibility(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    
                    {/* Марка и чекбокс "Все модели" */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Марка *</Label>
                        <Select
                          value={car.car_brand || 'none'}
                          onValueChange={(v) => {
                            updateCarCompatibility(index, 'car_brand', v === 'none' ? '' : v)
                            updateCarCompatibility(index, 'car_model', '')
                            updateCarCompatibility(index, 'all_models', false)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите марку" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Выберите марку</SelectItem>
                            {CAR_BRANDS.map((brand) => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {car.car_brand && (
                        <div className="flex items-end pb-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`all-models-${index}`}
                              checked={car.all_models || false}
                              onCheckedChange={(checked) => {
                                updateCarCompatibility(index, 'all_models', checked)
                                if (checked) {
                                  updateCarCompatibility(index, 'car_model', '')
                                }
                              }}
                            />
                            <Label htmlFor={`all-models-${index}`} className="text-sm cursor-pointer">
                              Все модели {car.car_brand}
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Модель (если не все модели) */}
                    {car.car_brand && !car.all_models && (
                      <div className="space-y-2">
                        <Label className="text-xs">Модель *</Label>
                        <Select
                          value={car.car_model || 'none'}
                          onValueChange={(v) => updateCarCompatibility(index, 'car_model', v === 'none' ? '' : v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите модель" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Выберите модель</SelectItem>
                            {getModelsForBrand(car.car_brand).map((model) => (
                              <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Годы и модификация */}
                    {car.car_brand && (car.all_models || car.car_model) && (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Год от</Label>
                          <Select
                            value={car.car_year_from?.toString() || 'none'}
                            onValueChange={(v) => updateCarCompatibility(index, 'car_year_from', v === 'none' ? undefined : parseInt(v))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Любой" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Любой</SelectItem>
                              {CAR_YEARS.map((year) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Год до</Label>
                          <Select
                            value={car.car_year_to?.toString() || 'none'}
                            onValueChange={(v) => updateCarCompatibility(index, 'car_year_to', v === 'none' ? undefined : parseInt(v))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Любой" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Любой</SelectItem>
                              {CAR_YEARS.map((year) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Модификация</Label>
                          <Input
                            value={car.car_modification || ''}
                            onChange={(e) => updateCarCompatibility(index, 'car_modification', e.target.value || undefined)}
                            placeholder="2.0 TSI"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Описание */}
      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          placeholder="Подробное описание диска..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {wheel ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  )
}
