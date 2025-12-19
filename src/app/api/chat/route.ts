import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/genai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Actúa como un experto en programación y automatización de APIs.
      Lenguaje preferido: ${language || 'Cualquiera'}
      Usuario pregunta: ${message}
      
      Responde de forma concisa, técnica y útil. Si piden código, proporciónalo con explicaciones breves.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
