<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">List an Item</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Photo *</label>
          <input type="file" accept="image/*" @change="handleImageUpload" class="w-full p-3 border-2 border-gray-300 rounded-lg" required />
          <div v-if="previewUrl" class="mt-4">
            <img :src="previewUrl" alt="Preview" class="h-64 w-full object-cover rounded-lg shadow-md" />
          </div>
        </div>

        <div v-if="loading" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-center space-x-3">
            <div class="animate-spin text-2xl">🤖</div>
            <p class="text-blue-700 font-medium">AI analyzing your item...</p>
          </div>
        </div>

        <div class="space-y-4">
          <input v-model="formData.name" type="text" placeholder="Item name" class="w-full p-3 border-2 border-gray-300 rounded-lg" required />          
          <select v-model="formData.category" class="w-full p-3 border-2 border-gray-300 rounded-lg" required>
            <option value="">Select category</option>
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="textbooks">Textbooks</option>
            <option value="parking">Parking Spots</option>
            <option value="misc">Miscellaneous</option>
          </select>

          <textarea v-model="formData.description" placeholder="Description" rows="3" class="w-full p-3 border-2 border-gray-300 rounded-lg" />
          
          <input v-model="formData.price" type="text" placeholder="Price (e.g., $15 or FREE)" class="w-full p-3 border-2 border-gray-300 rounded-lg" required />
        </div>

        <button type="submit" :disabled="loading" class="w-full mt-6 bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400">
          {{ loading ? 'Posting...' : 'List Item' }}
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
const loading = ref(false)

const formData = reactive({
  name: '',
  category: '',
  description: '',
  price: ''
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const handleSubmit = async () => {
  alert('Item posted!')
  emit('itemPosted')
}
</script>