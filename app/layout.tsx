import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { SupportWidget } from '@/components/support/support-widget'
import { SupportProvider } from '@/lib/contexts/support-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://car-two-beta-48.vercel.app'),
  title: {
    default: 'ДискиБел — Премиальные литые диски в Минске',
    template: '%s | ДискиБел',
  },
  description: 'Магазин премиальных литых дисков в Минске. Оригинальная продукция BBS, OZ Racing, Enkei, Vossen. Доставка по Беларуси. +375 (29) 657-69-60',
  keywords: ['литые диски', 'диски Минск', 'автомобильные диски', 'BBS', 'OZ Racing', 'купить диски Беларусь', 'кованые диски'],
  authors: [{ name: 'ДискиБел' }],
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'ru_BY',
    url: 'https://car-two-beta-48.vercel.app',
    siteName: 'ДискиБел',
    title: 'ДискиБел — Премиальные литые диски в Минске',
    description: 'Магазин премиальных литых дисков в Минске. Оригинальная продукция от ведущих мировых производителей.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ДискиБел — Премиальные литые диски',
    description: 'Магазин премиальных литых дисков в Минске',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased bg-background text-foreground">
        <SupportProvider>
          {children}
          <SupportWidget />
        </SupportProvider>
        <Toaster 
          position="bottom-right" 
          richColors 
          closeButton
          theme="light"
        />
        <Analytics />
      </body>
    </html>
  )
}
