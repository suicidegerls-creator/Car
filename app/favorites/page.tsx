import { Metadata } from 'next'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Избранное | ДискиБел',
  description: 'Ваши избранные товары',
}

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Избранное</h1>
            <p className="text-muted-foreground">Сохраненные товары</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Список избранного пуст</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Добавляйте понравившиеся диски в избранное, чтобы не потерять их и сравнить позже
          </p>
          <Link href="/catalog/wheels">
            <Button className="bg-primary hover:bg-primary/90">
              Перейти в каталог
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Не является публичной офертой, носит информационный характер
          </p>
        </div>
      </div>
    </main>
  )
}
