"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"
import { useSupport } from "@/lib/contexts/support-context"

export function CTASection() {
  const { openSupport } = useSupport()
  return (
    <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary via-background to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 lg:p-16 text-center">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
            Бесплатная консультация
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Не можете определиться с выбором?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Наши специалисты помогут подобрать идеальные диски для вашего автомобиля с учётом всех ваших пожеланий и бюджета
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 px-8"
              onClick={openSupport}
            >
              Получить консультацию
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
              <Phone className="mr-2 w-4 h-4" />
              +375 (29) 123-45-67
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-muted-foreground text-sm">
            <span>Бесплатная доставка</span>
            <span className="hidden sm:inline">•</span>
            <span>Гарантия возврата 14 дней</span>
            <span className="hidden sm:inline">•</span>
            <span>Оплата при получении</span>
          </div>
        </div>
      </div>
    </section>
  )
}
