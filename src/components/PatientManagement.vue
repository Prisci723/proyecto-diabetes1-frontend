<template>
    <Header @toggle-menu="handleToggleMenu" />
  <div class="patient-management-container espacio-header">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-person-plus-fill me-2"></i>
          Registro de Nuevo Paciente
        </h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="createPatient">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">
                <i class="bi bi-hash me-2"></i>ID del Paciente
              </label>
              <input 
                v-model="newPatient.id" 
                type="text" 
                class="form-control" 
                required
                placeholder="Ej: PAT001"
                pattern="[A-Za-z0-9]+"
              >
              <small class="text-muted">Solo letras y números, sin espacios</small>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">
                <i class="bi bi-person me-2"></i>Nombre Completo
              </label>
              <input 
                v-model="newPatient.name" 
                type="text" 
                class="form-control" 
                required
                placeholder="Ej: Juan Pérez García"
              >
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">
                <i class="bi bi-calendar-event me-2"></i>Edad
              </label>
              <input 
                v-model.number="newPatient.age" 
                type="number" 
                class="form-control" 
                required
                min="1"
                max="120"
                placeholder="Ej: 45"
              >
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">
                <i class="bi bi-clipboard2-pulse me-2"></i>Tipo de Diabetes
              </label>
              <select v-model="newPatient.diabetes_type" class="form-select" required>
                <option value="">Seleccione...</option>
                <option value="Type 1">Tipo 1</option>
                <option value="Type 2">Tipo 2</option>
                <option value="Gestacional">Gestacional</option>
                <option value="LADA">LADA</option>
                <option value="MODY">MODY</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">
                <i class="bi bi-calendar-check me-2"></i>Fecha de Diagnóstico
              </label>
              <input 
                v-model="newPatient.diagnosis_date" 
                type="date" 
                class="form-control" 
                required
                :max="today"
              >
            </div>
          </div>

          <div class="alert alert-info mt-3" v-if="showPreview">
            <h6 class="fw-bold">
              <i class="bi bi-eye me-2"></i>Vista Previa
            </h6>
            <div class="row">
              <div class="col-md-6">
                <small class="d-block"><strong>ID:</strong> {{ newPatient.id }}</small>
                <small class="d-block"><strong>Nombre:</strong> {{ newPatient.name }}</small>
                <small class="d-block"><strong>Edad:</strong> {{ newPatient.age }} años</small>
              </div>
              <div class="col-md-6">
                <small class="d-block"><strong>Tipo:</strong> {{ newPatient.diabetes_type }}</small>
                <small class="d-block"><strong>Diagnóstico:</strong> {{ formatDate(newPatient.diagnosis_date) }}</small>
              </div>
            </div>
          </div>

          <div class="mt-4 d-flex gap-2">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-circle me-2"></i>
              Registrar Paciente
            </button>
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              @click="resetForm"
            >
              <i class="bi bi-arrow-counterclockwise me-2"></i>
              Limpiar
            </button>
            <button 
              type="button" 
              class="btn btn-outline-info"
              @click="showPreview = !showPreview"
            >
              <i class="bi" :class="showPreview ? 'bi-eye-slash' : 'bi-eye'"></i>
              {{ showPreview ? 'Ocultar' : 'Ver' }} Vista Previa
            </button>
          </div>
        </form>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          {{ successMessage }}
          <button type="button" class="btn-close" @click="successMessage = null"></button>
        </div>

        <div v-if="error" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="error = null"></button>
        </div>
      </div>
    </div>

    <!-- Quick Start Guide -->
    <div class="card shadow-sm border-0 mt-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">
          <i class="bi bi-lightbulb me-2 text-warning"></i>
          Guía de Inicio Rápido
        </h5>
      </div>
      <div class="card-body">
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-marker">1</div>
            <div class="timeline-content">
              <h6 class="fw-bold">Registrar Paciente</h6>
              <p class="text-muted mb-0">Complete el formulario con la información básica del paciente.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">2</div>
            <div class="timeline-content">
              <h6 class="fw-bold">Cargar Lecturas de Glucosa</h6>
              <p class="text-muted mb-0">Use el módulo de "Registro de Lecturas" para agregar datos históricos (mínimo 10 lecturas por día).</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">3</div>
            <div class="timeline-content">
              <h6 class="fw-bold">Contar Carbohidratos</h6>
              <p class="text-muted mb-0">puede contar los carbohidratos ingeridos</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">3</div>
            <div class="timeline-content">
              <h6 class="fw-bold">Consultar síntomas con el chatbot</h6>
              <p class="text-muted mb-0">Utilice el chatbot para consultar síntomas y recibir orientación personalizada.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker">3</div>
            <div class="timeline-content">
              <h6 class="fw-bold">Sugerencia de la dosis de insulina bolus</h6>
              <p class="text-muted mb-0">El sistema sugiere dosis de insulina basadas en análisis personalizados para un mejor control glucémico.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="row mt-4 g-3">
      <div class="col-md-4">
        <div class="info-card">
          <div class="info-icon bg-primary-subtle">
            <i class="bi bi-droplet-fill text-primary"></i>
          </div>
          <h6 class="fw-bold">Lecturas Mínimas</h6>
          <p class="text-muted mb-0">Se requieren al menos <strong>10 lecturas diarias</strong> para calcular métricas confiables.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="info-card">
          <div class="info-icon bg-success-subtle">
            <i class="bi bi-calendar-week text-success"></i>
          </div>
          <h6 class="fw-bold">Período de Análisis</h6>
          <p class="text-muted mb-0">El análisis requiere datos de al menos <strong>7 días consecutivos</strong>.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="info-card">
          <div class="info-icon bg-warning-subtle">
            <i class="bi bi-diagram-3 text-warning"></i>
          </div>
          <h6 class="fw-bold">Clustering AI</h6>
          <p class="text-muted mb-0">El sistema clasifica automáticamente a los pacientes en <strong>5 grupos de control</strong>.</p>
        </div>
      </div>
    </div>

    <!-- Diabetes Types Info -->
    <div class="card shadow-sm border-0 mt-4">
      <div class="card-header bg-light">
        <h6 class="mb-0">
          <i class="bi bi-info-circle me-2 text-info"></i>
          Tipos de Diabetes
        </h6>
      </div>
      <div class="card-body">
        <div class="accordion" id="diabetesTypesAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#type1">
                Diabetes Tipo 1
              </button>
            </h2>
            <div id="type1" class="accordion-collapse collapse" data-bs-parent="#diabetesTypesAccordion">
              <div class="accordion-body">
                Condición autoinmune donde el páncreas no produce insulina. Requiere administración de insulina de por vida.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#type2">
                Diabetes Tipo 2
              </button>
            </h2>
            <div id="type2" class="accordion-collapse collapse" data-bs-parent="#diabetesTypesAccordion">
              <div class="accordion-body">
                El cuerpo no usa la insulina adecuadamente (resistencia a la insulina). Puede manejarse con dieta, ejercicio y medicamentos orales.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gestacional">
                Diabetes Gestacional
              </button>
            </h2>
            <div id="gestacional" class="accordion-collapse collapse" data-bs-parent="#diabetesTypesAccordion">
              <div class="accordion-body">
                Se desarrolla durante el embarazo y generalmente desaparece después del parto, aunque aumenta el riesgo de diabetes tipo 2 futura.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#lada">
                LADA (Latent Autoimmune Diabetes in Adults)
              </button>
            </h2>
            <div id="lada" class="accordion-collapse collapse" data-bs-parent="#diabetesTypesAccordion">
              <div class="accordion-body">
                Forma de diabetes autoinmune que se desarrolla en adultos, progresa más lentamente que el tipo 1.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#mody">
                MODY (Maturity Onset Diabetes of the Young)
              </button>
            </h2>
            <div id="mody" class="accordion-collapse collapse" data-bs-parent="#diabetesTypesAccordion">
              <div class="accordion-body">
                Forma hereditaria rara de diabetes causada por una mutación genética, generalmente se diagnostica antes de los 25 años.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import Header from '@/common/Header.vue';
// State
const apiBaseUrl = ref('/api');
const loading = ref(false);
const error = ref(null);
const successMessage = ref(null);
const showPreview = ref(false);

const today = computed(() => new Date().toISOString().split('T')[0]);

const newPatient = reactive({
  id: '',
  name: '',
  age: null,
  diabetes_type: '',
  diagnosis_date: ''
});

// Methods
const createPatient = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const response = await axios.post(`${apiBaseUrl.value}/patients/`, {
      ...newPatient,
      diagnosis_date: new Date(newPatient.diagnosis_date).toISOString()
    });
    
    successMessage.value = `Paciente ${newPatient.name} registrado exitosamente con ID: ${newPatient.id}`;
    resetForm();
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al registrar el paciente';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  newPatient.id = '';
  newPatient.name = '';
  newPatient.age = null;
  newPatient.diabetes_type = '';
  newPatient.diagnosis_date = '';
  showPreview.value = false;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.patient-management-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.bg-primary {
  background-color: #00A79D !important;
}

.text-primary {
  color: #00A79D !important;
}

.btn-primary {
  background-color: #00A79D !important;
  border-color: #00A79D !important;
}

.btn-primary:hover {
  background-color: #008c84 !important;
  border-color: #008c84 !important;
}

.btn-outline-primary {
  color: #00A79D !important;
  border-color: #00A79D !important;
}

.btn-outline-primary:hover {
  background-color: #00A79D !important;
  border-color: #00A79D !important;
  color: white !important;
}

.timeline {
  position: relative;
  padding-left: 50px;
}

.timeline-item {
  position: relative;
  padding-bottom: 30px;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: -35px;
  top: 35px;
  width: 2px;
  height: calc(100% - 10px);
  background: #dee2e6;
}

.timeline-marker {
  position: absolute;
  left: -50px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #00A79D;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.timeline-content h6 {
  margin-bottom: 5px;
}

.info-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 167, 157, 0.15);
}

.info-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 15px;
}

.bg-primary-subtle {
  background-color: rgba(0, 167, 157, 0.1) !important;
}

.accordion-button:not(.collapsed) {
  background-color: rgba(0, 167, 157, 0.1);
  color: #00A79D;
}

.accordion-button:focus {
  border-color: #00A79D;
  box-shadow: 0 0 0 0.25rem rgba(0, 167, 157, 0.25);
}
</style>