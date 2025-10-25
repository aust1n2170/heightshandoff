import OpenAI from 'openai'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  // Enable CORS
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
    // Parse form data
    const form = formidable()
    const [fields, files] = await form.parse(req)
    
    const imageFile = files.image[0]
    const imageBuffer = fs.readFileSync(imageFile.filepath)
    const base64Image = imageBuffer.toString('base64')

    // Call OpenAI Vision API
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
              4. Suggested price ($X-$Y or FREE if low value)
              
              Return ONLY valid JSON with keys: name, category, condition, description, price`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })

    const result = response.choices[0].message.content
    
    // Parse JSON from response
    let parsed
    try {
      // Handle markdown code blocks
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      parsed = { error: "Could not parse AI response" }
    }

    // Clean up temp file
    fs.unlinkSync(imageFile.filepath)

    return res.status(200).json(parsed)

  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    })
  }
}