<template>
  <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full">
    <button 
      @click="$emit('close')"
      class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none"
    >
      &times;
    </button>
    
    <div class="p-8">
      <h2 class="text-3xl font-bold mb-2 text-gray-800">
        {{ isLoginMode ? 'Welcome Back' : 'Create Account' }}
      </h2>
      <p class="text-gray-600 mb-6">
        {{ isLoginMode ? 'Sign in to continue' : 'Join BC\'s Circular Economy' }}
      </p>

      <div v-if="authError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ authError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your.email@bc.edu"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <div v-if="!isLoginMode">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span class="text-gray-500 text-xs">(optional)</span>
          </label>
          <input 
            v-model="phoneNumber"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="(555) 123-4567"
          />
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-primary text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Sign Up') }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <button 
          @click="isLoginMode = !isLoginMode"
          class="text-primary hover:underline font-medium"
        >
          {{ isLoginMode ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../../firebase/useAuth'

const emit = defineEmits(['close'])

const { signIn, signUp, loading } = useAuth()

const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const phoneNumber = ref('')
const authError = ref('')

const handleSubmit = async () => {
  authError.value = ''
  
  const result = isLoginMode.value 
    ? await signIn(email.value, password.value)
    : await signUp(email.value, password.value, phoneNumber.value)

  if (result.success) {
    emit('close')
    email.value = ''
    password.value = ''
    phoneNumber.value = ''
  } else {
    authError.value = result.error || 'Authentication failed. Please try again.'
  }
}
</script>

