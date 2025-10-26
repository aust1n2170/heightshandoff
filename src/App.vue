<template>
  <div class="min-h-screen bg-gray-50">
    <NavigationBar 
      :currentView="currentView"
      :user="user"
      @navigate="currentView = $event"
      @search="handleSearch"
      @toggleLogin="showLogin = !showLogin"
    />

    <main class="py-8">
      <ItemFeed 
        v-if="currentView === 'feed'" 
        ref="itemFeedRef"
        :searchQuery="searchQuery"
        :user="user"
        @showLogin="showLogin = true"
      />
      <ItemForm 
        v-else-if="currentView === 'post'"
        @itemPosted="handleItemPosted"
      />
      <ParkingPage 
        v-else-if="currentView === 'parking'"
      />
      <ProfilePage 
        v-else-if="currentView === 'profile'"
        :user="user"
        @navigate="currentView = $event"
        @logout="handleLogout"
      />
      <BuyRequestsPage
        v-else-if="currentView === 'buy-requests'"
        :user="user"
        @showLogin="showLogin = true"
      />
    </main>

    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <div class="text-2xl mb-2">Heights Handoff</div>
        <p class="text-gray-400 mb-4">Building BC's Circular Economy</p>
        <p class="text-gray-500 text-xs mt-6">
          by Austin Ngo, Eddie Yang, Eshaan Chatrath, Kai Shim
        </p>
      </div>
    </footer>
  </div>

    <div v-if="showLogin" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Login @close="showLogin = false" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ItemFeed from './components/item/ItemFeed.vue'
import ItemForm from './components/item/ItemForm.vue'
import ParkingPage from './components/pages/ParkingPage.vue'
import Login from './components/auth/Login.vue'
import ProfilePage from './components/pages/ProfilePage.vue'
import BuyRequestsPage from './components/pages/BuyRequestsPage.vue'
import { useAuth } from './firebase/useAuth'
import NavigationBar from './components/NavigationBar.vue'

const { user, signOut } = useAuth()

const currentView = ref('feed')
const itemFeedRef = ref(null)
const searchQuery = ref('')
const showLogin = ref(false)

const handleSearch = (query) => {
  searchQuery.value = query
}

const handleItemPosted = () => {
  currentView.value = 'feed'
  

  setTimeout(() => {
    if (itemFeedRef.value?.refresh) {
      itemFeedRef.value.refresh()
    }
  }, 100)
}

const handleLogout = () => {
  signOut()
  currentView.value = 'feed'
}
</script>