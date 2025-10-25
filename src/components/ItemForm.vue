
<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">List an Item</h2>
      
      <!-- TEST: Does file input work? -->
      <div class="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
        <p class="text-sm font-bold">DEBUG MODE</p>
        <p class="text-xs">Upload status: {{ uploadStatus }}</p>
        <p class="text-xs">File selected: {{ imageFile?.name || 'none' }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Image Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📸 Upload Photo *
          </label>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            @change="handleImageUpload" 
            class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
            required 
          />
          
          <!-- Image Preview -->
          <div v-if="previewUrl" class="mt-4">
            <img :src="previewUrl" alt="Preview" class="h-64 w-full object-cover rounded-lg shadow-md" />
          </div>
        </div>

        <!-- AI Loading State -->
        <div v-if="analyzing" class="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 animate-pulse">
          <div class="flex items-center space-x-3">
            <div class="text-3xl animate-spin">🤖</div>
            <div>
              <p class="text-blue-700 font-bold text-lg">AI is analyzing your photo...</p>
              <p class="text-blue-600 text-sm">This may take 5-10 seconds</p>
            </div>
          </div>
        </div>

        <!-- AI Success -->
        <div v-if="analyzed" class="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <p class="text-green-700 font-bold">✨ AI Analysis Complete!</p>
          <p class="text-green-600 text-sm">Form filled automatically.</p>
        </div>

        <!-- AI Error -->
        <div v-if="analyzeError" class="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <p class="text-red-700 font-bold">⚠️ {{ analyzeError }}</p>
        </div>

        <!-- Form Fields -->
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
              <option value="books">Books</option>
              <option value="kitchen">Kitchen</option>
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
              placeholder="Brief description..." 
              rows="3" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
            <input 
              v-model="form.price" 
              type="text" 
              placeholder="$15 or FREE" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input 
              v-model="form.location" 
              type="text" 
              placeholder="Walsh Hall, 2nd Floor" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="posting || analyzing" 
          class="w-full mt-6 bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 transition shadow-lg"
        >
          <span v-if="posting">Posting...</span>
          <span v-else-if="analyzing">Analyzing...</span>
          <span v-else>List Item 🚀</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['itemPosted'])

// State
const fileInput = ref(null)
const imageFile = ref(null)
const previewUrl = ref(null)
const analyzing = ref(false)
const analyzed = ref(false)
const analyzeError = ref(null)
const posting = ref(false)
const uploadStatus = ref('Waiting for file...')

// Form data
const form = reactive({
  name: '',
  category: '',
  condition: '',
  description: '',
  price: '',
  location: ''
})

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}

// Handle image upload and AI analysis
const handleImageUpload = async (event) => {
  uploadStatus.value = 'File input triggered!'
  console.log('🎯 handleImageUpload called!')
  
  const file = event.target.files[0]
  console.log('📁 File from event:', file)
  
  if (!file) {
    uploadStatus.value = 'No file selected'
    console.log('❌ No file selected')
    return
  }

  uploadStatus.value = `File: ${file.name}`
  console.log('✅ File selected:', file.name, file.size, file.type)

  // Store file and show preview
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  
  // Reset states
  analyzed.value = false
  analyzeError.value = null

  // Start AI analysis
  analyzing.value = true
  uploadStatus.value = 'Starting AI analysis...'
  console.log('🤖 Starting AI analysis...')

  try {
    // Convert to base64
    uploadStatus.value = 'Converting to base64...'
    console.log('📦 Converting to base64...')
    const base64Image = await fileToBase64(file)
    console.log('✅ Base64 created, length:', base64Image.length)
    uploadStatus.value = `Base64 ready (${base64Image.length} chars)`

    // Call API
    uploadStatus.value = 'Calling API...'
    console.log('📤 Calling /api/analyze...')
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: base64Image })
    })
    
    console.log('📥 Response status:', response.status)
    uploadStatus.value = `API responded: ${response.status}`

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API error:', errorText)
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ AI result:', result)
    uploadStatus.value = 'AI analysis complete!'

    if (result.error) {
      throw new Error(result.error)
    }

    // Fill form
    console.log('📝 Filling form with:', result)
    form.name = result.name || ''
    form.category = result.category?.toLowerCase() || ''
    form.condition = result.condition?.toLowerCase() || ''
    form.description = result.description || ''
    form.price = result.price || ''

    analyzed.value = true
    uploadStatus.value = 'Form filled! ✨'
    console.log('✨ Success!')

  } catch (error) {
    console.error('❌ Error:', error)
    analyzeError.value = error.message
    uploadStatus.value = `Error: ${error.message}`
  } finally {
    analyzing.value = false
  }
}

const handleSubmit = () => {
  posting.value = true
  setTimeout(() => {
    alert('Item posted! 🎉')
    Object.keys(form).forEach(key => form[key] = '')
    imageFile.value = null
    previewUrl.value = null
    analyzed.value = false
    posting.value = false
    uploadStatus.value = 'Waiting for file...'
    emit('itemPosted')
  }, 1000)
}
</script>