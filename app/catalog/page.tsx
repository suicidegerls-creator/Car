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
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Каталог дисков</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Широкий ассортимент дисков для любых автомобилей
          </p>
          <CatalogContent />
        </div>
      </div>
      <Footer />
    </main>
  )
}
