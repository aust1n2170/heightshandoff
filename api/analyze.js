import { OpenAI } from 'openai'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Analyzing image...')

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const { image } = req.body

    if (!image) {
      console.error('No image in request')
      return res.status(400).json({ error: 'No image provided' })
    }

    console.log('Calling OpenAI Vision API...')

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this item for a college thrift marketplace. Provide:
              1. Item name and category (furniture, electronics, clothing, books, kitchen, decor, other)
              2. Condition (like new/good/fair/poor)
              3. Brief description (1 sentence)
              4. Suggested price ($X or FREE if low value, give an exact value)
              
              Return ONLY valid JSON with keys: name, category, condition, description, price`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })

    const result = response.choices[0].message.content
    console.log('Response:', result)

    let parsed
    try {
      let cleanResult = result
      if (result.includes('```json')) {
        cleanResult = result.split('```json')[1].split('```')[0]
      } else if (result.includes('```')) {
        cleanResult = result.split('```')[1].split('```')[0]
      }
      
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
        console.log('✅ Parsed result:', parsed)
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Parse error:', parseError)
      parsed = { error: "Could not parse AI response" }
    }

    return res.status(200).json(parsed)

  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    })
  }
}