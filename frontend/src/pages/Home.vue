<script setup lang="ts">
import { ref } from 'vue'
import { useProductFlow } from '../composables/useProductFlow'
import storage from '../services/storage'
import type { HistoryItem } from '../types'
import URLInput from '../components/URLInput.vue'
import ProductCard from '../components/ProductCard.vue'
import ShareButtons from '../components/ShareButtons.vue'
import BottomNav from '../components/BottomNav.vue'

const activeTab = ref('home')
const historyItems = ref<HistoryItem[]>([])
const historyLoading = ref(false)
const backupMessage = ref('')
const appVersion = __APP_VERSION__

const doBackup = async () => {
  try {
    const data = await storage.exportBackup()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'linkvenda-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    backupMessage.value = '✅ Backup exportado com sucesso!'
    setTimeout(() => backupMessage.value = '', 3000)
  } catch(e) {
    backupMessage.value = '❌ Erro ao exportar: ' + String(e)
  }
}

const doRestore = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      await storage.importBackup(text)
      backupMessage.value = '✅ Restaurado com sucesso! Atualize o app.'
      historyItems.value = [] // Força limpar cache do history p requerer novamente
      setTimeout(() => backupMessage.value = '', 3000)
    } catch(err) {
      backupMessage.value = '❌ Falha ao restaurar: Arquivo inválido.'
    }
  }
  input.click()
}

const {
  isLoading,
  isCooldown,
  error,
  currentProduct,
  generatedText,
  generationCount,
  handleExtract,
  handleGenerate,
  clearError,
} = useProductFlow()

const onNavigate = async (tabId: string) => {
  activeTab.value = tabId
  if (tabId === 'history' && historyItems.value.length === 0) {
    historyLoading.value = true
    try {
      historyItems.value = await storage.getHistory()
    } catch (e) {
      console.error('Erro ao carregar histórico:', e)
    } finally {
      historyLoading.value = false
    }
  }
}
</script>

<template>
  <div class="home-layout">
    <header class="header">
      <div class="header-top">
        <h1 class="logo">✦ LinkVenda</h1>
        <div class="user-avatar">👤</div>
      </div>

      <div v-if="activeTab === 'home'" class="hero-section">
        <span class="header-pill">FERRAMENTA PROFISSIONAL PARA AFILIADOS</span>
        <h2 class="hero-title">Crie posts de afiliados em segundos</h2>
        <p class="hero-subtitle">Cole qualquer link de produto e tenha um post pronto para compartilhar instantaneamente.</p>
      </div>

      <div v-else class="hero-section">
        <h2 class="hero-title" style="font-size: 1.5rem;">
          {{ activeTab === 'history' ? '🕒 Histórico' : activeTab === 'earnings' ? '💸 Ganhos' : '👤 Perfil' }}
        </h2>
      </div>
    </header>

    <!-- TAB: Gerar -->
    <main v-if="activeTab === 'home'" class="content-area">
      <URLInput @submit="handleExtract" />

      <div v-if="error" class="error-msg">
        {{ error }} <button @click="clearError" class="close-error">✕</button>
      </div>

      <div v-if="isLoading && !currentProduct" class="loading-skeleton">
        <div class="spinner"></div> Carregando produto...
      </div>

      <template v-if="currentProduct">
        <div class="section-label">
          <span>Seu Resultado</span>
          <span class="text-success">✅ Pronto para compartilhar</span>
        </div>

        <ProductCard :product="currentProduct" />

        <button
          @click="handleGenerate"
          :disabled="isLoading || isCooldown"
          class="btn-primary"
          :class="{ 'btn-disabled': isCooldown }"
          style="width: 100%; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; gap: 8px;"
        >
          <span style="font-size: 1.25rem;">🎲</span>
          {{ isCooldown ? 'Aguarde 3s...' : (generationCount === 0 ? 'Gerar Texto' : 'Gerar Novo Texto') }}
        </button>

        <div v-if="isLoading && currentProduct" class="text-muted text-sm mb-4" style="text-align: center;">
          Gerando novo texto...
        </div>
        <ShareButtons v-else-if="generatedText" :text="generatedText" :url="currentProduct.url" :image="currentProduct.image" />
      </template>

      <div style="height: 100px;"></div>
    </main>

    <!-- TAB: Histórico -->
    <main v-else-if="activeTab === 'history'" class="content-area">
      <div v-if="historyLoading" class="loading-skeleton">
        <div class="spinner"></div> Carregando histórico...
      </div>

      <div v-else-if="historyItems.length === 0" class="empty-state">
        <p>📭 Nenhum post ainda.</p>
        <p class="text-muted text-sm">Gere seu primeiro post para vê-lo aqui.</p>
      </div>

      <div v-else class="history-list">
        <div v-for="item in historyItems" :key="item.id" class="history-card">
          <div class="history-card-header">
            <img
              :src="item.image || 'https://via.placeholder.com/48'"
              :alt="item.title"
              class="history-thumb"
              loading="lazy"
            />
            <div class="history-info">
              <p class="history-title">{{ item.title }}</p>
              <p class="text-muted text-xs">{{ item.price }} · {{ new Date(item.created_at).toLocaleDateString('pt-BR') }}</p>
            </div>
          </div>
          <p class="history-content">{{ item.content.slice(0, 120) }}...</p>
        </div>
      </div>

      <div style="height: 100px;"></div>
    </main>

    <!-- TAB: Ganhos -->
    <main v-else-if="activeTab === 'earnings'" class="content-area">
      <div class="coming-soon-card">
        <div class="coming-soon-icon">💸</div>
        <h3 class="coming-soon-title">Painel de Ganhos</h3>
        <p class="coming-soon-desc">
          Acompanhe suas comissões, cliques e conversões em tempo real — tudo em um só lugar.
        </p>
        <div class="coming-soon-features">
          <div class="feature-pill">📊 Relatórios</div>
          <div class="feature-pill">📈 Gráficos</div>
          <div class="feature-pill">💰 Comissões</div>
          <div class="feature-pill">🔗 Cliques</div>
        </div>
        <div class="coming-soon-badge">🚧 Em construção</div>
        <p class="text-muted text-xs" style="margin-top: 8px;">Estamos finalizando esta funcionalidade. Fique ligado!</p>
      </div>
      <div style="height: 100px;"></div>
    </main>

    <!-- TAB: Perfil -->
    <main v-else-if="activeTab === 'profile'" class="content-area">
      <div class="coming-soon-card">
        <div class="coming-soon-icon">👤</div>
        <h3 class="coming-soon-title">Seu Perfil & Dados</h3>
        <p class="coming-soon-desc">
          O LinkVenda agora salva seus dados no próprio dispositivo (IndexedDB). Assim você tem mais privacidade e eles não são perdidos.
        </p>
        
        <div style="margin-top: 24px; text-align: left; background: #F7FAFC; padding: 16px; border-radius: 8px;">
          <h4 style="margin-bottom: 12px; font-weight: bold; color: #2D3748;">💾 Backup e Restauração</h4>
          <p style="font-size: 0.85rem; color: #4A5568; margin-bottom: 16px;">
            Migrando de celular ou navegador? Baixe seu histórico atual e restaure em outro lugar. 
          </p>
          <div style="display: flex; gap: 8px;">
             <button class="btn-primary" style="flex: 1; padding: 8px; font-size: 0.9rem; align-items: center; justify-content: center;" @click="doBackup">📤 Exportar Backup</button>
             <button class="btn-primary" style="flex: 1; padding: 8px; font-size: 0.9rem; background: #4A5568; align-items: center; justify-content: center;" @click="doRestore">📥 Restaurar</button>
          </div>
          <div v-if="backupMessage" style="margin-top: 12px; font-size: 0.85rem; color: var(--primary-color);">
            {{ backupMessage }}
          </div>
        </div>
        
        <div style="margin-top: 32px; font-size: 0.75rem; color: var(--text-muted); opacity: 0.6;">
          v{{ appVersion }}
        </div>
      </div>
      <div style="height: 100px;"></div>
    </main>

    <BottomNav :active-tab="activeTab" @navigate="onNavigate" />
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
}

.header {
  padding: 24px;
  background: white;
  border-bottom: 1px solid #E2E8F0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary-color);
}

.user-avatar {
  background: #E2E8F0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-section {
  text-align: center;
}

.hero-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-main);
  margin: 16px 0;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.content-area {
  padding: 24px;
}

.loading-skeleton {
  width: 100%;
  height: 200px;
  background: white;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
  box-shadow: var(--shadow-sm);
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border-left-color: var(--primary-color);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.text-success {
  color: #38A169;
  font-weight: 600;
  font-size: 0.75rem;
}

.error-msg {
  background: #FED7D7;
  color: #C53030;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-error {
  font-weight: bold;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed !important;
}

/* History */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-muted);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.history-card-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.history-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-content {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
  white-space: pre-line;
}

/* Coming Soon Cards */
.coming-soon-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 40px 24px;
  text-align: center;
  box-shadow: var(--shadow-md);
  border: 1px solid #E2E8F0;
}

.coming-soon-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.coming-soon-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 8px;
}

.coming-soon-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 300px;
  margin: 0 auto 20px;
}

.coming-soon-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.feature-pill {
  background: #F0F4F8;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--radius-full);
}

.coming-soon-badge {
  display: inline-block;
  background: var(--primary-gradient);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}
</style>
