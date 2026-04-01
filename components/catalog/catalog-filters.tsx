'use client'

import { useState, useEffect } from 'react'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Car, Settings2 } from 'lucide-react'
import {
  WHEEL_TYPE_LABELS,
  PCD_OPTIONS,
  DIAMETER_OPTIONS,
  WIDTH_OPTIONS,
  BRAND_OPTIONS,
  CENTER_BORE_OPTIONS,
  ET_OPTIONS,
  CAR_BRANDS,
  CAR_YEARS,
  CAR_MODELS,
  CAR_MODIFICATIONS,
} from '@/lib/types/wheel'

interface CatalogFiltersProps {
  searchParams: ReadonlyURLSearchParams
  updateParams: (updates: Record<string, string | null>) => void
}

export function CatalogFilters({ searchParams, updateParams }: CatalogFiltersProps) {
  // Car search state
  const [selectedBrand, setSelectedBrand] = useState<string>('none')
  const [selectedYear, setSelectedYear] = useState<string>('none')
  const [selectedModel, setSelectedModel] = useState<string>('none')
  const [selectedModification, setSelectedModification] = useState<string>('none')
  const [carDiameter, setCarDiameter] = useState<string>('none')

  // Reset model when brand changes
  useEffect(() => {
    setSelectedModel('none')
    setSelectedModification('none')
  }, [selectedBrand])

  const getParam = (key: string) => searchParams.get(key) || ''

  const getSelectValue = (key: string): string => {
    const value = searchParams.get(key)
    if (!value || value === '') return 'none'
    return value
  }

  const availableModels = selectedBrand !== 'none' ? (CAR_MODELS[selectedBrand] || []) : []

  const handleCarSearch = () => {
    const updates: Record<string, string | null> = {
      // Сначала очистим предыдущие фильтры по авто
      car_brand: null,
      car_model: null,
      car_year: null,
    }
    
    // Добавляем выбранные параметры
    if (selectedBrand !== 'none') updates.car_brand = selectedBrand
    if (selectedModel !== 'none') updates.car_model = selectedModel
    if (selectedYear !== 'none') updates.car_year = selectedYear
    if (carDiameter !== 'none') updates.diameter = carDiameter
    
    updateParams(updates)
  }

  const clearAllFilters = () => {
    const updates: Record<string, string | null> = {
      wheel_type: null,
      diameter: null,
      min_width: null,
      max_width: null,
      pcd: null,
      min_et: null,
      max_et: null,
      center_bore: null,
      min_price: null,
      max_price: null,
      brand: null,
      in_stock: null,
      car_brand: null,
      car_model: null,
      car_year: null,
    }
    updateParams(updates)
    setSelectedBrand('none')
    setSelectedYear('none')
    setSelectedModel('none')
    setSelectedModification('none')
    setCarDiameter('none')
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="params" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 mb-4">
          <TabsTrigger value="car" className="gap-1 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Car className="w-3 h-3" />
            По авто
          </TabsTrigger>
          <TabsTrigger value="params" className="gap-1 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Settings2 className="w-3 h-3" />
            По параметрам
          </TabsTrigger>
        </TabsList>

        {/* Search by Car */}
        <TabsContent value="car" className="space-y-3 mt-0">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Марка</Label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Выберите марку" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Любая марка</SelectItem>
                {CAR_BRANDS.filter(b => b && b.length > 0).map((brand) => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Год выпуска</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Выберите год" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Любой год</SelectItem>
                {CAR_YEARS.filter(y => y && y.length > 0).map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Модель</Label>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={selectedBrand === 'none'}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={selectedBrand !== 'none' ? 'Выберите модель' : 'Сначала марку'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Любая модель</SelectItem>
                {availableModels.filter(m => m && m.length > 0).map((model) => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Модификация</Label>
            <Select
              value={selectedModification}
              onValueChange={setSelectedModification}
              disabled={selectedModel === 'none'}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Выберите модификацию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Любая</SelectItem>
                {CAR_MODIFICATIONS.filter(m => m && m.length > 0).map((mod) => (
                  <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Диаметр</Label>
            <Select value={carDiameter} onValueChange={setCarDiameter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Выберите диаметр" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Любой</SelectItem>
                {DIAMETER_OPTIONS.map((d) => (
                  <SelectItem key={d} value={String(d)}>R{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleCarSearch}
            disabled={selectedBrand === 'none'}
          >
            Найти диски
          </Button>
        </TabsContent>

        {/* Search by Parameters */}
        <TabsContent value="params" className="mt-0">
          <Accordion type="multiple" defaultValue={['type', 'size', 'price']} className="w-full">
            {/* Тип диска */}
            <AccordionItem value="type">
              <AccordionTrigger className="text-sm font-medium py-2">Тип диска</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {Object.entries(WHEEL_TYPE_LABELS).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${value}`}
                        checked={getParam('wheel_type') === value}
                        onCheckedChange={(checked) =>
                          updateParams({ wheel_type: checked ? value : null })
                        }
                      />
                      <label htmlFor={`type-${value}`} className="text-sm cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Размеры */}
            <AccordionItem value="size">
              <AccordionTrigger className="text-sm font-medium py-2">Размеры</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Диаметр</Label>
                  <Select
                    value={getSelectValue('diameter')}
                    onValueChange={(v) => updateParams({ diameter: v === 'none' ? null : v })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Любой" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Любой</SelectItem>
                      {DIAMETER_OPTIONS.map((d) => (
                        <SelectItem key={d} value={String(d)}>R{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Ширина (J)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={getSelectValue('min_width')}
                      onValueChange={(v) => updateParams({ min_width: v === 'none' ? null : v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="от" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">от</SelectItem>
                        {WIDTH_OPTIONS.map((w) => (
                          <SelectItem key={w} value={w}>{w}J</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={getSelectValue('max_width')}
                      onValueChange={(v) => updateParams({ max_width: v === 'none' ? null : v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="до" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">до</SelectItem>
                        {WIDTH_OPTIONS.map((w) => (
                          <SelectItem key={w} value={w}>{w}J</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">PCD (разболтовка)</Label>
                  <Select
                    value={getSelectValue('pcd')}
                    onValueChange={(v) => updateParams({ pcd: v === 'none' ? null : v })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Любая" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Любая</SelectItem>
                      {PCD_OPTIONS.map((pcd) => (
                        <SelectItem key={pcd} value={pcd}>{pcd}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Вылет ET</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={getSelectValue('min_et')}
                      onValueChange={(v) => updateParams({ min_et: v === 'none' ? null : v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="от" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">от</SelectItem>
                        {ET_OPTIONS.filter(e => e && e.length > 0).map((et) => (
                          <SelectItem key={`min-et-${et}`} value={et}>ET {et}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={getSelectValue('max_et')}
                      onValueChange={(v) => updateParams({ max_et: v === 'none' ? null : v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="до" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">до</SelectItem>
                        {ET_OPTIONS.filter(e => e && e.length > 0).map((et) => (
                          <SelectItem key={`max-et-${et}`} value={et}>ET {et}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Диаметр ЦО (мм)</Label>
                  <Select
                    value={getSelectValue('center_bore')}
                    onValueChange={(v) => updateParams({ center_bore: v === 'none' ? null : v })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Любой" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Любой</SelectItem>
                      {CENTER_BORE_OPTIONS.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Цена */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-sm font-medium py-2">Цена</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="от Р"
                    className="h-9"
                    value={getParam('min_price')}
                    onChange={(e) => updateParams({ min_price: e.target.value || null })}
                  />
                  <Input
                    type="number"
                    placeholder="до Р"
                    className="h-9"
                    value={getParam('max_price')}
                    onChange={(e) => updateParams({ max_price: e.target.value || null })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Производитель */}
            <AccordionItem value="brand">
              <AccordionTrigger className="text-sm font-medium py-2">Производитель</AccordionTrigger>
              <AccordionContent>
                <Select
                  value={getSelectValue('brand')}
                  onValueChange={(v) => updateParams({ brand: v === 'none' ? null : v })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Любой</SelectItem>
                    {BRAND_OPTIONS.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Наличие */}
            <AccordionItem value="stock">
              <AccordionTrigger className="text-sm font-medium py-2">Наличие</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in_stock"
                    checked={getParam('in_stock') === 'true'}
                    onCheckedChange={(checked) =>
                      updateParams({ in_stock: checked ? 'true' : null })
                    }
                  />
                  <label htmlFor="in_stock" className="text-sm cursor-pointer">
                    Только в наличии
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

      <Button
        variant="outline"
        className="w-full"
        onClick={clearAllFilters}
      >
        Сбросить фильтры
      </Button>
    </div>
  )
}
