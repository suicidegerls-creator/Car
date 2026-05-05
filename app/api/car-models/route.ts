import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brandId')
  const brandName = searchParams.get('brandName')
  const includeParams = searchParams.get('includeParams') === 'true'

  try {
    const supabase = await createClient()
    
    // Если нужны параметры совместимости - добавляем их в запрос
    const selectFields = includeParams 
      ? 'id, name, brand_id, pcd, center_bore, diameter_min, diameter_max, width_min, width_max, et_min, et_max'
      : 'id, name, brand_id'
    
    let query = supabase
      .from('car_models')
      .select(selectFields)
      .order('name', { ascending: true })

    if (brandId) {
      query = query.eq('brand_id', brandId)
    } else if (brandName) {
      // Find brand by name first
      const { data: brand } = await supabase
        .from('car_brands')
        .select('id')
        .eq('name', brandName)
        .single()

      if (!brand) {
        return NextResponse.json([])
      }

      query = query.eq('brand_id', brand.id)
    }

    const { data: models, error } = await query

    if (error) {
      console.error('Error fetching car models:', error)
      return NextResponse.json({ error: 'Failed to fetch car models' }, { status: 500 })
    }

    return NextResponse.json(models || [])
  } catch (error) {
    console.error('Error fetching car models:', error)
    return NextResponse.json({ error: 'Failed to fetch car models' }, { status: 500 })
  }
}
