<template>
  <div class="sidebar-container">
    <!-- Sidebar overlay para móvil -->
    <div 
      v-if="isOpen" 
      class="sidebar-overlay"
      @click="close"
    ></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
      <!-- Botón de cerrar (solo móvil) -->
      <button 
        class="btn-close-sidebar d-lg-none"
        @click="close"
      >
        <i class="bi bi-x-lg"></i>
      </button>

      <!-- Menu items -->
      <nav class="sidebar-nav">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="sidebar-item"
          :class="{ 'active': isActive(item.path) }"
          @click="close"
        >
          <i :class="item.icon" class="me-2"></i>
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Logout button -->
      <div class="sidebar-footer">
        <button class="sidebar-item logout-btn" @click="handleLogout">
          <i class="bi bi-box-arrow-right me-2"></i>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isOpen = ref(false)

const menuItems = [
  { path: '/paginaInicio', label: 'Página Principal', icon: 'bi bi-house-door-fill' },
  { path: '/glucose-prediction', label: 'Glucosa Actual', icon: 'bi bi-droplet-fill' },
  { path: '/paginaInicio', label: 'Reconocimiento de Alimentos', icon: 'bi bi-camera-fill' },
  { path: '/glucose-pattern', label: 'Patrones Glucémicos', icon: 'bi bi-graph-up' },
  { path: '/insuline-bolus', label: 'Optimización Dósis de Insulina', icon: 'bi bi-calculator-fill' },
  { path: '/chatbot', label: 'CHATBOT', icon: 'bi bi-chat-dots-fill' }
]

const isActive = (path) => {
  return route.path === path
}

const close = () => {
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  console.log('Cerrando sesión...')
  close()
  router.push('/')
}

// Exponer funciones para que el componente padre pueda usarlas
defineExpose({
  toggle,
  close
})
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 60px; /* Altura del header */
  bottom: 0;
  width: 280px;
  background: linear-gradient(180deg, #17a2b8 0%, #138496 100%);
  color: white;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5rem;
}

/* Scrollbar personalizado */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.sidebar-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-left: 4px solid white;
}

.sidebar-item i {
  font-size: 1.1rem;
  min-width: 24px;
}

.sidebar-footer {
  padding: 1rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: auto;
}

.logout-btn {
  color: #ffe5e5;
}

.logout-btn:hover {
  background-color: rgba(255, 0, 0, 0.2);
}

.btn-close-sidebar {
  display: none;
}

.sidebar-overlay {
  display: none;
}

/* Desktop - Sidebar siempre visible */
@media (min-width: 992px) {
  .sidebar {
    transform: translateX(0);
  }
}

/* Mobile - Sidebar se oculta por defecto */
@media (max-width: 991.98px) {
  .sidebar {
    transform: translateX(-100%);
    top: 0;
    padding-top: 4rem;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .btn-close-sidebar {
    display: block;
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1001;
    transition: transform 0.2s ease;
  }

  .btn-close-sidebar:hover {
    transform: scale(1.1);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>