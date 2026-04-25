import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: brands, error } = await supabase
      .from('car_brands')
      .select('id, name, name_ru, is_popular')
      .order('is_popular', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching car brands:', error)
      return NextResponse.json({ error: 'Failed to fetch car brands' }, { status: 500 })
    }

    return NextResponse.json(brands || [])
  } catch (error) {
    console.error('Error fetching car brands:', error)
    return NextResponse.json({ error: 'Failed to fetch car brands' }, { status: 500 })
  }
}
