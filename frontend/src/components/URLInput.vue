<script setup lang="ts">
import { ref } from 'vue'

const url = ref('')
const isCooldown = ref(false)
const validationError = ref('')
const emit = defineEmits(['submit'])

const ALLOWED_DOMAINS = [
  'mercadolivre.com.br',
  'mercadolibre.com',
  'meli.la',
  'amazon.com.br',
  'amazon.com',
  'a.co',
  'amzn.to',
]

const validateUrl = (input: string): string | null => {
  try {
    const parsed = new URL(input)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'Use um link http ou https.'
    }
    const hostname = parsed.hostname.toLowerCase()
    const isAllowed = ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain))
    if (!isAllowed) {
      return 'Apenas links do Mercado Livre e Amazon são aceitos.'
    }
    return null
  } catch {
    return 'URL inválida. Cole o link completo do produto.'
  }
}

const handleSubmit = () => {
  if (!url.value || isCooldown.value) return
  
  const error = validateUrl(url.value)
  if (error) {
    validationError.value = error
    return
  }
  
  validationError.value = ''
  emit('submit', url.value)
  isCooldown.value = true
  setTimeout(() => {
    isCooldown.value = false
  }, 5000)
}
</script>

<template>
  <div class="url-input-container">
    <div class="section-label">LINK DO PRODUTO</div>
    <form @submit.prevent="handleSubmit" class="input-form">
      <input 
        v-model="url" 
        type="url" 
        placeholder="Cole qualquer link do produto aqui..." 
        required
        @input="validationError = ''"
      />
      <div v-if="validationError" class="validation-error">⚠️ {{ validationError }}</div>
      <button type="submit" class="btn-primary" :disabled="!url || isCooldown" :class="{ 'btn-disabled': isCooldown }">
        {{ isCooldown ? 'Aguarde 5s...' : 'Gerar Post 🚀' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.url-input-container {
  background: white;
  padding: 24px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}

.input-form input {
  width: 100%;
  background: var(--bg-color);
  padding: 14px 16px;
  border-radius: var(--radius-full);
  margin-bottom: 16px;
  font-size: 0.95rem;
  color: var(--text-main);
  transition: all 0.2s ease;
}

.input-form input:focus {
  background: white;
  box-shadow: 0 0 0 2px var(--primary-color);
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed !important;
}

.validation-error {
  color: #C53030;
  background: #FED7D7;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  margin-bottom: 12px;
}
</style>
