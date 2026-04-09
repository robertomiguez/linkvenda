<script setup lang="ts">
const props = defineProps<{
  text: string;
  url: string;
  image?: string;
}>()

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    alert('Texto copiado com sucesso!')
  } catch (err) {
    console.error('Falha ao copiar:', err)
  }
}

const handleImageAction = async () => {
  if (!props.image) return;
  try {
    const response = await fetch(props.image);
    const blob = await response.blob();
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
    alert('✅ Imagem copiada! Você pode colar diretamente no WhatsApp.');
  } catch (err) {
    console.warn('Falha ao copiar imagem (possível erro de CORS), abrindo em nova guia.', err);
    window.open(props.image, '_blank');
  }
}

const shareWhatsApp = async () => {
  // Use Web Share API for native experience (better for link previews)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Oferta',
        text: props.text,
        url: props.url,
      });
      return;
    } catch (e) {
      console.warn('Native share failed, falling back to web link.', e);
    }
  }

  // Fallback for Web / Desktop
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(props.text)}`
  window.open(url, '_blank')
}

const shareX = () => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.text)}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="share-container">
    <div class="generated-box">
      <textarea readonly :value="text" rows="5"></textarea>
      <div class="box-actions">
        <button class="btn-box" @click="copyToClipboard">📄 Copiar Texto</button>
        <button class="btn-box" @click="handleImageAction" v-if="image">🖼️ Imagem</button>
      </div>
    </div>
    
    <div class="section-label mt-4">COMPARTILHAMENTO INSTANTÂNEO</div>
    <div class="share-buttons-row">
      <button class="btn-whatsapp" @click="shareWhatsApp">
        📱 WhatsApp
      </button>
      <button class="btn-x" @click="shareX">
        𝕏 X / Twitter
      </button>
    </div>
  </div>
</template>

<style scoped>
.share-container {
  margin-bottom: 32px;
}

.generated-box {
  background: #E2E8F0;
  border-left: 4px solid var(--primary-color);
  border-radius: var(--radius-md);
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

textarea {
  background: transparent;
  width: 100%;
  resize: none;
  font-size: 0.9rem;
  color: var(--text-main);
  line-height: 1.5;
}

.box-actions {
  display: flex;
  gap: 8px;
}

.btn-box {
  background: white;
  border: 1px solid #CBD5E0;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 4px;
}

.share-buttons-row {
  display: flex;
  gap: 12px;
}

.btn-whatsapp {
  flex: 1;
  background: var(--color-whatsapp);
  color: white;
  font-weight: 700;
  padding: 12px;
  border-radius: var(--radius-full);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.btn-x {
  flex: 1;
  background: var(--color-x);
  color: white;
  font-weight: 700;
  padding: 12px;
  border-radius: var(--radius-full);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
</style>
