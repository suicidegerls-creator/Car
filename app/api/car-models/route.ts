import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brandId')
  const brandName = searchParams.get('brandName')

  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('car_models')
      .select('id, name, brand_id')
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
