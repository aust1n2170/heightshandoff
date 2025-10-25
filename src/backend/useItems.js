import { ref } from 'vue'
import { db, storage } from '../firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  serverTimestamp
} from 'firebase/firestore'
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage'

export function useItems() {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchItems = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      let q = query(
        collection(db, 'items'), 
        orderBy('createdAt', 'desc')
      )

      if (filters.category && filters.category !== 'all') {
        q = query(
          collection(db, 'items'),
          where('category', '==', filters.category),
          orderBy('createdAt', 'desc')
        )
      }

      const snapshot = await getDocs(q)
      items.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      console.log(`✅ Fetched ${items.value.length} items`)
      return items.value
    } catch (err) {
      error.value = err.message
      console.error('❌ Error fetching items:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const addItem = async (itemData, imageFile) => {
    loading.value = true
    error.value = null

    try {
      console.log('📤 Uploading image to Firebase Storage...')
      
      const timestamp = Date.now()
      const imageRef = storageRef(
        storage, 
        `items/${timestamp}_${imageFile.name}`
      )
      
      await uploadBytes(imageRef, imageFile)
      const imageUrl = await getDownloadURL(imageRef)
      
      console.log('✅ Image uploaded:', imageUrl)
      console.log('📝 Adding item to Firestore...')

      const docRef = await addDoc(collection(db, 'items'), {
        ...itemData,
        imageUrl,
        createdAt: serverTimestamp(),
        userId: 'demo-user',
        views: 0,
        saved: 0
      })

      console.log('✅ Item added with ID:', docRef.id)
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('❌ Error adding item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem
  }
}