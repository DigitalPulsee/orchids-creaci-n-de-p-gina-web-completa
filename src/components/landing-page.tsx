"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Rocket, 
  Code, 
  Zap, 
  Bot, 
  Shield, 
  TrendingUp, 
  Cloud,
  Menu,
  X,
  ChevronUp,
  Star,
  LogIn,
  Sun,
  Moon,
  MessageSquare,
  Sparkles,
  BookOpen,
  Brain
} from 'lucide-react'

export function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const isDark = theme === 'dark'

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'}`}>
      {notification && (
        <div className={`fixed top-24 right-5 z-[1001] px-6 py-4 rounded-xl text-white font-medium shadow-lg animate-in slide-in-from-right-full ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.message}
        </div>
      )}

      <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isDark ? 'bg-black/80 backdrop-blur-md border-white/10' : 'bg-white/80 backdrop-blur-md border-zinc-200'
      }`}>
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <Code className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">APIBlend</span>
            </div>

            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <li>
                <button onClick={() => scrollToSection('features')} className="hover:text-blue-500 transition-colors">
                  Características
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('ai')} className="hover:text-blue-500 transition-colors">
                  IA Assistant
                </button>
              </li>
              <li>
                <button onClick={() => showNotification('Próximamente', 'success')} className="hover:text-blue-500 transition-colors">
                  Precios
                </button>
              </li>
            </ul>

            <div className="hidden lg:flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <section id="hero" className={`relative min-h-screen flex items-center pt-20 overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-black via-zinc-900 to-zinc-950' : 'bg-gradient-to-br from-blue-50 via-white to-zinc-50'
      }`}>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-500/10 border-blue-500/20'
              }`}>
                <Rocket className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Automatización sin límites</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Crea flujos de trabajo <span className="text-blue-500">sin código</span>
              </h1>

              <p className={`text-xl leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                La plataforma visual más intuitiva para conectar APIs, automatizar tareas y potenciar tu productividad con inteligencia artificial.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                    Comenzar gratis
                  </Button>
                </Link>
                <Link href="/ai-assistant">
                  <Button size="lg" variant="outline" className={`w-full sm:w-auto ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                    <Bot className="w-5 h-5 mr-2" />
                    Probar Asistente IA
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Card className={`p-4 shadow-2xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className={`rounded-lg h-80 flex items-center justify-center border border-dashed ${
                  isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <div className="flex flex-col items-center gap-4 animate-bounce">
                    <Zap className="w-16 h-16 text-blue-500" />
                    <span className="font-bold text-blue-500">Visual Editor</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Potencia tus integraciones</h2>
            <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
              Todo lo que necesitas para conectar tus aplicaciones favoritas y automatizar procesos complejos en minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Code, title: 'Editor Visual', desc: 'Arrastra y suelta para crear flujos complejos.' },
              { icon: Zap, title: 'Rápido y Seguro', desc: 'Ejecuciones en tiempo real con cifrado empresarial.' },
              { icon: Bot, title: 'IA Integrada', desc: 'Asistente de IA para ayudarte a programar.' }
            ].map((f, i) => (
              <Card key={i} className={`p-8 hover:border-blue-500 transition-all cursor-pointer ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`}>
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className={`py-24 ${isDark ? 'bg-zinc-900' : 'bg-blue-600 text-white'}`}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Asistente IA para Programadores</h2>
              <p className={`text-xl ${isDark ? 'text-zinc-400' : 'text-blue-100'}`}>
                Resuelve dudas, genera código y optimiza tus integraciones con nuestro chatbot impulsado por Google Gemini.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MessageSquare, text: 'Chat Inteligente' },
                  { icon: Code, text: 'Generación de Código' },
                  { icon: Sparkles, text: 'Optimización' },
                  { icon: BookOpen, text: 'Documentación' }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 p-3 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-blue-500'}`}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/ai-assistant">
                <Button size="lg" variant={isDark ? 'default' : 'secondary'} className="w-full sm:w-auto">
                  Probar Asistente Ahora
                </Button>
              </Link>
            </div>
            <Card className={`p-6 ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white text-zinc-900'}`}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-zinc-900' : 'bg-blue-50'}`}>
                    <p className="text-sm italic">"¿Cómo puedo conectar mi API de Slack?"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-zinc-900' : 'bg-blue-50'}`}>
                    <p className="text-sm">"¡Es fácil! Solo arrastra el nodo de Slack al editor y pega tu Webhook URL."</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className={`py-12 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Code className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold">APIBlend</span>
          </div>
          <p className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>
            &copy; 2025 APIBlend. Todos los derechos reservados.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs">
            <Zap className="w-3 h-3 text-blue-500" />
            <span>powered by <strong>TEAM ABQ</strong></span>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 shadow-lg z-50 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  )
}
