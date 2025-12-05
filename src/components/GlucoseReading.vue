<template>
  <div class="glucose-readings-container">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">
          <i class="bi bi-plus-circle-fill me-2"></i>
          Registrar Lecturas de Glucosa
        </h5>
      </div>
      <div class="card-body">
        <ul class="nav nav-tabs mb-4" role="tablist">
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'single' }"
              @click="activeTab = 'single'"
            >
              <i class="bi bi-file-earmark-plus me-2"></i>
              Lectura Individual
            </button>
          </li>
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'bulk' }"
              @click="activeTab = 'bulk'"
            >
              <i class="bi bi-file-earmark-spreadsheet me-2"></i>
              Carga Masiva
            </button>
          </li>
        </ul>

        <!-- Single Reading Form -->
        <div v-if="activeTab === 'single'" class="tab-content">
          <form @submit.prevent="submitSingleReading">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">
                  <i class="bi bi-person me-2"></i>ID del Paciente
                </label>
                <input 
                  v-model="singleReading.patient_id" 
                  type="text" 
                  class="form-control" 
                  required
                  placeholder="Ej: PAT001"
                >
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">
                  <i class="bi bi-droplet me-2"></i>Valor de Glucosa (mg/dL)
                </label>
                <input 
                  v-model.number="singleReading.value" 
                  type="number" 
                  class="form-control" 
                  required
                  min="20"
                  max="600"
                  placeholder="Ej: 120"
                >
              </div>
              <div class="col-md-12">
                <label class="form-label fw-bold">
                  <i class="bi bi-calendar-event me-2"></i>Fecha y Hora
                </label>
                <input 
                  v-model="singleReading.timestamp" 
                  type="datetime-local" 
                  class="form-control" 
                  required
                >
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
                Registrar Lectura
              </button>
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                @click="resetSingleForm"
              >
                <i class="bi bi-arrow-counterclockwise me-2"></i>
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <!-- Bulk Upload Form -->
        <div v-if="activeTab === 'bulk'" class="tab-content">
          <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Puedes cargar múltiples lecturas a la vez. Agrega las lecturas manualmente o importa desde un archivo JSON.
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-12">
              <label class="form-label fw-bold">
                <i class="bi bi-person me-2"></i>ID del Paciente
              </label>
              <input 
                v-model="bulkData.patient_id" 
                type="text" 
                class="form-control" 
                required
                placeholder="Ej: PAT001"
              >
            </div>
          </div>

          <!-- Manual Entry -->
          <div class="card bg-light mb-3">
            <div class="card-body">
              <h6 class="fw-bold mb-3">Agregar Lectura Manual</h6>
              <div class="row g-2">
                <div class="col-md-5">
                  <input 
                    v-model="newBulkReading.timestamp" 
                    type="datetime-local" 
                    class="form-control form-control-sm"
                    placeholder="Fecha y hora"
                  >
                </div>
                <div class="col-md-4">
                  <input 
                    v-model.number="newBulkReading.value" 
                    type="number" 
                    class="form-control form-control-sm"
                    placeholder="Valor (mg/dL)"
                    min="20"
                    max="600"
                  >
                </div>
                <div class="col-md-3">
                  <button 
                    @click="addBulkReading" 
                    class="btn btn-sm btn-primary w-100"
                    :disabled="!newBulkReading.timestamp || !newBulkReading.value"
                  >
                    <i class="bi bi-plus-lg"></i>
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Readings List -->
          <div v-if="bulkData.readings.length > 0" class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold mb-0">
                Lecturas a Cargar ({{ bulkData.readings.length }})
              </h6>
              <button 
                @click="bulkData.readings = []" 
                class="btn btn-sm btn-outline-danger"
              >
                <i class="bi bi-trash"></i>
                Limpiar Todo
              </button>
            </div>
            <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
              <table class="table table-sm table-hover">
                <thead class="table-light sticky-top">
                  <tr>
                    <th>#</th>
                    <th>Fecha y Hora</th>
                    <th>Valor (mg/dL)</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(reading, index) in bulkData.readings" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ formatDateTime(reading.timestamp) }}</td>
                    <td>
                      <span class="badge" :class="getGlucoseBadgeClass(reading.value)">
                        {{ reading.value }}
                      </span>
                    </td>
                    <td>
                      <button 
                        @click="removeBulkReading(index)" 
                        class="btn btn-sm btn-outline-danger"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Import from JSON -->
          <div class="card bg-light mb-3">
            <div class="card-body">
              <h6 class="fw-bold mb-3">Importar desde JSON</h6>
              <textarea 
                v-model="jsonInput" 
                class="form-control font-monospace" 
                rows="5"
                placeholder='[{"timestamp": "2025-01-15T08:00:00", "value": 120}, ...]'
              ></textarea>
              <button 
                @click="importFromJSON" 
                class="btn btn-sm btn-outline-primary mt-2"
              >
                <i class="bi bi-upload me-2"></i>
                Importar JSON
              </button>
            </div>
          </div>

          <button 
            @click="submitBulkReadings" 
            class="btn btn-primary"
            :disabled="loading || bulkData.readings.length === 0 || !bulkData.patient_id"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-cloud-upload me-2"></i>
            Cargar {{ bulkData.readings.length }} Lectura(s)
          </button>
        </div>

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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

// State
const apiBaseUrl = ref('https://9b9v7hgp-8000.brs.devtunnels.ms');
const activeTab = ref('single');
const loading = ref(false);
const error = ref(null);
const successMessage = ref(null);
const jsonInput = ref('');

const singleReading = reactive({
  patient_id: '',
  value: null,
  timestamp: getCurrentDateTime()
});

const bulkData = reactive({
  patient_id: '',
  readings: []
});

const newBulkReading = reactive({
  timestamp: '',
  value: null
});

// Methods
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const submitSingleReading = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    await axios.post(`${apiBaseUrl.value}/glucose/reading/`, singleReading);
    successMessage.value = 'Lectura registrada exitosamente';
    resetSingleForm();
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al registrar la lectura';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const submitBulkReadings = async () => {
  if (!bulkData.patient_id || bulkData.readings.length === 0) {
    error.value = 'Debe proporcionar un ID de paciente y al menos una lectura';
    return;
  }

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    await axios.post(`${apiBaseUrl.value}/glucose/bulk/`, bulkData);
    successMessage.value = `${bulkData.readings.length} lectura(s) registrada(s) exitosamente`;
    bulkData.readings = [];
    jsonInput.value = '';
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al cargar las lecturas';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const addBulkReading = () => {
  if (newBulkReading.timestamp && newBulkReading.value) {
    bulkData.readings.push({
      timestamp: newBulkReading.timestamp,
      value: newBulkReading.value
    });
    newBulkReading.timestamp = '';
    newBulkReading.value = null;
  }
};

const removeBulkReading = (index) => {
  bulkData.readings.splice(index, 1);
};

const importFromJSON = () => {
  try {
    const parsed = JSON.parse(jsonInput.value);
    if (Array.isArray(parsed)) {
      bulkData.readings = [
        ...bulkData.readings,
        ...parsed.map(r => ({
          timestamp: r.timestamp,
          value: r.value
        }))
      ];
      jsonInput.value = '';
      successMessage.value = `${parsed.length} lectura(s) importada(s) desde JSON`;
    } else {
      error.value = 'El JSON debe ser un array de lecturas';
    }
  } catch (err) {
    error.value = 'Error al parsear JSON: ' + err.message;
  }
};

const resetSingleForm = () => {
  singleReading.patient_id = '';
  singleReading.value = null;
  singleReading.timestamp = getCurrentDateTime();
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getGlucoseBadgeClass = (value) => {
  if (value < 70) return 'bg-danger';
  if (value > 180) return 'bg-warning';
  return 'bg-success';
};
</script>

<style scoped>
.glucose-readings-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.bg-primary {
  background-color: #00A79D !important;
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

.nav-link {
  color: #6c757d;
  cursor: pointer;
}

.nav-link.active {
  color: #00A79D !important;
  border-bottom-color: #00A79D !important;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>