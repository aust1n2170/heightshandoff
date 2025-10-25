<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar 
      :currentView="currentView"
      @navigate="currentView = $event"
    />

    <main class="py-8">
      <ItemFeed 
        v-if="currentView === 'feed'" 
        ref="itemFeedRef"
      />
      <ItemForm 
        v-else-if="currentView === 'post'"
        @itemPosted="handleItemPosted"
      />
      <ImpactDashboard v-else-if="currentView === 'impact'" />
    </main>

    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <div class="text-2xl mb-2">Thrift Loop</div>
        <p class="text-gray-400 mb-4">Building BC's Circular Economy</p>
        <p class="text-gray-500 text-xs mt-6">
          Built by Austin Ngo, Eddie Yang, Eshaan Chatrath, Kai Shim
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ItemFeed from './components/ItemFeed.vue'
import ItemForm from './components/ItemForm.vue'
import Navbar from './components/Navbar.vue'

const currentView = ref('feed')
const itemFeedRef = ref(null)

const handleItemPosted = () => {
  currentView.value = 'feed'
  

  setTimeout(() => {
    if (itemFeedRef.value?.refresh) {
      itemFeedRef.value.refresh()
    }
  }, 100)
}
</script>