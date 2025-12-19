'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Bot, 
  Send, 
  ChevronLeft, 
  Trash2, 
  Code, 
  Sparkles, 
  Terminal,
  Sun,
  Moon,
  Zap,
  Loader2
} from 'lucide-react'

export default function AIAssistantPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de programación. ¿En qué puedo ayudarte hoy?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('JavaScript')
  const scrollEndRef = useRef<HTMLDivElement>(null)

  const isDark = theme === 'dark'

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + error.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md ${
        isDark ? 'bg-zinc-950/80 border-white/10' : 'bg-white/80 border-zinc-200'
      }`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            <span className="font-bold hidden sm:inline">AI Assistant</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`text-sm rounded-md px-2 py-1 border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
          >
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C#</option>
            <option>Go</option>
          </select>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-4xl p-4 md:p-6 flex flex-col gap-6">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-zinc-500 text-white'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                </div>
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : isDark ? 'bg-zinc-900 border border-white/5' : 'bg-white border border-zinc-200 shadow-sm'
                }`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-white border border-zinc-200 shadow-sm'}`}>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>
        </ScrollArea>

        <Card className={`p-4 shadow-xl border-t-4 border-t-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta sobre código o APIs..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className={`flex-1 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200'}`}
              disabled={loading}
            />
            <Button onClick={handleSendMessage} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMessages([{ role: 'assistant', content: 'Chat limpiado.' }])} className="text-zinc-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
            <div className="flex items-center gap-1"><Code className="w-3 h-3" /> Syntax Highlighting</div>
            <div className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Powered</div>
            <div className="flex items-center gap-1"><Zap className="w-3 h-3" /> Real-time Response</div>
          </div>
        </Card>
      </main>

      <div className={`p-4 text-center text-xs opacity-50 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        powered by TEAM ABQ & Google Gemini AI
      </div>
    </div>
  )
}
