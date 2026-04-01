import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

// GET - список дисков с фильтрами
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  // Проверяем, есть ли фильтр по автомобилю
  const carBrand = searchParams.get('car_brand')
  const carModel = searchParams.get('car_model')
  const carYear = searchParams.get('car_year')

  // Если есть фильтр по автомобилю, сначала находим wheel_id из таблицы совместимости
  let wheelIdsFromCar: string[] | null = null
  if (carBrand || carModel || carYear) {
    let compatQuery = supabase.from('wheel_car_compatibility').select('wheel_id')
    
    if (carBrand) compatQuery = compatQuery.eq('car_brand', carBrand)
    if (carModel) compatQuery = compatQuery.eq('car_model', carModel)
    if (carYear) {
      const year = parseInt(carYear)
      compatQuery = compatQuery.lte('car_year_from', year).gte('car_year_to', year)
    }
    
    const { data: compatData } = await compatQuery
    wheelIdsFromCar = compatData?.map(c => c.wheel_id) || []
  }

  let query = supabase.from('wheels').select('*', { count: 'exact' })
  
  // Если искали по авто и нашли wheel_ids
  if (wheelIdsFromCar !== null) {
    if (wheelIdsFromCar.length === 0) {
      // Нет совместимых дисков - возвращаем пустой результат
      return NextResponse.json({
        data: [],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0
      })
    }
    query = query.in('id', wheelIdsFromCar)
  }

  // Фильтры
  const wheelType = searchParams.get('wheel_type')
  const diameter = searchParams.get('diameter')
  const pcd = searchParams.get('pcd')
  const brand = searchParams.get('brand')
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const minWidth = searchParams.get('min_width')
  const maxWidth = searchParams.get('max_width')
  const minEt = searchParams.get('min_et')
  const maxEt = searchParams.get('max_et')
  const centerBore = searchParams.get('center_bore')
  const inStock = searchParams.get('in_stock')
  const search = searchParams.get('search')

  if (wheelType) query = query.eq('wheel_type', wheelType)
  if (diameter) query = query.eq('diameter', parseInt(diameter))
  if (pcd) query = query.eq('pcd', pcd)
  if (brand) query = query.eq('brand', brand)
  if (minPrice) query = query.gte('price', parseFloat(minPrice))
  if (maxPrice) query = query.lte('price', parseFloat(maxPrice))
  if (minWidth) query = query.gte('width', parseFloat(minWidth))
  if (maxWidth) query = query.lte('width', parseFloat(maxWidth))
  if (minEt) query = query.gte('et', parseInt(minEt))
  if (maxEt) query = query.lte('et', parseInt(maxEt))
  if (centerBore) query = query.eq('center_bore', parseFloat(centerBore))
  if (inStock === 'true') query = query.eq('in_stock', true)
  if (search) query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`)

  // Сортировка
  const sortBy = searchParams.get('sort_by') || 'created_at'
  const sortOrder = searchParams.get('sort_order') === 'asc' ? true : false
  query = query.order(sortBy, { ascending: sortOrder })

  // Пагинация
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  })
}

// POST - создание диска (для админки)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const body = await request.json()
    const { car_compatibility, ...wheelData } = body
    
    // Генерация slug
    if (!wheelData.slug && wheelData.name) {
      wheelData.slug = wheelData.name
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        + '-' + Date.now()
    }

    const { data, error } = await supabase
      .from('wheels')
      .insert(wheelData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Сохраняем совместимость с автомобилями
    if (car_compatibility && car_compatibility.length > 0 && data) {
      const compatibilityData = car_compatibility.map((c: { car_brand: string; car_model: string; car_year_from?: number; car_year_to?: number; car_modification?: string }) => ({
        wheel_id: data.id,
        car_brand: c.car_brand,
        car_model: c.car_model,
        car_year_from: c.car_year_from || null,
        car_year_to: c.car_year_to || null,
        car_modification: c.car_modification || null,
      }))
      
      await supabase.from('wheel_car_compatibility').insert(compatibilityData)
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
