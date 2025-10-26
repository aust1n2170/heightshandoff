<template>
  <nav class="bg-primary text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-2 cursor-pointer" @click="$emit('navigate', 'feed')">
          <span class="text-2xl font-bold">Heights Handoff</span>
        </div>

        <div class="hidden md:flex items-center space-x-6">
          <button
            @click="$emit('navigate', 'feed')"
            :class="['hover:text-gray-200 transition-all duration-300 hover:scale-110 font-medium relative', currentView === 'feed' ? 'border-b-2 border-white' : '']"
          >
            Browse
          </button>
          <button
            @click="$emit('navigate', 'post')"
            :class="['hover:text-gray-200 transition-all duration-300 hover:scale-110 font-medium relative', currentView === 'post' ? 'border-b-2 border-white' : '']"
          >
            Post Item
          </button>
          <button
            @click="$emit('navigate', 'parking')"
            :class="['hover:text-gray-200 transition-all duration-300 hover:scale-110 font-medium relative', currentView === 'parking' ? 'border-b-2 border-white' : '']"
          >
            Parking
          </button>
          <button
            @click="$emit('navigate', 'buy-requests')"
            :class="['hover:text-gray-200 transition-all duration-300 hover:scale-110 font-medium relative', currentView === 'buy-requests' ? 'border-b-2 border-white' : '']"
          >
            Buy Requests
          </button>
          <div class="relative flex items-center space-x-2">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                @input="handleSearchInput"
                @focus="showSuggestions = true"
                @blur="handleBlur"
                type="text"
                placeholder="Search items..."
                class="pl-10 pr-3 py-1.5 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white w-64"
              />
            </div>
            <transition name="fade">
            <div v-if="showSuggestions && searchSuggestions.length > 0 && searchQuery" class="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto z-50 animate-slideIn">
              <div
                v-for="suggestion in searchSuggestions"
                :key="suggestion.id"
                @mousedown.prevent="selectSuggestion(suggestion.name)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div class="font-medium text-gray-900">{{ suggestion.name }}</div>
                <div class="text-xs text-gray-500 truncate">{{ suggestion.category }} • {{ suggestion.price }}</div>
              </div>
            </div>
            </transition>
          </div>
          
          <div class="flex items-center space-x-2">
            <div v-if="user" class="flex items-center space-x-2">
              <button
                @click="$emit('navigate', 'profile')"
                class="text-sm hidden lg:block underline cursor-pointer hover:text-gray-200 transition"
              >
                {{ user.email }}
              </button>
              <button
                @click="handleLogout"
                class="px-4 py-1.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium hover:scale-105 active:scale-95"
              >
                Logout
              </button>
            </div>
            <button
              v-else
              @click="$emit('toggleLogin')"
              class="px-4 py-1.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </div>
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
        <input
          v-model="searchQuery"
          @input="$emit('search', searchQuery)"
          type="text"
          placeholder="Search items..."
          class="w-full px-3 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button @click="handleMobileNav('post')" class="block w-full text-left py-2 hover:bg-green-600 px-3 rounded">Post Item</button>
        <button @click="handleMobileNav('parking')" class="block w-full text-left py-2 hover:bg-green-600 px-3 rounded">Parking</button>
        <button @click="handleMobileNav('buy-requests')" class="block w-full text-left py-2 hover:bg-green-600 px-3 rounded">Buy Requests</button>
        <button v-if="user" @click="handleMobileNav('profile')" class="block w-full text-left py-2 hover:bg-green-600 px-3 rounded">Profile</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useItems } from '../firebase/useItems'
import { useAuth } from '../firebase/useAuth'

const props = defineProps({
  currentView: { type: String, default: 'feed' },
  user: { type: Object, default: null }
})

const emit = defineEmits(['navigate', 'search', 'toggleLogin'])
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)

const { items, fetchItems } = useItems()

const searchSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 1) return []
  
  const query = searchQuery.value.toLowerCase()
  const matches = items.value.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.category?.toLowerCase().includes(query)
  )
  
  // Return top 5 matches
  return matches.slice(0, 5)
})

const handleSearchInput = () => {
  emit('search', searchQuery.value)
}

const selectSuggestion = (name) => {
  searchQuery.value = name
  emit('search', searchQuery.value)
  showSuggestions.value = false
}

const handleBlur = () => {
  // Delay to allow click on suggestion to register
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const handleMobileNav = (view) => {
  emit('navigate', view)
  mobileMenuOpen.value = false
}

const handleLogout = async () => {
  const { signOut } = useAuth()
  await signOut()
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
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
  animation: slideIn 0.3s ease-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
