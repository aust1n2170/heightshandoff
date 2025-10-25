<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">List an Item</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📸 Upload Photo *
          </label>
          <input 
            type="file" 
            accept="image/*" 
            @change="handleImageUpload" 
            class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
            required 
          />
          
          <div v-if="previewUrl" class="mt-4">
            <img :src="previewUrl" alt="Preview" class="h-64 w-full object-cover rounded-lg shadow-md" />
          </div>
        </div>

        <div v-if="analyzing" class="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 animate-pulse">
          <div class="flex items-center space-x-3">
            <div class="text-3xl animate-spin">🤖</div>
            <div>
              <p class="text-blue-700 font-bold text-lg">AI is analyzing your photo...</p>
              <p class="text-blue-600 text-sm">This may take 5-10 seconds</p>
            </div>
          </div>
        </div>

        <div v-if="analyzed && !analyzing" class="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <p class="text-green-700 font-bold">✨ AI Analysis Complete!</p>
          <p class="text-green-600 text-sm">Form filled automatically. You can edit any field before posting.</p>
        </div>

        <div v-if="analyzeError" class="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <p class="text-red-700 font-bold">⚠️ AI Analysis Failed</p>
          <p class="text-red-600 text-sm">{{ analyzeError }}</p>
          <p class="text-red-600 text-sm mt-2">Please fill out the form manually.</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g., Modern Desk Lamp" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
              required 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select 
              v-model="form.category" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
              required
            >
              <option value="">Select category</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="textbooks">Textbooks</option>
              <option value="decor">Decor</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
            <select 
              v-model="form.condition" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
              required
            >
              <option value="">Select condition</option>
              <option value="like new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              v-model="form.description" 
              placeholder="Brief description of the item..." 
              rows="3" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
            <input 
              v-model="form.price" 
              type="text" 
              placeholder="e.g., $15 or FREE" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input 
              v-model="form.location" 
              type="text" 
              placeholder="e.g., Walsh Hall, 2nd Floor" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="posting || analyzing" 
          class="w-full mt-6 bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <span v-if="posting">Posting... ⏳</span>
          <span v-else-if="analyzing">Analyzing... 🤖</span>
          <span v-else>List Item 🚀</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['itemPosted'])

const imageFile = ref(null)
const previewUrl = ref(null)
const analyzing = ref(false)
const analyzed = ref(false)
const analyzeError = ref(null)
const posting = ref(false)

const form = reactive({
  name: '',
  category: '',
  condition: '',
  description: '',
  price: '',
  location: ''
})

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const dataUrl = reader.result
      const [metadata, base64] = dataUrl.split(',')
      const mimeType = metadata.match(/:(.*?);/)[1]
      resolve({ base64, mimeType })
    }
    reader.onerror = reject
  })
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  analyzed.value = false
  analyzeError.value = null
  analyzing.value = true

  console.log('🔍 Starting AI analysis...')
  console.log('📁 File type:', file.type)

  try {
    const { base64, mimeType } = await fileToBase64(file)
    console.log('📦 Image converted')
    console.log('🎨 MIME type:', mimeType)
    console.log('📏 Base64 length:', base64.length)

    console.log('📤 Calling /api/analyze...')
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        image: base64,
        mimeType: mimeType 
      })
    })

    console.log('📥 Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API error:', errorText)
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ AI result:', result)

    if (result.error) {
      throw new Error(result.error)
    }

    form.name = result.name || ''
    form.category = result.category?.toLowerCase() || ''
    form.condition = result.condition?.toLowerCase() || ''
    form.description = result.description || ''
    form.price = result.price || ''

    analyzed.value = true
    console.log('✨ Form auto-filled!')

  } catch (error) {
    console.error('❌ Error:', error)
    analyzeError.value = error.message || 'Analysis failed. Please try again.'
  } finally {
    analyzing.value = false
  }
}

const handleSubmit = () => {
  if (!imageFile.value) {
    alert('Please upload an image')
    return
  }

  posting.value = true

  setTimeout(() => {
    alert('Item posted successfully! 🎉\n\n(Firebase integration will save this for real)')
    
    Object.keys(form).forEach(key => form[key] = '')
    imageFile.value = null
    previewUrl.value = null
    analyzed.value = false
    analyzeError.value = null
    posting.value = false
    
    emit('itemPosted')
  }, 1000)
}
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>