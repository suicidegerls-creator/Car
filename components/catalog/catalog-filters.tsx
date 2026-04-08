'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Car, Settings2, Search, ChevronDown, ChevronUp } from 'lucide-react'
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
  // Price debounce state
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')

  // Show more params
  const [showMoreParams, setShowMoreParams] = useState(false)

  // Sync price inputs with URL
  useEffect(() => {
    setMinPrice(searchParams.get('min_price') || '')
    setMaxPrice(searchParams.get('max_price') || '')
  }, [searchParams])

  // Debounced price update
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentMin = searchParams.get('min_price') || ''
      const currentMax = searchParams.get('max_price') || ''
      
      if (minPrice !== currentMin || maxPrice !== currentMax) {
        updateParams({
          min_price: minPrice || null,
          max_price: maxPrice || null,
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [minPrice, maxPrice])

  // Get current car filter values from URL
  const selectedCarBrand = searchParams.get('car_brand') || 'none'
  const selectedCarModel = searchParams.get('car_model') || 'none'
  const selectedCarYear = searchParams.get('car_year') || 'none'
  const selectedCarModification = searchParams.get('car_modification') || 'none'
  const selectedCarDiameter = searchParams.get('diameter') || 'none'

  // Live update for car brand - reset dependent fields
  const handleCarBrandChange = useCallback((value: string) => {
    updateParams({
      car_brand: value === 'none' ? null : value,
      car_model: null,
      car_modification: null,
    })
  }, [updateParams])

  // Live update for car year
  const handleCarYearChange = useCallback((value: string) => {
    updateParams({ car_year: value === 'none' ? null : value })
  }, [updateParams])

  // Live update for car model - reset modification
  const handleCarModelChange = useCallback((value: string) => {
    updateParams({
      car_model: value === 'none' ? null : value,
      car_modification: null,
    })
  }, [updateParams])

  // Live update for car modification
  const handleCarModificationChange = useCallback((value: string) => {
    updateParams({ car_modification: value === 'none' ? null : value })
  }, [updateParams])

  // Live update for car diameter
  const handleCarDiameterChange = useCallback((value: string) => {
    updateParams({ diameter: value === 'none' ? null : value })
  }, [updateParams])

  const getSelectValue = (key: string): string => {
    const value = searchParams.get(key)
    if (!value || value === '') return 'none'
    return value
  }

  const getParam = (key: string) => searchParams.get(key) || ''

  const availableModels = selectedCarBrand !== 'none' ? (CAR_MODELS[selectedCarBrand] || []) : []

  // Manual search button - applies all current URL params (useful if user wants to confirm)
  const handleCarSearch = () => {
    // This just triggers a re-fetch with current params - the filters are already live
    updateParams({})
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
      <Tabs defaultValue="car" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-11 mb-6 bg-muted/50">
          <TabsTrigger 
            value="car" 
            className="gap-2 text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            <Car className="w-4 h-4" />
            По автомобилю
          </TabsTrigger>
          <TabsTrigger 
            value="params" 
            className="gap-2 text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            <Settings2 className="w-4 h-4" />
            По параметрам
          </TabsTrigger>
        </TabsList>

        {/* Search by Car */}
        <TabsContent value="car" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Марка</Label>
              <Select value={selectedCarBrand} onValueChange={handleCarBrandChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Любая марка</SelectItem>
                  {CAR_BRANDS.filter(b => b && b.length > 0).map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Модель</Label>
              <Select
                value={selectedCarModel}
                onValueChange={handleCarModelChange}
                disabled={selectedCarBrand === 'none'}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={selectedCarBrand !== 'none' ? 'Выберите' : 'Сначала марку'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Любая модель</SelectItem>
                  {availableModels.filter(m => m && m.length > 0).map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Год выпуска</Label>
              <Select value={selectedCarYear} onValueChange={handleCarYearChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Любой год</SelectItem>
                  {CAR_YEARS.filter(y => y && y.length > 0).map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Модификация</Label>
              <Select
                value={selectedCarModification}
                onValueChange={handleCarModificationChange}
                disabled={selectedCarModel === 'none'}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Любая</SelectItem>
                  {CAR_MODIFICATIONS.filter(m => m && m.length > 0).map((mod) => (
                    <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Диаметр</Label>
              <Select value={selectedCarDiameter} onValueChange={handleCarDiameterChange}>
                <SelectTrigger className="h-10">
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

            <div className="flex items-end col-span-2 sm:col-span-1">
              <Button
                className="w-full h-10 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleCarSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Поиск
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Search by Parameters */}
        <TabsContent value="params" className="mt-0 space-y-4">
          {/* Main params row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Тип диска</Label>
              <Select
                value={getSelectValue('wheel_type')}
                onValueChange={(v) => updateParams({ wheel_type: v === 'none' ? null : v })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Любой" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Любой</SelectItem>
                  {Object.entries(WHEEL_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Диаметр</Label>
              <Select
                value={getSelectValue('diameter')}
                onValueChange={(v) => updateParams({ diameter: v === 'none' ? null : v })}
              >
                <SelectTrigger className="h-10">
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

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">PCD (разболтовка)</Label>
              <Select
                value={getSelectValue('pcd')}
                onValueChange={(v) => updateParams({ pcd: v === 'none' ? null : v })}
              >
                <SelectTrigger className="h-10">
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

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Производитель</Label>
              <Select
                value={getSelectValue('brand')}
                onValueChange={(v) => updateParams({ brand: v === 'none' ? null : v })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Любой" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Любой</SelectItem>
                  {BRAND_OPTIONS.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Цена, руб</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="от"
                  className="h-10"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="до"
                  className="h-10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-end">
              <div className="flex items-center h-10 gap-2">
                <Checkbox
                  id="in_stock_main"
                  checked={getParam('in_stock') === 'true'}
                  onCheckedChange={(checked) =>
                    updateParams({ in_stock: checked ? 'true' : null })
                  }
                />
                <label htmlFor="in_stock_main" className="text-sm cursor-pointer whitespace-nowrap">
                  В наличии
                </label>
              </div>
            </div>
          </div>

          {/* Toggle for more params */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreParams(!showMoreParams)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showMoreParams ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Скрыть дополнительные
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Дополнительные параметры
              </>
            )}
          </Button>

          {/* Additional params */}
          {showMoreParams && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2 border-t border-border">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ширина от</Label>
                <Select
                  value={getSelectValue('min_width')}
                  onValueChange={(v) => updateParams({ min_width: v === 'none' ? null : v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Любая" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Любая</SelectItem>
                    {WIDTH_OPTIONS.map((w) => (
                      <SelectItem key={w} value={w}>{w}J</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ширина до</Label>
                <Select
                  value={getSelectValue('max_width')}
                  onValueChange={(v) => updateParams({ max_width: v === 'none' ? null : v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Любая" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Любая</SelectItem>
                    {WIDTH_OPTIONS.map((w) => (
                      <SelectItem key={w} value={w}>{w}J</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Вылет ET от</Label>
                <Select
                  value={getSelectValue('min_et')}
                  onValueChange={(v) => updateParams({ min_et: v === 'none' ? null : v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Любой</SelectItem>
                    {ET_OPTIONS.filter(e => e && e.length > 0).map((et) => (
                      <SelectItem key={`min-et-${et}`} value={et}>ET {et}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Вылет ET до</Label>
                <Select
                  value={getSelectValue('max_et')}
                  onValueChange={(v) => updateParams({ max_et: v === 'none' ? null : v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Любой</SelectItem>
                    {ET_OPTIONS.filter(e => e && e.length > 0).map((et) => (
                      <SelectItem key={`max-et-${et}`} value={et}>ET {et}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Диаметр ЦО</Label>
                <Select
                  value={getSelectValue('center_bore')}
                  onValueChange={(v) => updateParams({ center_bore: v === 'none' ? null : v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Любой</SelectItem>
                    {CENTER_BORE_OPTIONS.map((h) => (
                      <SelectItem key={h} value={h}>{h} мм</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
