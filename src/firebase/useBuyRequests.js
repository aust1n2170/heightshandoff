import { ref } from 'vue'
import { db } from './firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

export function useBuyRequests() {
  const buyRequests = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchBuyRequests = async () => {
    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'buyRequests'), 
        orderBy('postedDate', 'desc')
      )

      const snapshot = await getDocs(q)
      buyRequests.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      console.log(`Fetched ${buyRequests.value.length} buy requests`)
      return buyRequests.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching buy requests:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const addBuyRequest = async (requestData) => {
    loading.value = true
    error.value = null

    try {
      console.log('Adding buy request to Firestore...')

      const docRef = await addDoc(collection(db, 'buyRequests'), {
        ...requestData,
        postedDate: serverTimestamp(),
        status: 'Open'
      })

      console.log('Buy request added with ID:', docRef.id)
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('Error adding buy request:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    buyRequests,
    loading,
    error,
    fetchBuyRequests,
    addBuyRequest
  }
}
