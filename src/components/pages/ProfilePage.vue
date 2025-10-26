<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-primary p-8 text-white">
        <div class="flex items-center space-x-6">
          <div class="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-5xl">
            {{ userInitials }}
          </div>
          <div>
            <h1 class="text-3xl font-bold">{{ userEmail }}</h1>
            <p class="text-gray-300 text-sm">Heights Handoff Member</p>
          </div>
        </div>
      </div>

      <div class="p-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">📧</span>
              <h3 class="font-semibold text-gray-800">Email</h3>
            </div>
            <p class="text-gray-600">{{ userEmail }}</p>
          </div>

          <div class="bg-green-50 rounded-lg p-6 border border-green-200">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">📱</span>
              <h3 class="font-semibold text-gray-800">Phone Number</h3>
            </div>
            <p class="text-gray-600">{{ userPhoneNumber || 'Not provided' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-primary text-white rounded-lg p-6 text-center">
            <div class="text-4xl mb-2">{{ itemsPosted }}</div>
            <div class="text-green-100 text-sm">Items Posted</div>
          </div>
          <div class="bg-secondary text-white rounded-lg p-6 text-center">
            <div class="text-4xl mb-2">{{ itemsSold }}</div>
            <div class="text-blue-100 text-sm">Items Sold</div>
          </div>
        </div>

        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">My Listings</h3>
          <div v-if="myItems.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
            <div class="text-5xl mb-2">📦</div>
            <p class="text-gray-500">No items listed yet</p>
            <button 
              @click="$emit('navigate', 'post')"
              class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Post an Item
            </button>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in myItems" :key="item.id" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
              <img :src="item.imageUrl" :alt="item.name" class="w-full h-32 object-cover" />
              <div class="p-4">
                <h4 class="font-semibold text-gray-800 mb-1">{{ item.name }}</h4>
                <p class="text-green-600 font-bold">{{ item.price }}</p>
                <button class="mt-2 w-full text-sm py-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <button 
            @click="handleEditProfile"
            class="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-blue-700 transition font-medium mr-3"
          >
            Edit Profile
          </button>
          <button 
            @click="handleLogout"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">Edit Profile</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="editForm.email"
              type="email"
              disabled
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input 
              v-model="editForm.phoneNumber"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="(555) 123-4567"
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button @click="showEditModal = false" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium flex-1">
              Cancel
            </button>
            <button @click="handleSaveProfile" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium flex-1">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../firebase/useAuth'
import { db } from '../../firebase/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const props = defineProps({
  user: { type: Object, required: true }
})

const emit = defineEmits(['navigate', 'logout'])

const { signOut } = useAuth()

const myItems = ref([])
const itemsPosted = ref(0)
const itemsSold = ref(0)
const showEditModal = ref(false)
const userProfile = ref(null)
const editForm = ref({
  email: '',
  phoneNumber: ''
})

const userEmail = computed(() => props.user?.email || '')
const userPhoneNumber = computed(() => userProfile.value?.phoneNumber || '')

const userInitials = computed(() => {
  const email = props.user?.email || ''
  return email.substring(0, 2).toUpperCase()
})

const handleEditProfile = () => {
  editForm.value = {
    email: props.user.email,
    phoneNumber: userProfile.value?.phoneNumber || ''
  }
  showEditModal.value = true
}

const handleSaveProfile = async () => {
  try {
    const userRef = doc(db, 'users', props.user.uid)
    await updateDoc(userRef, {
      phoneNumber: editForm.value.phoneNumber
    })
    alert('Profile updated successfully!')
    showEditModal.value = false
    await loadUserProfile()
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Failed to update profile')
  }
}

const handleLogout = async () => {
  await signOut()
  emit('logout')
}

const loadUserProfile = async () => {
  if (!props.user?.uid) return
  
  try {
    const userRef = doc(db, 'users', props.user.uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      userProfile.value = userSnap.data()
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

// TODO: Load user's items from Firestore
const loadMyItems = async () => {
  // This would fetch items where userId matches the current user
  myItems.value = []
}

onMounted(() => {
  loadUserProfile()
  loadMyItems()
})
</script>

