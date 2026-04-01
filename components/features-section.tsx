"use client"

import { Shield, Truck, Award, Headphones } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Все диски проходят строгий контроль качества и имеют официальную гарантию производителя",
  },
  {
    icon: Truck,
    title: "Быстрая доставка",
    description: "Доставка по всей Беларуси в кратчайшие сроки. Бесплатно при заказе от 500 BYN",
  },
  {
    icon: Award,
    title: "Оригинальная продукция",
    description: "Только сертифицированные диски от официальных дистрибьюторов",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    description: "Наши эксперты всегда готовы помочь с выбором идеальных дисков для вашего авто",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
            Почему мы
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Преимущества RIMZONE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 bg-card rounded-lg border border-border hover:border-muted-foreground/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <feature.icon className="w-6 h-6 text-foreground group-hover:text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
