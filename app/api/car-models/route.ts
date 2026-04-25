import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brandId')
  const brandName = searchParams.get('brandName')

  try {
    let whereClause = {}

    if (brandId) {
      whereClause = { brand_id: brandId }
    } else if (brandName) {
      // Find brand by name first
      const brand = await prisma.carBrand.findUnique({
        where: { name: brandName },
        select: { id: true },
      })

      if (!brand) {
        return NextResponse.json([])
      }

      whereClause = { brand_id: brand.id }
    }

    const models = await prisma.carModel.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        brand_id: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(models)
  } catch (error) {
    console.error('Error fetching car models:', error)
    return NextResponse.json({ error: 'Failed to fetch car models' }, { status: 500 })
  }
}
