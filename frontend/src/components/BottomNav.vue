<script setup lang="ts">
defineProps<{
  activeTab: string
}>()

const emit = defineEmits<{
  navigate: [id: string]
}>()

const items = [
  { id: 'home', icon: '🚀', label: 'Gerar' },
  { id: 'history', icon: '🕒', label: 'Histórico' },
  { id: 'earnings', icon: '💸', label: 'Ganhos' },
  { id: 'profile', icon: '👤', label: 'Perfil' },
]
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="item in items"
      :key="item.id"
      class="nav-item"
      :class="{ active: activeTab === item.id }"
      @click="emit('navigate', item.id)"
    >
      <div class="nav-icon-wrapper">
        <span class="nav-icon">{{ item.icon }}</span>
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 480px;
  margin: 0 auto;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 12px 16px;
  box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.05);
  border-top-left-radius: var(--radius-xl);
  border-top-right-radius: var(--radius-xl);
  z-index: 50;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #A0AEC0;
}

.nav-item.active {
  color: var(--primary-color);
}

.nav-item.active .nav-icon-wrapper {
  background: var(--primary-color);
  color: white;
}

.nav-item.active .nav-icon {
  filter: brightness(0) invert(1);
}

.nav-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-icon {
  font-size: 1.25rem;
}

.nav-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
