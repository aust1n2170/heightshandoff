<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Available Items</h2>
      
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="handleCategoryChange(cat.value)"
          :class="['px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-110', selectedCategory === cat.value ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 animate-pulse">
      <div class="inline-block text-6xl mb-4 animate-bounce">⚡</div>
      <p class="text-gray-500 text-lg animate-pulse">Loading items...</p>
    </div>

    <div v-else-if="filteredItems.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📦</div>
      <p class="text-gray-500 text-lg mb-2">No items found</p>
      <p class="text-gray-400">Be the first to list an item!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, index) in filteredItems" :key="item.id" 
        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn cursor-pointer flex flex-col"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="viewItemDetail(item)">
        <div @click.stop="enlargeImage(item.imageUrl)" class="cursor-pointer hover:opacity-90 transition">
          <img :src="item.imageUrl" :alt="item.name" class="w-full h-48 object-cover" />
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h3 class="text-xl font-semibold mb-2 truncate">{{ item.name }}</h3>
          <div class="flex items-center justify-between mb-3">
            <span :class="getConditionColor(item.condition)" class="px-3 py-1 rounded-full text-xs font-medium">
              {{ item.condition }}
            </span>
            <span class="text-2xl font-bold text-green-600">{{ formatPrice(item.price) }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
          <div class="mt-auto">
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>📍 {{ item.location || 'BC Campus' }}</span>
              <span>{{ getTimeAgo(item.createdAt) }}</span>
            </div>
            <button @click.stop="handleContact(item)" class="w-full bg-secondary text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
              Contact Seller
            </button>
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
      :show="showMessageCard" 
      :item="selectedItem" 
      @close="closeMessageCard" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useItems } from '../../firebase/useItems'
import ContactSellerModal from '../common/ContactSellerModal.vue'

const props = defineProps({
  searchQuery: { type: String, default: '' },
  user: { type: Object, default: null }
})

const emit = defineEmits(['showLogin', 'viewItemDetail'])

const { items, loading, fetchItems } = useItems()

const filteredItems = computed(() => {
  let result = items.value
  
  if (selectedCategory.value !== 'all') {
    result = result.filter(item => item.category === selectedCategory.value)
  }
  
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
  { value: 'events', label: 'Events' },
  { value: 'other', label: 'Other' }
]

const selectedCategory = ref('all')
const showMessageCard = ref(false)
const selectedItem = ref(null)
const showEnlargedImage = ref(false)
const enlargedImage = ref('')

const handleCategoryChange = (category) => {
  selectedCategory.value = category
}

const handleContact = (item) => {
  if (!props.user) {
    emit('showLogin')
    return
  }
  
  selectedItem.value = item
  showMessageCard.value = true
}

const closeMessageCard = () => {
  showMessageCard.value = false
  selectedItem.value = null
}

const viewItemDetail = (item) => {
  emit('viewItemDetail', item)
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

const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now'
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && showEnlargedImage.value) {
    closeEnlargedImage()
  }
}

onMounted(() => {
  fetchItems()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

defineExpose({
  refresh: () => fetchItems()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slideIn {
  animation: slideIn 0.4s ease-out;
}
</style>