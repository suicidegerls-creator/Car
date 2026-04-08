'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  wheelId: string
  wheelName?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  showText?: boolean
}

export function FavoriteButton({
  wheelId,
  wheelName,
  size = 'icon',
  variant = 'outline',
  className,
  showText = false,
}: FavoriteButtonProps) {
  const { 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite, 
    isLoading,
    loadFavorites,
  } = useFavorites()

  const favorite = isFavorite(wheelId)

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (favorite) {
      await removeFromFavorites(wheelId)
    } else {
      await addToFavorites(wheelId, wheelName)
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'transition-all duration-300',
        favorite && 'text-red-500 hover:text-red-600',
        className
      )}
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-all duration-300',
          favorite && 'fill-current scale-110',
          !showText && 'mr-0',
          showText && 'mr-2'
        )}
      />
      {showText && (favorite ? 'В избранном' : 'В избранное')}
    </Button>
  )
}
