"use client"

import { useState, useEffect } from "react"
import { Menu, X, Search, User, LogIn, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CartSheet } from "@/components/cart/cart-sheet"
import { WheelLogo } from "@/components/ui/wheel-logo"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navItems = [
  { name: "Каталог", href: "/catalog" },
  { name: "О компании", href: "/about" },
  { name: "Контакты", href: "/contacts" },
]

const aiFeature = { name: "Примерка", href: "/ar-fitting" }
const wheelFeature = { name: "Колесо Удачи", href: "/wheel" }

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <WheelLogo size={38} className="text-primary" />
            <span className="font-bold text-xl tracking-tight text-foreground">
              ДискиБел
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium tracking-wide uppercase"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={aiFeature.href}
              className="relative ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold tracking-wide uppercase transition-all hover:scale-105 hover:shadow-lg shadow-primary/25"
            >
              <span className="relative z-10">{aiFeature.name}</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
            </Link>
            <Link
              href={wheelFeature.href}
              className="relative ml-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-semibold tracking-wide uppercase transition-all hover:scale-105 hover:shadow-lg shadow-orange-500/25 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v10l7 4" />
                </svg>
                {wheelFeature.name}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent animate-pulse"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            {user ? (
              <Link href="/account">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <LogIn className="w-4 h-4 mr-2" />
                  Войти
                </Button>
              </Link>
            )}
            <CartSheet />
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-1">
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-muted-foreground hover:text-foreground transition-colors text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={aiFeature.href}
              className="block mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-center text-lg font-semibold shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {aiFeature.name}
              <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">NEW</span>
            </Link>
            <Link
              href={wheelFeature.href}
              className="block mt-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-center text-lg font-semibold shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {wheelFeature.name}
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">-5%</span>
            </Link>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Search className="w-5 h-5" />
              </Button>
              <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <CartSheet />
              {user ? (
                <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
