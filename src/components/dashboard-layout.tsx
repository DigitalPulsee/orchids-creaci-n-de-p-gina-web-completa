'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WorkflowEditor } from '@/components/workflow-editor'
import { 
  Code, 
  LogOut, 
  Plus, 
  Workflow,
  Settings,
  Home,
  MessageSquare,
  Zap
} from 'lucide-react'

export function DashboardLayout() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'workflows' | 'editor' | 'chat'>('workflows')
  const [showEditor, setShowEditor] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="bg-black/50 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">APIBlend</span>
              <span className="text-xs text-zinc-400 px-2 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                Dashboard
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-zinc-400">
                {user?.email}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          <aside className="w-64 space-y-2">
            <Button
              onClick={() => { setActiveTab('workflows'); setShowEditor(false) }}
              variant={activeTab === 'workflows' && !showEditor ? 'default' : 'ghost'}
              className="w-full justify-start"
            >
              <Home className="w-4 h-4 mr-2" />
              Mis Workflows
            </Button>
            <Button
              onClick={() => { setShowEditor(true); setActiveTab('editor') }}
              variant={showEditor ? 'default' : 'ghost'}
              className="w-full justify-start"
            >
              <Workflow className="w-4 h-4 mr-2" />
              Editor Visual
            </Button>
            <Button
              onClick={() => { setActiveTab('chat'); setShowEditor(false) }}
              variant={activeTab === 'chat' && !showEditor ? 'default' : 'ghost'}
              className="w-full justify-start"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat IA
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
          </aside>

          <main className="flex-1">
            {!showEditor && activeTab === 'workflows' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-white">Mis Workflows</h1>
                  <Button onClick={() => setShowEditor(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Workflow
                  </Button>
                </div>

                <div className="grid gap-4">
                  <Card className="p-6 bg-zinc-800 border-zinc-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Bienvenido a APIBlend</h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          Crea tu primer workflow haciendo clic en "Nuevo Workflow"
                        </p>
                      </div>
                      <Zap className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {showEditor && (
              <WorkflowEditor onClose={() => setShowEditor(false)} />
            )}

            {!showEditor && activeTab === 'chat' && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-6">Chat IA - Asistente de Programación</h1>
                <Card className="p-6 bg-zinc-800 border-zinc-700">
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-20" />
                    <p className="text-zinc-400">
                      Chat IA próximamente disponible
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs flex items-center gap-2 border border-zinc-700">
        <Zap className="w-3 h-3 text-blue-400" />
        <span>powered by <strong>DigitalPulse</strong></span>
      </div>
    </div>
  )
}
