'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp, signIn } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { 
  Code, 
  Lock, 
  Mail, 
  User, 
  AlertCircle,
  Rocket,
  ArrowLeft,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Zap
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, text: '' })

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const calculatePasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '' }
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 15
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20
    if (/\d/.test(password)) strength += 20
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20

    let text = 'Débil'
    if (strength > 60) text = 'Fuerte'
    else if (strength > 30) text = 'Media'

    return { strength, text }
  }

  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {}
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (authMode === 'register') {
      const name = formData.get('name') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (!name || name.length < 3) {
        errors.name = 'Nombre mínimo 3 caracteres'
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email inválido'
    }
    if (!password || password.length < 6) {
      errors.password = 'Mínimo 6 caracteres'
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    const formData = new FormData(e.currentTarget)
    const errors = validateForm(formData)

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      if (authMode === 'register') {
        await signUp(email, password)
        showNotification('¡Cuenta creada! Revisa tu email para confirmar.', 'success')
        setAuthMode('login')
      } else {
        await signIn(email, password)
        showNotification('¡Bienvenido!', 'success')
        router.push('/dashboard')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error al procesar la solicitud'
      if (errorMessage.includes('Invalid login')) {
        showNotification('Email o contraseña incorrectos', 'error')
      } else if (errorMessage.includes('User already registered')) {
        showNotification('Este email ya está registrado', 'error')
      } else {
        showNotification(errorMessage, 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-black' : 'bg-gradient-to-br from-zinc-100 via-white to-zinc-50'}`}>
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl text-white font-medium shadow-lg animate-in slide-in-from-right ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost" className={isDark ? 'text-white hover:bg-white/10' : 'text-zinc-900 hover:bg-zinc-200'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="absolute top-6 right-6">
        <Button variant="ghost" onClick={toggleTheme} className={isDark ? 'text-white hover:bg-white/10' : 'text-zinc-900 hover:bg-zinc-200'}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      <Card className={`w-full max-w-md p-8 ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-white border-zinc-200'}`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code className="w-8 h-8 text-blue-500" />
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>APIBlend</span>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
            {authMode === 'login' ? 'Accede a tu dashboard' : 'Comienza tu prueba gratuita'}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={authMode === 'login' ? 'default' : 'outline'}
            className={`flex-1 ${authMode === 'login' ? 'bg-blue-600 hover:bg-blue-700' : isDark ? 'border-zinc-600 text-white hover:bg-zinc-700' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            Iniciar Sesión
          </Button>
          <Button
            variant={authMode === 'register' ? 'default' : 'outline'}
            className={`flex-1 ${authMode === 'register' ? 'bg-blue-600 hover:bg-blue-700' : isDark ? 'border-zinc-600 text-white hover:bg-zinc-700' : ''}`}
            onClick={() => setAuthMode('register')}
          >
            Registrarse
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {authMode === 'register' && (
            <div>
              <Label className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                <User className="w-4 h-4" />
                Nombre completo
              </Label>
              <Input
                name="name"
                placeholder="Tu nombre"
                className={`${isDark ? 'bg-zinc-900 border-zinc-600 text-white' : ''} ${formErrors.name ? 'border-red-500' : ''}`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <Label className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="tu@email.com"
              className={`${isDark ? 'bg-zinc-900 border-zinc-600 text-white' : ''} ${formErrors.email ? 'border-red-500' : ''}`}
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <Label className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              <Lock className="w-4 h-4" />
              Contraseña
            </Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`pr-10 ${isDark ? 'bg-zinc-900 border-zinc-600 text-white' : ''} ${formErrors.password ? 'border-red-500' : ''}`}
                onChange={(e) => authMode === 'register' && setPasswordStrength(calculatePasswordStrength(e.target.value))}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.password}
              </p>
            )}
            {authMode === 'register' && passwordStrength.strength > 0 && (
              <div className="mt-2">
                <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.strength > 60 ? 'bg-green-500' :
                      passwordStrength.strength > 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{passwordStrength.text}</p>
              </div>
            )}
          </div>

          {authMode === 'register' && (
            <div>
              <Label className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                <Lock className="w-4 h-4" />
                Confirmar contraseña
              </Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className={`${isDark ? 'bg-zinc-900 border-zinc-600 text-white' : ''} ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {authMode === 'login' ? 'Entrando...' : 'Creando...'}
              </div>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </>
            )}
          </Button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-blue-500 hover:underline font-medium"
          >
            {authMode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </Card>

      <div className={`fixed bottom-6 left-6 px-4 py-2 rounded-full text-xs flex items-center gap-2 border ${isDark ? 'bg-black/80 text-white border-white/10' : 'bg-white/80 text-zinc-900 border-zinc-200'}`}>
        <Zap className="w-3 h-3 text-blue-500" />
        <span>powered by <strong>TEAM ABQ</strong></span>
      </div>
    </div>
  )
}
