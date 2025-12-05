<template>
  <header class="app-header">
    <div class="container-fluid">
      <div class="d-flex align-items-center justify-content-between">
        <!-- Botón menú + Botón back -->
        <div class="d-flex align-items-center gap-2">
          <button 
            class="btn-menu-mobile"
            @click="toggleMenu"
            aria-label="Toggle menu"
          >
            <i class="bi bi-list"></i>
          </button>
          
          <button 
            class="btn-back" 
            @click="goBack"
            aria-label="Go back"
          >
            <i class="bi bi-arrow-left-circle"></i>
          </button>
        </div>

        <!-- Perfil -->
        <div class="user-profile"
          @click="router.push('/register-data')"
        >
          <i class="bi bi-person-circle me-2"></i>
          mi perfil
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['toggle-menu'])

const goBack = () => {
  router.back()
}

const toggleMenu = () => {
  emit('toggle-menu')
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(90deg, #00A79D 0%, #087971 100%);
  color: white;
  display: flex;
  align-items: center;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-back, .btn-menu-mobile {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-back:hover, .btn-menu-mobile:hover {
  transform: scale(1.1);
}

.btn-back:active, .btn-menu-mobile:active {
  transform: scale(0.95);
}

.user-profile {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.user-profile i {
  font-size: 1.3rem;
}

@media (max-width: 768px) {
  .user-profile {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }

  .user-profile i {
    font-size: 1.1rem;
  }
}
</style>