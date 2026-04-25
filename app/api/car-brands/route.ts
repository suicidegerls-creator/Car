import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const brands = await prisma.carBrand.findMany({
      select: {
        id: true,
        name: true,
        name_ru: true,
        is_popular: true,
      },
      orderBy: [
        { is_popular: 'desc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching car brands:', error)
    return NextResponse.json({ error: 'Failed to fetch car brands' }, { status: 500 })
  }
}
