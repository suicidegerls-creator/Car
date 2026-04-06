'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SupportContextType {
  isOpen: boolean
  openSupport: () => void
  closeSupport: () => void
}

const SupportContext = createContext<SupportContextType | undefined>(undefined)

export function SupportProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openSupport = () => setIsOpen(true)
  const closeSupport = () => setIsOpen(false)

  return (
    <SupportContext.Provider value={{ isOpen, openSupport, closeSupport }}>
      {children}
    </SupportContext.Provider>
  )
}

export function useSupport() {
  const context = useContext(SupportContext)
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider')
  }
  return context
}
