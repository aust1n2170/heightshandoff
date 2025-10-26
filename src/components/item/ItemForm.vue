<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">List an Item</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Upload Photo *
          </label>
          
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            @change="handleImageUpload" 
            class="hidden" 
            required 
          />
          
          <div
            @click="$refs.fileInput.click()"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all',
              isDragging ? 'border-secondary bg-secondary/10' : 'border-gray-300 hover:border-secondary hover:bg-gray-50'
            ]"
          >
                                                <div v-if="!previewUrl" class="space-y-4">
              <div class="flex justify-center">
                <img :src="uploadIcon" alt="Upload" class="w-24 h-24 opacity-50" />
              </div>
              <div>
                <p class="text-lg font-semibold text-gray-700">Click to upload or drag and drop</p>
   
              </div>
            </div>
            <div v-else class="space-y-4">
              <img :src="previewUrl" alt="Preview" class="h-48 w-full object-cover rounded-lg shadow-md mx-auto" />
              <p class="text-sm text-gray-600">Click to change photo</p>
            </div>
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
          <p class="text-red-700 font-bold">AI Analysis Failed</p>
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
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" 
              required 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select 
              v-model="form.category" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" 
              required
            >
              <option value="">Select category</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="textbooks">Textbooks</option>
              <option value="decor">Decor</option>
              <option value="events">Events</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
            <select 
              v-model="form.condition" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" 
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
              placeholder="Brief description of the item" 
              rows="3" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
            <input 
              v-model="form.price" 
              type="text" 
              placeholder="e.g., $15 or FREE" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input 
              v-model="form.location" 
              type="text" 
              placeholder="e.g., Walsh Hall, 2nd Floor" 
              class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" 
              required 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="your.email@bc.edu" 
                class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input 
                v-model="form.phone" 
                type="tel" 
                placeholder="(555) 123-4567" 
                class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="posting || analyzing" 
          class="w-full mt-6 bg-secondary text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <span v-if="posting">Posting...</span>
          <span v-else-if="analyzing">Analyzing...</span>
          <span v-else>List Item</span>
        </button>
      </form>
    </div>

    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showSuccessModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">Success!</h3>
          <button @click="showSuccessModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-6">
          <div class="text-center mb-6">
            <div class="text-6xl mb-4 animate-bounce">🎉</div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">Item Posted!</h4>
            <p class="text-gray-600">Your item is now live on the marketplace</p>
          </div>

          <button @click="showSuccessModal = false" class="w-full bg-secondary text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Great!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useItems } from '../../firebase/useItems'
import uploadIcon from '../../assets/upload-icon.png'
import { db } from '../../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'

const props = defineProps({
  user: { type: Object, default: null }
})

const emit = defineEmits(['itemPosted'])

const { addItem, loading: posting } = useItems()

const userProfile = ref(null)

const imageFile = ref(null)
const previewUrl = ref(null)
const analyzing = ref(false)
const analyzed = ref(false)
const analyzeError = ref(null)
const isDragging = ref(false)
const fileInput = ref(null)
const showSuccessModal = ref(false)

const form = reactive({
  name: '',
  category: '',
  condition: '',
  description: '',
  price: '',
  location: '',
  email: '',
  phone: ''
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
  await processFile(file)
}

const handleDrop = async (event) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file')
    return
  }
  
  await processFile(file)
}

const processFile = async (file) => {
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  analyzed.value = false
  analyzeError.value = null
  analyzing.value = true
  isDragging.value = false

  console.log('Starting AI analysis...')

  try {
    const { base64, mimeType } = await fileToBase64(file)
    console.log('Calling /api/analyze...')
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, mimeType })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('AI result:', result)

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
    console.error('Error:', error)
    analyzeError.value = error.message || 'Analysis failed. Please try again.'
  } finally {
    analyzing.value = false
  }
}

const loadUserProfile = async () => {
  if (!props.user?.uid) return
  
  try {
    const userRef = doc(db, 'users', props.user.uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      userProfile.value = userSnap.data()
      
      // Pre-fill form with user data
      form.email = props.user.email || ''
      form.phone = userProfile.value?.phoneNumber || ''
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

const handleSubmit = async () => {
  if (!imageFile.value) {
    alert('Please upload an image')
    return
  }

  try {
    console.log('Saving...')
    
    await addItem(form, imageFile.value)
    
    showSuccessModal.value = true
    
    Object.keys(form).forEach(key => form[key] = '')
    imageFile.value = null
    previewUrl.value = null
    analyzed.value = false
    analyzeError.value = null
    
    // Re-load user profile data
    await loadUserProfile()
    
    emit('itemPosted')
    
  } catch (error) {
    console.error('Firebase error:', error)
    alert('Error posting item. Please try again.\n\n' + (error.message || 'Unknown error'))
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>