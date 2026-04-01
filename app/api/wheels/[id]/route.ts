import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

// GET - получить один диск с совместимостью
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('wheels')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Wheel not found' }, { status: 404 })
  }

  // Получаем совместимость с автомобилями
  const { data: compatibility } = await supabase
    .from('wheel_car_compatibility')
    .select('*')
    .eq('wheel_id', id)

  return NextResponse.json({
    ...data,
    car_compatibility: compatibility || []
  })
}

// PUT - обновить диск
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  try {
    const body = await request.json()
    const { car_compatibility, ...wheelData } = body

    const { data, error } = await supabase
      .from('wheels')
      .update(wheelData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Обновляем совместимость с автомобилями
    if (car_compatibility !== undefined) {
      // Удаляем старые записи
      await supabase.from('wheel_car_compatibility').delete().eq('wheel_id', id)
      
      // Добавляем новые
      if (car_compatibility.length > 0) {
        const compatibilityData = car_compatibility.map((c: { car_brand: string; car_model: string; car_year_from?: number; car_year_to?: number; car_modification?: string }) => ({
          wheel_id: id,
          car_brand: c.car_brand,
          car_model: c.car_model,
          car_year_from: c.car_year_from || null,
          car_year_to: c.car_year_to || null,
          car_modification: c.car_modification || null,
        }))
        
        await supabase.from('wheel_car_compatibility').insert(compatibilityData)
      }
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE - удалить диск
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('[v0] DELETE wheel request, id:', id)
  
  const supabase = await createClient()

  // Сначала удаляем связанные записи совместимости
  const { error: compatError } = await supabase
    .from('wheel_car_compatibility')
    .delete()
    .eq('wheel_id', id)

  if (compatError) {
    console.log('[v0] Error deleting compatibility:', compatError)
  }

  const { error, data } = await supabase
    .from('wheels')
    .delete()
    .eq('id', id)
    .select()

  console.log('[v0] DELETE result:', { error, data })

  if (error) {
    console.log('[v0] DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
