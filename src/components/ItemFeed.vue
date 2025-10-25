<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Available Items</h2>
      
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="selectedCategory = cat.value"
          :class="['px-4 py-2 rounded-full font-medium transition', selectedCategory === cat.value ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin text-4xl mb-4">⚡</div>
      <p class="text-gray-500 text-lg">Loading items...</p>
    </div>

    <div v-else-if="items.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📦</div>
      <p class="text-gray-500 text-lg mb-2">No items found</p>
      <p class="text-gray-400">Be the first to list an item!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item.id" class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <img :src="item.imageUrl" :alt="item.name" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">{{ item.name }}</h3>
          <p class="text-gray-600 text-sm mb-3">{{ item.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-green-600">{{ item.price }}</span>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Contact</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
const items = ref([])
const loading = ref(false)

onMounted(() => {
  items.value = []
})
</script>