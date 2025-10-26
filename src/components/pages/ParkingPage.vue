<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-2">Parking Spots</h2>
      <p class="text-gray-600 mb-6">Find or list parking spots near Boston College</p>
      
      <div class="flex gap-4 mb-6">
        <button
          @click="showMap = true"
          :class="['px-6 py-2 rounded-lg font-medium transition', showMap ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          Map View
        </button>
        <button
          @click="showMap = false"
          :class="['px-6 py-2 rounded-lg font-medium transition', !showMap ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          List View
        </button>
      </div>
    </div>

    <div v-if="showMap" class="bg-white rounded-lg shadow-lg overflow-hidden" style="height: 600px;">
      <div id="map" style="height: 100%; width: 100%;"></div>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="spot in parkingSpots" 
        :key="spot.address"
        class="bg-white rounded-lg shadow-lg p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-xl font-semibold text-gray-800">{{ spot.address }}</h3>
            <p class="text-gray-600 text-sm">{{ spot.distance }}</p>
          </div>
          <span :class="['px-3 py-1 rounded-full text-sm font-medium', 
            spot.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
            {{ spot.status }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold text-primary">{{ spot.price }}</div>
          <button class="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-blue-700 transition font-medium">
            View Details
          </button>
        </div>
      </div>

      <button @click="showAddForm = true" class="w-full mt-6 bg-primary text-white py-4 rounded-lg hover:bg-green-700 transition font-medium text-lg">
        + List Your Parking Spot
      </button>
    </div>

    <div v-if="showAddForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800">List Your Parking Spot</h2>
        </div>
        <form @submit.prevent="submitSpot" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input v-model="spotForm.address" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price per Month</label>
              <input v-model="spotForm.price" type="number" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Distance from BC</label>
              <input v-model="spotForm.distance" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="spotForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button type="button" @click="showAddForm = false" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition font-medium">
              List Spot
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const showMap = ref(true)
const showAddForm = ref(false)
const spotForm = ref({
  address: '',
  price: '',
  distance: '',
  description: ''
})

const bcLat = 42.3387
const bcLng = -71.1691

const parkingSpots = [
  { 
    lat: 42.34589, 
    lng: -71.15762, 
    address: '160 Foster Street', 
    price: '$200/mo',
    distance: '0.5 miles from BC',
    status: 'Available'
  },
  { 
    lat: 42.34801, 
    lng: -71.16016, 
    address: '245 Lake Street', 
    price: '$180/mo',
    distance: '0.8 miles from BC',
    status: 'Available'
  },
  { 
    lat: 42.33675, 
    lng: -71.17435, 
    address: '18 Crosby Rd', 
    price: '$220/mo',
    distance: '0.3 miles from BC',
    status: 'Pending'
  }
]

let map = null

const initMap = () => {
  nextTick(() => {
    if (map) {
      map.remove()
    }
    
    map = L.map('map').setView([bcLat, bcLng], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    parkingSpots.forEach(spot => {
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: #8A100B;
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 12px;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">${spot.price}</div>
        `,
        iconSize: [100, 30],
        iconAnchor: [50, 30]
      })

      L.marker([spot.lat, spot.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${spot.address}</b><br>${spot.price}`)
    })
  })
}

watch(showMap, (newValue) => {
  if (newValue && !map) {
    initMap()
  }
})

const submitSpot = () => {
  console.log('Submitting parking spot:', spotForm.value)
  alert('Parking spot listed successfully!')
  showAddForm.value = false
  spotForm.value = {
    address: '',
    price: '',
    distance: '',
    description: ''
  }
}

onMounted(() => {
  initMap()
})
</script>

<style scoped>
:deep(.leaflet-container) {
  font-family: inherit;
}
</style>

