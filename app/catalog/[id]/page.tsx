import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductDetails } from '@/components/catalog/product-details'
import { Wheel } from '@/lib/types/wheel'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: wheel } = await supabase
    .from('wheels')
    .select('name, brand, price, images, meta_title, meta_description')
    .eq('id', id)
    .single()

  if (!wheel) {
    return { title: 'Товар не найден | ДискиБел' }
  }

  const title = wheel.meta_title || `${wheel.name} | ${wheel.brand} | ДискиБел`
  const description = wheel.meta_description || `Купить ${wheel.name} от ${wheel.brand} в магазине ДискиБел. Цена: ${wheel.price} BYN`
  const image = wheel.images?.[0] || null

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ru_BY',
      siteName: 'ДискиБел',
      ...(image && { images: [{ url: image, width: 800, height: 800, alt: wheel.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: wheel } = await supabase
    .from('wheels')
    .select('*')
    .eq('id', id)
    .single()

  if (!wheel) {
    notFound()
  }

  // JSON-LD Product Schema для расширенных сниппетов в Google
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: wheel.name,
    brand: {
      '@type': 'Brand',
      name: wheel.brand,
    },
    description: wheel.description || `Диск ${wheel.name} от ${wheel.brand}`,
    image: wheel.images?.[0] || undefined,
    sku: wheel.sku || wheel.id,
    offers: {
      '@type': 'Offer',
      price: wheel.price,
      priceCurrency: 'BYN',
      availability: wheel.in_stock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ДискиБел',
      },
    },
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header />
      <div className="pt-20">
        <ProductDetails wheel={wheel as Wheel} />
      </div>
      <Footer />
    </main>
  )
}
