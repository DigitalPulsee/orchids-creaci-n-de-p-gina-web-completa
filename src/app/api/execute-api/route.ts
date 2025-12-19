import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { apiType, config, testData } = await req.json()

    let result: any = { success: true, data: {} }

    switch (apiType) {
      case 'webhook':
        if (!config.url) throw new Error('URL del Webhook requerida')
        const webhookRes = await fetch(config.url, {
          method: config.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            payload: testData || { message: 'Test from APIBlend' }
          })
        })
        result.data = { status: webhookRes.status, statusText: webhookRes.statusText }
        break;

      case 'http':
        if (!config.url) throw new Error('URL requerida')
        const httpRes = await fetch(config.url, {
          method: config.method || 'GET',
          headers: config.headers || {}
        })
        const data = await httpRes.json().catch(() => ({ message: 'No JSON response' }))
        result.data = data
        break;

      case 'email':
        // Simulación de envío de email
        result.data = { message: `Email enviado a ${config.to}`, subject: config.subject }
        break;

      case 'slack':
        if (config.webhookUrl) {
          const slackRes = await fetch(config.webhookUrl, {
            method: 'POST',
            body: JSON.stringify({ text: config.message || 'Test message' })
          })
          result.data = { status: slackRes.status }
        } else {
          result.data = { message: 'Simulación: Mensaje de Slack enviado', channel: config.channel }
        }
        break;

      case 'sheets':
        // Simulación de Google Sheets
        result.data = { 
          message: `Operación ${config.operation} realizada en la hoja ${config.spreadsheetId}`,
          range: config.range,
          rows: [{ id: 1, name: 'Sample Data' }]
        }
        break;

      case 'transform':
        result.data = { ...testData, transformed: true, processedAt: new Date().toISOString() }
        break;

      case 'filter':
        result.data = { ...testData, filtered: true, matchCount: 1 }
        break;

      default:
        throw new Error('Tipo de API no soportado')
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
