'use client'

import { useEffect, useState } from 'react'
import { useViewHistory } from '@/hooks/use-view-history'
import { Recommendations } from '@/components/catalog/recommendations'

export function HomeRecommendations() {
  const [mounted, setMounted] = useState(false)
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Проверяем наличие истории после монтирования
    const history = useViewHistory.getState().viewedWheels
    setHasHistory(history.length > 0)
    
    // Подписываемся на изменения
    const unsubscribe = useViewHistory.subscribe((state) => {
      setHasHistory(state.viewedWheels.length > 0)
    })
    
    return () => unsubscribe()
  }, [])

  if (!mounted || !hasHistory) {
    return null
  }

  return (
    <div className="container mx-auto px-4">
      <Recommendations 
        type="personalized"
        title="Рекомендуем для вас"
        limit={6}
      />
      <Recommendations 
        type="recently-viewed"
        limit={6}
      />
    </div>
  )
}
