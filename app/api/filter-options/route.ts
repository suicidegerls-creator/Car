import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        diameters: [], widths: [], pcds: [], ets: [], centerBores: [],
        brands: [], colors: [], finishes: [], materials: [], countries: [], wheelTypes: []
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all unique values from wheels table
    const { data: wheels, error } = await supabase
      .from('wheels')
      .select('diameter, width, pcd, et, center_bore, brand, color, finish, material, country, wheel_type')

    if (error) throw error

    // Extract unique values
    const diameters = [...new Set(wheels?.map(w => w.diameter).filter(Boolean))].sort((a, b) => a - b)
    const widths = [...new Set(wheels?.map(w => w.width?.toString()).filter(Boolean))].sort((a, b) => parseFloat(a) - parseFloat(b))
    const pcds = [...new Set(wheels?.map(w => w.pcd).filter(Boolean))].sort()
    const ets = [...new Set(wheels?.map(w => w.et).filter(v => v !== null && v !== undefined))].sort((a, b) => a - b)
    const centerBores = [...new Set(wheels?.map(w => w.center_bore?.toString()).filter(Boolean))].sort((a, b) => parseFloat(a) - parseFloat(b))
    const brands = [...new Set(wheels?.map(w => w.brand).filter(Boolean))].sort()
    const colors = [...new Set(wheels?.map(w => w.color).filter(Boolean))].sort()
    const finishes = [...new Set(wheels?.map(w => w.finish).filter(Boolean))].sort()
    const materials = [...new Set(wheels?.map(w => w.material).filter(Boolean))].sort()
    const countries = [...new Set(wheels?.map(w => w.country).filter(Boolean))].sort()
    const wheelTypes = [...new Set(wheels?.map(w => w.wheel_type).filter(Boolean))]

    return NextResponse.json({
      diameters,
      widths,
      pcds,
      ets,
      centerBores,
      brands,
      colors,
      finishes,
      materials,
      countries,
      wheelTypes,
    })
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json({ error: 'Failed to fetch filter options' }, { status: 500 })
  }
}
