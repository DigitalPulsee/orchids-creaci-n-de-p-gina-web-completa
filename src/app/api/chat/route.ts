import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    const { message, language, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = `Eres un asistente de programación experto y amigable llamado APIBlend AI. 
Tu objetivo es ayudar a programadores de todos los niveles con:
- Explicaciones claras de conceptos de programación
- Generación de código limpio y bien documentado
- Corrección y depuración de errores
- Mejores prácticas y patrones de diseño
- Consejos para mejorar el código

El usuario está trabajando principalmente con: ${language || 'JavaScript'}

Instrucciones:
1. Responde siempre en español
2. Usa markdown para formatear tu respuesta
3. Cuando incluyas código, usa bloques de código con el lenguaje especificado
4. Sé conciso pero completo
5. Si no estás seguro de algo, dilo claramente
6. Ofrece alternativas cuando sea apropiado

${context ? `Contexto adicional del usuario: ${context}` : ''}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: '¡Entendido! Estoy listo para ayudarte con programación. ¿En qué puedo asistirte?' }] },
        { role: 'user', parts: [{ text: message }] }
      ]
    })

    const text = response.text || 'Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.'

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Error processing request' },
      { status: 500 }
    )
  }
}
