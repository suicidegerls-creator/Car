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
    .select('name, brand, meta_title, meta_description')
    .eq('id', id)
    .single()

  if (!wheel) {
    return { title: 'Товар не найден | RIMZONE' }
  }

  return {
    title: wheel.meta_title || `${wheel.name} | ${wheel.brand} | RIMZONE`,
    description: wheel.meta_description || `Купить ${wheel.name} от ${wheel.brand} в магазине RIMZONE`,
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

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <ProductDetails wheel={wheel as Wheel} />
      </div>
      <Footer />
    </main>
  )
}
