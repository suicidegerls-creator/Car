'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CatalogFilters } from './catalog-filters'
import { CatalogGrid } from './catalog-grid'
import { CatalogPagination } from './catalog-pagination'
import { Wheel } from '@/lib/types/wheel'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
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

  const page = parseInt(searchParams.get('page') || '1')
  const sortBy = searchParams.get('sort_by') || 'created_at'
  const sortOrder = searchParams.get('sort_order') || 'desc'

  const fetchWheels = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      if (!params.has('limit')) params.set('limit', '12')

      const res = await fetch(`/api/wheels?${params}`)
      const json = await res.json()
      
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
    <div className="flex flex-col gap-6">
      {/* Filters Panel - Always visible */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Подбор дисков</h2>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4 mr-1" />
              Сбросить ({activeFiltersCount})
            </Button>
          )}
        </div>
        <CatalogFilters
          searchParams={searchParams}
          updateParams={updateParams}
        />
      </div>

      {/* Results section */}
      <div className="flex-1">
        {/* Sort & Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6">
          <p className="text-sm text-muted-foreground">
            Найдено: <span className="font-medium text-foreground">{total}</span> дисков
          </p>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [newSortBy, newSortOrder] = value.split('-')
              updateParams({ sort_by: newSortBy, sort_order: newSortOrder })
            }}
          >
            <SelectTrigger className="w-[160px] sm:w-[180px] text-sm">
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
