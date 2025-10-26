<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Available Items</h2>
      
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="handleCategoryChange(cat.value)"
          :class="['px-4 py-2 rounded-full font-medium transition', selectedCategory === cat.value ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin text-4xl mb-4">⚡</div>
      <p class="text-gray-500 text-lg">Loading items...</p>
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📦</div>
      <p class="text-gray-500 text-lg mb-2">No items found</p>
      <p class="text-gray-400">Be the first to list an item!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in filteredItems" :key="item.id" class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <img :src="item.imageUrl" :alt="item.name" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2 truncate">{{ item.name }}</h3>
          <div class="flex items-center justify-between mb-3">
            <span :class="getConditionColor(item.condition)" class="px-3 py-1 rounded-full text-xs font-medium">
              {{ item.condition }}
            </span>
            <span class="text-2xl font-bold text-green-600">{{ formatPrice(item.price) }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>📍 {{ item.location || 'BC Campus' }}</span>
            <span>{{ getTimeAgo(item.createdAt) }}</span>
          </div>
          <button @click="handleContact(item)" class="w-full mt-4 bg-secondary text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
            Contact Seller
          </button>
        </div>
      </div>
    </div>

    <!-- Message Card Modal -->
    <div v-if="showMessageCard" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">Contact Seller</h3>
          <button @click="closeMessageCard" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-6">
          <div class="mb-4">
            <img v-if="selectedItem?.imageUrl" :src="selectedItem.imageUrl" :alt="selectedItem.name" class="w-full h-32 object-cover rounded-lg mb-3" />
            <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ selectedItem?.name }}</h4>
            <p class="text-2xl font-bold text-green-600 mb-3">{{ formatPrice(selectedItem?.price) }}</p>
            <p class="text-gray-600 text-sm mb-4">{{ selectedItem?.description }}</p>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span class="text-2xl mr-3">📧</span>
              <div>
                <p class="font-medium text-gray-800">Email</p>
                <p class="text-sm text-gray-600">seller@bc.edu</p>
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
                <p class="text-sm text-gray-600">{{ selectedItem?.location || 'BC Campus' }}</p>
              </div>
            </div>
          </div>

          <button @click="closeMessageCard" class="w-full bg-secondary text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useItems } from '../../firebase/useItems'

const props = defineProps({
  searchQuery: { type: String, default: '' },
  user: { type: Object, default: null }
})

const emit = defineEmits(['showLogin'])

const { items, loading, fetchItems } = useItems()

const filteredItems = computed(() => {
  let result = items.value
  
  // First apply category filter
  if (selectedCategory.value !== 'all') {
    result = result.filter(item => item.category === selectedCategory.value)
  }
  
  // Then apply search filter
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase().trim()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    )
  }
  
  return result
})

const categories = [
  { value: 'all', label: 'All' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'textbooks', label: 'Textbooks' },
  { value: 'decor', label: 'Decor' },
  { value: 'other', label: 'Other' }
]

const selectedCategory = ref('all')
const showMessageCard = ref(false)
const selectedItem = ref(null)

const handleCategoryChange = (category) => {
  selectedCategory.value = category
  // No need to fetch items - client-side filtering handles it
}

const handleContact = (item) => {
  // Check if user is logged in
  if (!props.user) {
    // Show login modal if not logged in
    emit('showLogin')
    return
  }
  
  // Show message card if logged in
  selectedItem.value = item
  showMessageCard.value = true
}

const closeMessageCard = () => {
  showMessageCard.value = false
  selectedItem.value = null
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
  
  // If it's FREE, return as is
  if (priceStr === 'FREE' || priceStr === '0' || priceStr === '$0') {
    return 'FREE'
  }
  
  // If it already starts with $, return as is
  if (priceStr.startsWith('$')) {
    return priceStr
  }
  
  // If it's a number, add $
  if (!isNaN(priceStr)) {
    return '$' + priceStr
  }
  
  // Otherwise, add $ prefix
  return '$' + priceStr
}

const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now'
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

onMounted(() => {
  fetchItems() // Fetch all items without category filter
})

defineExpose({
  refresh: () => fetchItems() // Refresh all items, filtering is done client-side
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>