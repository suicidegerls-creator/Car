'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Loader2 } from 'lucide-react'

const ADMIN_TOKEN = 'rimzone-admin-2024'

function AdminContent() {
  const searchParams = useSearchParams()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (token === ADMIN_TOKEN) {
      setIsAuthorized(true)
      sessionStorage.setItem('admin_token', token)
    } else {
      const savedToken = sessionStorage.getItem('admin_token')
      if (savedToken === ADMIN_TOKEN) {
        setIsAuthorized(true)
      }
    }
  }, [searchParams])

  const handleLogin = () => {
    if (tokenInput === ADMIN_TOKEN) {
      setIsAuthorized(true)
      sessionStorage.setItem('admin_token', tokenInput)
      setError('')
    } else {
      setError('Неверный токен доступа')
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-foreground" />
            </div>
            <CardTitle>Админ-панель RIMZONE</CardTitle>
            <CardDescription>
              Введите токен доступа или перейдите по секретной ссылке
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Токен доступа"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="pl-10"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Доступ только для администраторов
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <AdminDashboard />
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminContent />
    </Suspense>
  )
}
