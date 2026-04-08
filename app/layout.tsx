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
  title: 'RIMZONE — Премиальные диски для вашего авто',
  description: 'Каталог премиальных автомобильных дисков. Широкий ассортимент литых, кованых и штампованных дисков от ведущих брендов.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SupportProvider>
          {children}
          <SupportWidget />
        </SupportProvider>
        <Toaster 
          position="bottom-right" 
          richColors 
          closeButton
          theme="dark"
        />
        <Analytics />
      </body>
    </html>
  )
}
