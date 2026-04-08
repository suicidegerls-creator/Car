'use client'

import { Suspense } from 'react'
import { ARFittingRoom } from '@/components/ar/ar-fitting-room'
import { Loader2 } from 'lucide-react'

export default function ARFittingPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <Suspense fallback={
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }>
        <ARFittingRoom />
      </Suspense>
    </main>
  )
}
