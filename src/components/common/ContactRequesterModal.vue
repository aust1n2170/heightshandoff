<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="handleClose">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-xl font-bold text-gray-800">Reply to Request</h3>
        <button @click="handleClose" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      
      <div class="p-6">
        <div class="mb-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ request?.title }}</h4>
          <p class="text-green-600 font-bold text-xl mb-3">{{ request?.budget }}</p>
          <p class="text-gray-600 text-sm mb-4">{{ request?.description }}</p>
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
              <p class="text-sm text-gray-600">{{ request?.location || 'BC Campus' }}</p>
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
  request: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>
