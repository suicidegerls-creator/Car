import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Админ-панель | DiskLand',
  description: 'Управление каталогом дисков',
  robots: 'noindex, nofollow'
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
