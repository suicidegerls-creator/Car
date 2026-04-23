import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brandId')
  const brandName = searchParams.get('brandName')
  
  const supabase = await createClient()
  
  let query = supabase
    .from('car_models')
    .select('id, name, brand_id')
    .order('name', { ascending: true })

  if (brandId) {
    query = query.eq('brand_id', brandId)
  } else if (brandName) {
    // First get brand id by name
    const { data: brand } = await supabase
      .from('car_brands')
      .select('id')
      .eq('name', brandName)
      .single()
    
    if (brand) {
      query = query.eq('brand_id', brand.id)
    } else {
      return NextResponse.json([])
    }
  }

  const { data: models, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(models)
}
