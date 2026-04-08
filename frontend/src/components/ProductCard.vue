<script setup lang="ts">
defineProps<{
  product: {
    title: string;
    price: string;
    image: string;
  } | null;
}>()
</script>

<template>
  <div v-if="product" class="product-card">
    <div class="image-wrapper">
      <img :src="product.image || 'https://via.placeholder.com/300x400?text=Sem+Imagem'" :alt="product.title" loading="lazy" decoding="async" />
      <div class="discount-badge">-15% OFF</div>
      <div class="gradient-overlay"></div>
      
      <div class="card-content">
        <h3 class="product-title">{{ product.title }}</h3>
        <div class="price-container">
          <span class="price-current">{{ product.price }}</span>
          <span class="price-old">R$ --,--</span>
        </div>
        <button class="btn-secondary sm-btn">Link na bio para comprar!</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  width: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
  background: #2D3748;
  aspect-ratio: 9 / 16;
  max-height: 500px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
}

.discount-badge {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  background: #E53E3E;
  color: white;
  font-weight: 800;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  z-index: 10;
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.price-current {
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
}

.price-old {
  color: #A0AEC0;
  text-decoration: line-through;
  font-size: 0.875rem;
}

.sm-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  font-size: 0.875rem;
}
</style>
