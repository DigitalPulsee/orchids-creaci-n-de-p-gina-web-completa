import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { apiType, config, testData } = await req.json()

    let result: any = { success: true, data: {} }

    switch (apiType) {
      case 'webhook':
        if (!config.url) throw new Error('URL del Webhook requerida')
        try {
          const webhookRes = await fetch(config.url, {
            method: config.method || 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'User-Agent': 'APIBlend/1.0'
            },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              source: 'APIBlend',
              data: testData || { message: 'Test from APIBlend' }
            })
          })
          const responseText = await webhookRes.text()
          result.data = { 
            status: webhookRes.status, 
            statusText: webhookRes.statusText,
            response: responseText || 'Sin respuesta'
          }
        } catch (err: any) {
          throw new Error(`Error en Webhook: ${err.message}`)
        }
        break;

      case 'http':
        if (!config.url) throw new Error('URL requerida')
        try {
          const fetchOptions: RequestInit = {
            method: config.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'APIBlend/1.0',
              ...config.headers
            }
          }
          
          if (['POST', 'PUT', 'PATCH'].includes(config.method) && config.body) {
            fetchOptions.body = typeof config.body === 'string' 
              ? config.body 
              : JSON.stringify(config.body)
          }

          const httpRes = await fetch(config.url, fetchOptions)
          const contentType = httpRes.headers.get('content-type')
          
          let data
          if (contentType?.includes('application/json')) {
            data = await httpRes.json()
          } else {
            data = { text: await httpRes.text() }
          }
          
          result.data = {
            status: httpRes.status,
            statusText: httpRes.statusText,
            headers: Object.fromEntries(httpRes.headers.entries()),
            body: data
          }
        } catch (err: any) {
          throw new Error(`Error en HTTP Request: ${err.message}`)
        }
        break;

      case 'email':
        result.data = { 
          status: 'simulated',
          message: `Email simulado a ${config.to}`, 
          subject: config.subject,
          body: config.body,
          note: 'Para envíos reales, configura una API key de Resend o similar en tu cuenta'
        }
        break;

      case 'slack':
        if (!config.webhookUrl) {
          throw new Error('Webhook URL de Slack requerida')
        }
        
        try {
          const slackPayload = {
            text: config.message || 'Mensaje de prueba desde APIBlend',
            channel: config.channel || undefined,
            username: 'APIBlend Bot',
            icon_emoji: ':rocket:'
          }

          const slackRes = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slackPayload)
          })

          const responseText = await slackRes.text()
          
          if (!slackRes.ok) {
            throw new Error(`Slack respondió con error: ${slackRes.status} - ${responseText}`)
          }

          result.data = { 
            status: slackRes.status,
            statusText: slackRes.statusText,
            response: responseText,
            message: 'Mensaje enviado correctamente a Slack'
          }
        } catch (err: any) {
          throw new Error(`Error en Slack: ${err.message}`)
        }
        break;

      case 'sheets':
        result.data = { 
          status: 'simulated',
          message: `Operación ${config.operation} en Google Sheets`,
          spreadsheetId: config.spreadsheetId,
          range: config.range,
          note: 'Para operaciones reales, configura las credenciales de Google Sheets API',
          sampleData: [
            { id: 1, nombre: 'Ejemplo 1', valor: 100 },
            { id: 2, nombre: 'Ejemplo 2', valor: 200 }
          ]
        }
        break;

      case 'transform':
        let transformedData = { ...testData }
        
        if (config.transformations && Array.isArray(config.transformations)) {
          config.transformations.forEach((t: any) => {
            if (t.type === 'uppercase' && t.field) {
              transformedData[t.field] = String(transformedData[t.field] || '').toUpperCase()
            } else if (t.type === 'lowercase' && t.field) {
              transformedData[t.field] = String(transformedData[t.field] || '').toLowerCase()
            } else if (t.type === 'add' && t.field && t.value) {
              transformedData[t.field] = (Number(transformedData[t.field]) || 0) + Number(t.value)
            }
          })
        }
        
        result.data = {
          original: testData,
          transformed: transformedData,
          processedAt: new Date().toISOString()
        }
        break;

      case 'filter':
        const conditions = config.conditions || []
        let matchCount = 0
        let filteredResults: any[] = []

        if (Array.isArray(testData)) {
          filteredResults = testData.filter(item => {
            return conditions.every((cond: any) => {
              const value = item[cond.field]
              switch (cond.operator) {
                case 'equals': return value === cond.value
                case 'contains': return String(value).includes(cond.value)
                case 'greater': return Number(value) > Number(cond.value)
                case 'less': return Number(value) < Number(cond.value)
                default: return true
              }
            })
          })
          matchCount = filteredResults.length
        }

        result.data = { 
          filtered: filteredResults,
          matchCount,
          totalItems: Array.isArray(testData) ? testData.length : 0
        }
        break;

      case 'delay':
        const delayTime = config.delay || 1000
        await new Promise(resolve => setTimeout(resolve, Math.min(delayTime, 10000)))
        result.data = { 
          message: `Esperó ${delayTime}ms`,
          delayedUntil: new Date().toISOString()
        }
        break;

      default:
        throw new Error('Tipo de API no soportado')
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error desconocido'
    }, { status: 500 })
  }
}
