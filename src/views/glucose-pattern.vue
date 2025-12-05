<template>
  <Header @toggle-menu="handleToggleMenu" />
  <div class="glucose-app espacio-header">
    <!-- Main Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <i class="bi bi-heart-pulse-fill fs-3 me-2"></i>
          <span class="fw-bold">Sistema de Monitoreo Glucémico</span>
        </a>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeModule === 'patients' }"
                href="#"
                @click.prevent="activeModule = 'patients'"
              >
                <i class="bi bi-person-plus me-1"></i>
                Pacientes
              </a>
            </li> -->
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeModule === 'readings' }"
                href="#"
                @click.prevent="activeModule = 'readings'"
              >
                <i class="bi bi-droplet me-1"></i>
                Lecturas
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeModule === 'analysis' }"
                href="#"
                @click.prevent="activeModule = 'analysis'"
              >
                <i class="bi bi-graph-up me-1"></i>
                Análisis
              </a>
            </li>
            <!-- <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeModule === 'about' }"
                href="#"
                @click.prevent="activeModule = 'about'"
              >
                <i class="bi bi-info-circle me-1"></i>
                Acerca de
              </a>
            </li> -->
          </ul>
        </div>
      </div>
    </nav>

    <!-- Content Area -->
    <div class="content-wrapper">
      <div class="container-fluid py-4">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="bi bi-house-door me-1"></i>
              Inicio
            </li>
            <li class="breadcrumb-item active">{{ getModuleName(activeModule) }}</li>
          </ol>
        </nav>

        <!-- Dynamic Component -->
        <transition name="fade" mode="out-in">
          <component :is="currentComponent" :key="activeModule"></component>
        </transition>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer bg-light border-top py-3 mt-5">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-6">
            <small class="text-muted">
              <i class="bi bi-shield-check me-1"></i>
              Sistema de Monitoreo Glucémico con IA © 2025
            </small>
          </div>
          <div class="col-md-6 text-md-end">
            <small class="text-muted">
              <i class="bi bi-cpu me-1"></i>
              Powered by FastAPI + Vue.js + Machine Learning
            </small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PatientManagement from '@/components/PatientManagement.vue';
import GlucoseReadings from '@/components/GlucoseReading.vue';
import GlucoseAnalysis from '@/components/GlucoseAnalysis.vue';
import Header from '@/common/Header.vue'
// State
const activeModule = ref('patients');

// Computed
const currentComponent = computed(() => {
  const components = {
    readings: GlucoseReadings,
    analysis: GlucoseAnalysis,
    about: null
  };
  return components[activeModule.value] || GlucoseReadings;
});

// Methods
const getModuleName = (module) => {
  const names = {
    readings: 'Registro de Lecturas',
    analysis: 'Análisis y Recomendaciones'
  };
  return names[module] || 'Inicio';
};
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #00A79D;
  --primary-hover: #008c84;
  --primary-light: rgba(0, 167, 157, 0.1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f8f9fa;
}

.glucose-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
}

/* Primary Color Override */
.bg-primary {
  background-color: var(--primary-color) !important;
}

.text-primary {
  color: var(--primary-color) !important;
}

.btn-primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
}

.btn-outline-primary {
  color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.btn-outline-primary:hover {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

/* Navigation */
.navbar-brand {
  font-size: 1.25rem;
}

.nav-link {
  transition: all 0.3s ease;
  border-radius: 5px;
  margin: 0 5px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

/* Breadcrumb */
.breadcrumb {
  background-color: transparent;
  padding: 0;
  margin-bottom: 20px;
}

.breadcrumb-item.active {
  color: var(--primary-color);
  font-weight: 600;
}

/* Cards */
.card {
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  border-bottom: none;
  padding: 1rem 1.5rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Footer */
.footer {
  margin-top: auto;
}

/* Utilities */
.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-brand span {
    font-size: 1rem;
  }
  
  .nav-link {
    margin: 5px 0;
  }
}

/* Loading States */
.spinner-border {
  vertical-align: middle;
}

/* Alerts */
.alert {
  border-radius: 8px;
  border: none;
}

/* Tables */
.table {
  background-color: white;
}

.table-hover tbody tr:hover {
  background-color: var(--primary-light);
}

/* Forms */
.form-control:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem var(--primary-light);
}

/* Badges */
.badge {
  padding: 0.35em 0.65em;
  font-weight: 600;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-hover);
}
</style>