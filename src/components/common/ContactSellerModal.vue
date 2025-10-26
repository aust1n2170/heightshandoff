<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="handleClose">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-800">Contact Seller</h3>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      
      <div class="p-6">
        <div class="mb-4">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-full h-32 object-cover rounded-lg mb-3" />
          <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ item.name }}</h4>
          <p class="text-2xl font-bold text-green-600 mb-3">{{ formatPrice(item.price) }}</p>
          <p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>
        </div>

        <div class="space-y-3 mb-6">
          <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span class="text-2xl mr-3">📧</span>
            <div>
              <p class="font-medium text-gray-800">Email</p>
              <p class="text-sm text-gray-600">ngoau@bc.edu</p>
            </div>
          </div>
          
          <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <span class="text-2xl mr-3">📱</span>
            <div>
              <p class="font-medium text-gray-800">Phone</p>
              <p class="text-sm text-gray-600">7816600372</p>
            </div>
          </div>

          <div class="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span class="text-2xl mr-3">📍</span>
            <div>
              <p class="font-medium text-gray-800">Location</p>
              <p class="text-sm text-gray-600">Duchesne East</p>
            </div>
          </div>
        </div>

        <button @click="handleClose" class="w-full bg-secondary text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
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
</script>
