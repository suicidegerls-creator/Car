import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CatalogContent } from '@/components/catalog/catalog-content'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог дисков | RIMZONE',
  description: 'Широкий выбор литых, кованых и штампованных дисков для любых автомобилей. Фильтрация по размеру, PCD, вылету и другим параметрам.',
}

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Каталог дисков</h1>
          <p className="text-muted-foreground mb-8">
            Широкий ассортимент дисков для любых автомобилей
          </p>
          <CatalogContent />
        </div>
      </div>
      <Footer />
    </main>
  )
}
