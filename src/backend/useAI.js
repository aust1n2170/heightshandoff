import { ref } from 'vue'

export function useAI() {
  const loading = ref(false)
  const error = ref(null)

  const analyzeImage = async (imageFile) => {
    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      // Call Vercel serverless function
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      return data

    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    analyzeImage,
    loading,
    error
  }
}