<template>
  <nav class="bg-green-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-2 cursor-pointer" @click="$emit('navigate', 'feed')">
          <span class="text-3xl">♻️</span>
          <span class="text-2xl font-bold">Thrift Loop</span>
        </div>

        <div class="hidden md:flex space-x-6">
          <button
            @click="$emit('navigate', 'feed')"
            :class="['hover:text-gray-200 transition font-medium', currentView === 'feed' ? 'border-b-2 border-white' : '']"
          >
            Browse
          </button>
          <button
            @click="$emit('navigate', 'post')"
            :class="['hover:text-gray-200 transition font-medium', currentView === 'post' ? 'border-b-2 border-white' : '']"
          >
            Post Item
          </button>
        </div>

        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-white p-2">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden bg-green-700 pb-4">
      <div class="px-4 space-y-2">
        <button @click="handleMobileNav('feed')" class="block w-full text-left py-2 hover:bg-green-600 px-3 rounded">Browse</button>
        <button @click="handleMobileNav('post')" class="block w-full text-left py-2 hover:bg-green-600 px-3 rounded">Post Item</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  currentView: { type: String, default: 'feed' }
})

const emit = defineEmits(['navigate'])
const mobileMenuOpen = ref(false)

const handleMobileNav = (view) => {
  emit('navigate', view)
  mobileMenuOpen.value = false
}
</script>