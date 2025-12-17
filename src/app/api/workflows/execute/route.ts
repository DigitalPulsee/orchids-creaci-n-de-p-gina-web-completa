import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { workflowId, testData } = body

    const { data: workflow, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow no encontrado' }, { status: 404 })
    }

    const executionResult = {
      workflowId: workflow.id,
      status: 'success',
      executedAt: new Date().toISOString(),
      nodes: workflow.config.nodes || [],
      edges: workflow.config.edges || [],
      results: [
        {
          nodeId: 'trigger',
          status: 'success',
          output: testData || { message: 'Workflow ejecutado en modo de prueba' }
        }
      ]
    }

    return NextResponse.json({ 
      success: true, 
      execution: executionResult 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}
