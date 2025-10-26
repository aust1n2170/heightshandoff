<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-2">Buy Requests</h2>
      <p class="text-gray-600 mb-6">What are you looking for? Post your request here!</p>
      
      <div class="flex gap-4 mb-6">
        <button
          @click="viewMode = 'browse'"
          :class="['px-6 py-2 rounded-lg font-medium transition', viewMode === 'browse' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          Browse Requests
        </button>
        <button
          @click="viewMode = 'post'"
          :class="['px-6 py-2 rounded-lg font-medium transition', viewMode === 'post' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          Post a Request
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'browse'">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin text-4xl mb-4">⚡</div>
        <p class="text-gray-500 text-lg">Loading buy requests...</p>
      </div>

      <div v-else-if="buyRequests.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📋</div>
        <p class="text-gray-500 text-lg mb-2">No buy requests yet</p>
        <p class="text-gray-400">Be the first to post a buy request!</p>
      </div>

      <div v-else class="space-y-6">
        <div v-for="request in buyRequests" :key="request.id" class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ request.title }}</h3>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span class="flex items-center">
                <span class="mr-1">⏰</span>
                {{ formatPostedDate(request.postedDate) }}
              </span>
              <span class="flex items-center">
                <span class="mr-1">📍</span>
                {{ request.location }}
              </span>
            </div>
          </div>
          <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusClass(request.status)]">
            {{ request.status }}
          </span>
        </div>
        
        <p class="text-gray-700 mb-4">{{ request.description }}</p>
        
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex items-center bg-green-50 px-4 py-2 rounded-lg">
            <span class="font-semibold text-gray-700 mr-2">Budget:</span>
            <span class="text-green-600 font-bold text-lg">{{ request.budget }}</span>
          </div>
          <div v-if="request.category" class="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
            <span class="font-semibold text-gray-700 mr-2">Category:</span>
            <span class="text-blue-600 font-medium">{{ request.category }}</span>
          </div>
        </div>

        <button @click="handleReplyRequest(request)" class="w-full bg-secondary text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
          Reply to Request
        </button>
      </div>
      </div>
    </div>

    <div v-else class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Post a Buy Request</h2>

        <form @submit.prevent="submitRequest" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">What are you looking for? *</label>
            <input 
              v-model="requestForm.title"
              type="text"
              required
              placeholder="e.g., Looking for a desk"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea 
              v-model="requestForm.description"
              rows="4"
              required
              placeholder="Provide details about what you're looking for..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Budget *</label>
              <input 
                v-model="requestForm.budget"
                type="text"
                required
                placeholder="e.g., $50-100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                v-model="requestForm.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input 
              v-model="requestForm.location"
              type="text"
              placeholder="e.g., BC Campus"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div class="flex gap-4 pt-4">
            <button 
              @click="viewMode = 'browse'" 
              type="button"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium flex-1"
            >
              Post Request
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">Reply to Request</h3>
          <button @click="closeContactModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-6">
          <div class="mb-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ selectedRequest?.title }}</h4>
            <p class="text-green-600 font-bold text-xl mb-3">{{ selectedRequest?.budget }}</p>
            <p class="text-gray-600 text-sm mb-4">{{ selectedRequest?.description }}</p>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span class="text-2xl mr-3">📧</span>
              <div>
                <p class="font-medium text-gray-800">Email</p>
                <p class="text-sm text-gray-600">requester@bc.edu</p>
              </div>
            </div>
            
            <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span class="text-2xl mr-3">📱</span>
              <div>
                <p class="font-medium text-gray-800">Phone</p>
                <p class="text-sm text-gray-600">(555) 123-4567</p>
              </div>
            </div>

            <div class="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span class="text-2xl mr-3">📍</span>
              <div>
                <p class="font-medium text-gray-800">Location</p>
                <p class="text-sm text-gray-600">{{ selectedRequest?.location || 'BC Campus' }}</p>
              </div>
            </div>
          </div>

          <button @click="closeContactModal" class="w-full bg-secondary text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBuyRequests } from '../../firebase/useBuyRequests'

const props = defineProps({
  user: { type: Object, default: null }
})

const emit = defineEmits(['showLogin'])

const { buyRequests, loading, fetchBuyRequests, addBuyRequest } = useBuyRequests()

const viewMode = ref('browse')
const showContactModal = ref(false)
const selectedRequest = ref(null)

const requestForm = ref({
  title: '',
  description: '',
  budget: '',
  category: '',
  location: ''
})



const handleReplyRequest = (request) => {
  if (!props.user) {
    emit('showLogin')
    return
  }
  
  selectedRequest.value = request
  showContactModal.value = true
}

const closeContactModal = () => {
  showContactModal.value = false
  selectedRequest.value = null
}

const getStatusClass = (status) => {
  const classes = {
    'Open': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Fulfilled': 'bg-gray-100 text-gray-800',
    'Closed': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatPostedDate = (timestamp) => {
  if (!timestamp) return 'Just now'
  
  // If it's already a string (mock data), return it
  if (typeof timestamp === 'string') {
    return timestamp
  }
  
  // Convert Firestore timestamp to date
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const submitRequest = async () => {
  try {
    console.log('Submitting buy request:', requestForm.value)
    
    await addBuyRequest({
      title: requestForm.value.title,
      description: requestForm.value.description,
      budget: requestForm.value.budget,
      category: requestForm.value.category || '',
      location: requestForm.value.location || 'BC Campus'
    })
    
    alert('Buy request posted successfully!')
    
    // Refresh the buy requests list
    await fetchBuyRequests()
    
    // Reset form
    requestForm.value = {
      title: '',
      description: '',
      budget: '',
      category: '',
      location: ''
    }
    
    viewMode.value = 'browse'
  } catch (error) {
    console.error('Error submitting buy request:', error)
    alert('Failed to post buy request. Please try again.')
  }
}

onMounted(() => {
  fetchBuyRequests()
})
</script>

