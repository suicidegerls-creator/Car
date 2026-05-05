import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { SupportWidget } from '@/components/support/support-widget'
import { SupportProvider } from '@/lib/contexts/support-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin", "cyrillic"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://diskibel.by'),
  title: {
    default: 'ДискиБел — Литые и кованые диски в Минске | Купить диски в Беларуси',
    template: '%s | ДискиБел — Диски в Минске',
  },
  description: 'Интернет-магазин литых и кованых дисков в Минске. Большой выбор дисков Techline, RST, K&K, SKAD, iFree, Alcasta, Carwel. Датчики давления шин TPMS, крепёж, центровочные кольца, проставки. Бесплатная примерка на ваш автомобиль. Доставка по Беларуси. Тел: +375 (29) 657-69-60',
  keywords: [
    'литые диски Минск',
    'кованые диски Беларусь', 
    'купить диски Минск',
    'автомобильные диски',
    'диски на авто',
    'Techline диски',
    'RST диски',
    'K&K диски',
    'SKAD',
    'iFree диски',
    'датчики давления шин',
    'TPMS датчики',
    'центровочные кольца',
    'колёсные проставки',
    'крепёж для дисков',
    'болты колёсные',
    'гайки для дисков',
    'секретки',
    'шиномонтаж Минск',
    'примерка дисков онлайн',
    'диски недорого',
    'штампованные диски',
    'диски R15 R16 R17 R18 R19 R20',
    'АвтоМолл диски',
  ],
  authors: [{ name: 'ДискиБел', url: 'https://diskibel.by' }],
  creator: 'ДискиБел',
  publisher: 'ДискиБел',
  generator: 'Next.js',
  applicationName: 'ДискиБел',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  category: 'Автомобильные товары',
  classification: 'Интернет-магазин автомобильных дисков',
  openGraph: {
    type: 'website',
    locale: 'ru_BY',
    url: 'https://diskibel.by',
    siteName: 'ДискиБел',
    title: 'ДискиБел — Литые и кованые диски в Минске',
    description: 'Большой выбор литых и кованых дисков от ведущих мировых производителей. Датчики давления, крепёж, центровочные кольца. Бесплатная примерка. Доставка по Беларуси.',
    images: [
      {
        url: '/images/hero-car.jpg',
        width: 1200,
        height: 630,
        alt: 'ДискиБел — Премиальные литые диски в Минске',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ДискиБел — Литые и кованые диски в Минске',
    description: 'Большой выбор дисков от ведущих производителей. Бесплатная примерка на ваш автомобиль.',
    images: ['/images/hero-car.jpg'],
    creator: '@diskibel',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.jpg', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://diskibel.by',
    languages: {
      'ru-BY': 'https://diskibel.by',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  other: {
    'geo.region': 'BY-HM',
    'geo.placename': 'Minsk',
    'geo.position': '53.9006;27.5590',
    'ICBM': '53.9006, 27.5590',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: 'ДискиБел',
    description: 'Интернет-магазин литых и кованых дисков в Минске',
    url: 'https://diskibel.by',
    telephone: ['+375296576960', '+375296889188'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'АвтоМолл, павильон 276',
      addressLocality: 'Минск',
      addressCountry: 'BY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.9006,
      longitude: 27.5590,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '20:00',
    },
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card'],
    currenciesAccepted: 'BYN',
    areaServed: {
      '@type': 'Country',
      name: 'Belarus',
    },
    sameAs: [
      'https://t.me/diskibel',
    ],
  }

  return (
    <html lang="ru" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
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
