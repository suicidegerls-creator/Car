'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CatalogFilters } from './catalog-filters'
import { CatalogGrid } from './catalog-grid'
import { CatalogPagination } from './catalog-pagination'
import { Wheel } from '@/lib/types/wheel'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SlidersHorizontal, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CatalogSkeleton } from './catalog-skeleton'

// Wrapper with Suspense for useSearchParams
export function CatalogContent() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContentInner />
    </Suspense>
  )
}

function CatalogContentInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [wheels, setWheels] = useState<Wheel[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const page = parseInt(searchParams.get('page') || '1')
  const sortBy = searchParams.get('sort_by') || 'created_at'
  const sortOrder = searchParams.get('sort_order') || 'desc'

  const fetchWheels = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      if (!params.has('limit')) params.set('limit', '12')

      console.log('[v0] Fetching wheels with params:', params.toString())
      const res = await fetch(`/api/wheels?${params}`)
      console.log('[v0] Response status:', res.status)
      const json = await res.json()
      console.log('[v0] Response data:', json)
      
      setWheels(json.data || [])
      setTotal(json.total || 0)
      setTotalPages(json.totalPages || 0)
    } catch (error) {
      console.error('[v0] Error fetching wheels:', error)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchWheels()
  }, [fetchWheels])

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Reset to page 1 when filters change (except for page changes)
    if (!('page' in updates)) {
      params.set('page', '1')
    }
    
    router.push(`/catalog?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/catalog')
  }

  const activeFiltersCount = Array.from(searchParams.entries()).filter(
    ([key]) => !['page', 'limit', 'sort_by', 'sort_order'].includes(key)
  ).length

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Фильтры</h2>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Сбросить
              </Button>
            )}
          </div>
          <CatalogFilters
            searchParams={searchParams}
            updateParams={updateParams}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Filters & Sort */}
        <div className="flex items-center gap-4 mb-6">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="ml-2 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  Фильтры
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => { clearFilters(); setFiltersOpen(false); }}>
                      <X className="w-4 h-4 mr-1" />
                      Сбросить
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <CatalogFilters
                  searchParams={searchParams}
                  updateParams={(updates) => {
                    updateParams(updates)
                    setFiltersOpen(false)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Найдено: <span className="font-medium text-foreground">{total}</span> товаров
            </p>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-')
                updateParams({ sort_by: newSortBy, sort_order: newSortOrder })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Сначала новые</SelectItem>
                <SelectItem value="created_at-asc">Сначала старые</SelectItem>
                <SelectItem value="price-asc">Сначала дешевые</SelectItem>
                <SelectItem value="price-desc">Сначала дорогие</SelectItem>
                <SelectItem value="name-asc">По названию А-Я</SelectItem>
                <SelectItem value="name-desc">По названию Я-А</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        <CatalogGrid wheels={wheels} loading={loading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <CatalogPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => updateParams({ page: newPage.toString() })}
          />
        )}
      </div>
    </div>
  )
}
