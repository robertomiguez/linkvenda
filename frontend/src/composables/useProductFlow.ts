import { ref } from 'vue'
import { api } from '../services/api'
import { generatePost } from '../services/templates'
import storage from '../services/storage'
import type { Product } from '../types'

export function useProductFlow() {
  const isLoading = ref(false)
  const isCooldown = ref(false)
  const error = ref('')
  const currentProduct = ref<Product | null>(null)
  const generatedText = ref('')

  const generationCount = ref(0)

  const handleExtract = async (url: string) => {
    isLoading.value = true
    error.value = ''
    currentProduct.value = null
    generatedText.value = ''
    generationCount.value = 0

    try {
      const data = await api.extract(url)
      if (data.error) throw new Error(data.error)

      currentProduct.value = { ...data, url }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao extrair link.'
      error.value = message
    } finally {
      isLoading.value = false
    }
  }

  const handleGenerate = async () => {
    if (!currentProduct.value || isLoading.value || isCooldown.value) return

    isCooldown.value = true
    setTimeout(() => { isCooldown.value = false }, 3000)

    try {
      const content = generatePost(
        currentProduct.value.title,
        currentProduct.value.price,
        currentProduct.value.url
      )
      generatedText.value = content
      generationCount.value++

      // Auto save in background in IndexedDB
      storage.savePost({
        url: currentProduct.value.url,
        title: currentProduct.value.title,
        price: currentProduct.value.price,
        image: currentProduct.value.image,
        content,
        template: 'Aleatório',
      }).catch(console.error)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao gerar texto.'
      error.value = 'Falha ao gerar texto: ' + message
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => { error.value = '' }

  return {
    isLoading,
    isCooldown,
    error,
    currentProduct,
    generatedText,
    generationCount,
    handleExtract,
    handleGenerate,
    clearError,
  }
}
