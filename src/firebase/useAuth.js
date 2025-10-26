import { ref, onMounted } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc } from 'firebase/firestore'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  })

  const signIn = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Sign in error:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email, password, phoneNumber = '') => {
    try {
      loading.value = true
      error.value = null
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      if (phoneNumber) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          phoneNumber: phoneNumber,
          createdAt: new Date(),
          displayName: email.split('@')[0]
        })
      } else {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          phoneNumber: '',
          createdAt: new Date(),
          displayName: email.split('@')[0]
        })
      }

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Sign up error:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      loading.value = true
      await firebaseSignOut(auth)
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Sign out error:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  }
}

