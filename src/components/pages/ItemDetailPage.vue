<template>
  <div class="max-w-4xl mx-auto p-6">
    <button @click="goBack" class="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
      </svg>
      Back to Browse
    </button>

    <div class="bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="grid md:grid-cols-2 gap-0">
        <div class="relative">
          <img :src="item.imageUrl" :alt="item.name" class="w-full h-96 object-cover cursor-pointer" @click="enlargeImage(item.imageUrl)" />
          <button v-if="user" @click="handleContact" class="absolute bottom-4 left-4 right-4 bg-secondary text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg">
            Contact Seller
          </button>
        </div>
        
        <div class="p-8">
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ item.name }}</h1>
            <div class="flex items-center justify-between mb-4">
              <span :class="getConditionColor(item.condition)" class="px-4 py-2 rounded-full text-sm font-medium">
                {{ item.condition }}
              </span>
              <span class="text-4xl font-bold text-green-600">{{ formatPrice(item.price) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">Description</h2>
            <p class="text-gray-600 leading-relaxed">{{ item.description || 'No description provided.' }}</p>
          </div>

          <div class="space-y-4 border-t border-gray-200 pt-6">
            <div class="flex items-center text-gray-700">
              <svg class="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <div>
                <p class="font-medium text-gray-800">Category</p>
                <p class="text-sm text-gray-600 capitalize">{{ item.category || 'Not specified' }}</p>
              </div>
            </div>
            
            <div class="flex items-center text-gray-700">
              <svg class="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <div>
                <p class="font-medium text-gray-800">Location</p>
                <p class="text-sm text-gray-600">{{ item.location || 'BC Campus' }}</p>
              </div>
            </div>

            <div class="flex items-center text-gray-700">
              <svg class="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="font-medium text-gray-800">Posted</p>
                <p class="text-sm text-gray-600">{{ formatPostedDate(item.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEnlargedImage" @click="closeEnlargedImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div class="relative max-w-6xl max-h-full">
        <button @click="closeEnlargedImage" class="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center transition">×</button>
        <img :src="enlargedImage" alt="Enlarged view" class="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>

    <ContactSellerModal 
      :show="showContactModal" 
      :item="item" 
      @close="closeContactModal" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ContactSellerModal from '../common/ContactSellerModal.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['goBack', 'showLogin'])

const showEnlargedImage = ref(false)
const enlargedImage = ref('')
const showContactModal = ref(false)

const goBack = () => {
  emit('goBack')
}

const handleContact = () => {
  if (!props.user) {
    emit('showLogin')
  } else {
    showContactModal.value = true
  }
}

const closeContactModal = () => {
  showContactModal.value = false
}

const enlargeImage = (imageUrl) => {
  enlargedImage.value = imageUrl
  showEnlargedImage.value = true
}

const closeEnlargedImage = () => {
  showEnlargedImage.value = false
  enlargedImage.value = ''
}

const getConditionColor = (condition) => {
  const colors = {
    'like new': 'bg-green-100 text-green-800',
    'good': 'bg-blue-100 text-blue-800',
    'fair': 'bg-yellow-100 text-yellow-800',
    'poor': 'bg-red-100 text-red-800'
  }
  return colors[condition?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price) => {
  if (!price) return '$0'
  
  const priceStr = String(price).trim().toUpperCase()
  
  if (priceStr === 'FREE' || priceStr === '0' || priceStr === '$0') {
    return 'FREE'
  }
  
  if (priceStr.startsWith('$')) {
    return priceStr
  }
  
  if (!isNaN(priceStr)) {
    return '$' + priceStr
  }
  
  return '$' + priceStr
}

const formatPostedDate = (timestamp) => {
  if (!timestamp) return 'Just now'
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
</script>
