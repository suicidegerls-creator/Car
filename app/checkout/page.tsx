import { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckoutForm } from '@/components/checkout/checkout-form'

export const metadata: Metadata = {
  title: 'Оформление заказа | RIMZONE',
  description: 'Оформите заказ на автомобильные диски с доставкой по Беларуси',
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Оформление заказа</h1>
          <p className="text-muted-foreground mb-8">
            Заполните форму и мы свяжемся с вами для подтверждения
          </p>
          <CheckoutForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
