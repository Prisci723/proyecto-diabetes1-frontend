<template>
  <div class="glucose-analysis-container">
    <!-- Header -->
    <div class="analysis-header mb-4">
      <h2 class="text-primary">
        <i class="bi bi-heart-pulse-fill"></i>
        Análisis de Control Glucémico
      </h2>
    </div>

    <!-- Patient Selector -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <div class="row align-items-end">
          <div class="col-md-6">
            <label class="form-label fw-bold">Seleccionar Paciente</label>
            <input 
              v-model="patientId" 
              type="text" 
              class="form-control" 
              placeholder="Ingrese ID del paciente"
              @keyup.enter="loadPatientAnalysis"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold">Período de Análisis</label>
            <select v-model="analysisDays" class="form-select">
              <option :value="7">7 días</option>
              <option :value="14">14 días</option>
              <option :value="21">21 días</option>
              <option :value="30">30 días</option>
            </select>
          </div>
          <div class="col-md-3">
            <button 
              @click="loadPatientAnalysis" 
              class="btn btn-primary w-100"
              :disabled="loading || !patientId"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-search me-2"></i>
              Analizar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-muted">Cargando análisis del paciente...</p>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
      <button type="button" class="btn-close" @click="error = null"></button>
    </div>

    <!-- Analysis Results -->
    <div v-if="patientAnalysis && !loading">
      <!-- Cluster Information Card -->
      <div class="card mb-4 shadow-sm border-0">
        <div class="card-header text-white" :style="{ backgroundColor: getClusterColor(patientAnalysis.cluster_info.cluster_id) }">
          <h5 class="mb-0">
            <i class="bi bi-diagram-3-fill me-2"></i>
            Clasificación del Paciente
          </h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="cluster-badge mb-3" :style="{ backgroundColor: getClusterColor(patientAnalysis.cluster_info.cluster_id) }">
                <h3 class="text-white mb-0">{{ patientAnalysis.cluster_info.cluster_name }}</h3>
                <small class="text-white-50">Cluster {{ patientAnalysis.cluster_info.cluster_id }}</small>
              </div>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-shield-check text-primary me-2"></i>
                <span class="fw-bold">Confianza:</span>
                <span class="ms-2">{{ patientAnalysis.cluster_info.confidence_score.toFixed(3) }}</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi bi-calendar-check text-primary me-2"></i>
                <span class="fw-bold">Fecha de análisis:</span>
                <span class="ms-2">{{ formatDate(patientAnalysis.analysis_date) }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Métricas Promedio del Período</h6>
              <div class="metrics-grid" v-if="patientAnalysis.cluster_info.metrics">
                <div class="metric-item">
                  <span class="metric-label">TIR</span>
                  <span class="metric-value">{{ patientAnalysis.cluster_info.metrics.avg_tir?.toFixed(1) || 'N/A' }}%</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">CV</span>
                  <span class="metric-value">{{ patientAnalysis.cluster_info.metrics.avg_cv?.toFixed(1) || 'N/A' }}%</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">GMI</span>
                  <span class="metric-value">{{ patientAnalysis.cluster_info.metrics.avg_gmi?.toFixed(1) || 'N/A' }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Metrics & Risk Score -->
      <div class="row mb-4">
        <div class="col-lg-8">
          <div class="card shadow-sm h-100 border-0">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-activity me-2 text-primary"></i>
                Métricas Actuales
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="metric-card">
                    <div class="metric-icon bg-success-subtle">
                      <i class="bi bi-bullseye text-success"></i>
                    </div>
                    <div class="metric-content">
                      <span class="metric-name">Tiempo en Rango (TIR)</span>
                      <span class="metric-number text-success">{{ patientAnalysis.current_metrics.tir.toFixed(1) }}%</span>
                      <small class="text-muted">Objetivo: ≥70%</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="metric-card">
                    <div class="metric-icon bg-warning-subtle">
                      <i class="bi bi-graph-up text-warning"></i>
                    </div>
                    <div class="metric-content">
                      <span class="metric-name">Coeficiente Variación (CV)</span>
                      <span class="metric-number text-warning">{{ patientAnalysis.current_metrics.cv.toFixed(1) }}%</span>
                      <small class="text-muted">Objetivo: ≤36%</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="metric-card">
                    <div class="metric-icon bg-info-subtle">
                      <i class="bi bi-speedometer2 text-info"></i>
                    </div>
                    <div class="metric-content">
                      <span class="metric-name">Indicador GMI</span>
                      <span class="metric-number text-info">{{ patientAnalysis.current_metrics.gmi.toFixed(1) }}%</span>
                      <small class="text-muted">Glucosa Promedio</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="metric-card">
                    <div class="metric-icon bg-danger-subtle">
                      <i class="bi bi-arrow-down-circle text-danger"></i>
                    </div>
                    <div class="metric-content">
                      <span class="metric-name">Tiempo Bajo Rango (TBR)</span>
                      <span class="metric-number text-danger">{{ patientAnalysis.current_metrics.tbr.toFixed(1) }}%</span>
                      <small class="text-muted">Objetivo: <4%</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="metric-card">
                    <div class="metric-icon bg-warning-subtle">
                      <i class="bi bi-arrow-up-circle text-warning"></i>
                    </div>
                    <div class="metric-content">
                      <span class="metric-name">Tiempo Sobre Rango (TAR)</span>
                      <span class="metric-number text-warning">{{ patientAnalysis.current_metrics.tar.toFixed(1) }}%</span>
                      <small class="text-muted">Objetivo: <25%</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="metric-card">
                    <div class="metric-icon bg-primary-subtle">
                      <i class="bi bi-clipboard-data text-primary"></i>
                    </div>
                    <div class="metric-content">
                      <span class="metric-name">Lecturas del Día</span>
                      <span class="metric-number text-primary">{{ patientAnalysis.current_metrics.n_readings }}</span>
                      <small class="text-muted">{{ formatDate(patientAnalysis.current_metrics.date) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Score -->
        <div class="col-lg-4">
          <div class="card shadow-sm h-100 border-0">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-exclamation-triangle me-2 text-primary"></i>
                Nivel de Riesgo
              </h5>
            </div>
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
              <div class="risk-score-container mb-3">
                <svg viewBox="0 0 120 120" class="risk-gauge">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e9ecef" stroke-width="10"/>
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    fill="none" 
                    :stroke="getRiskColor(patientAnalysis.risk_score)" 
                    stroke-width="10"
                    :stroke-dasharray="`${patientAnalysis.risk_score * 3.14} 314`"
                    transform="rotate(-90 60 60)"
                  />
                  <text x="60" y="60" text-anchor="middle" dy="8" class="risk-score-text">
                    {{ patientAnalysis.risk_score.toFixed(0) }}
                  </text>
                </svg>
              </div>
              <h4 class="mb-2" :class="`text-${getRiskLevel(patientAnalysis.risk_score).color}`">
                {{ getRiskLevel(patientAnalysis.risk_score).label }}
              </h4>
              <p class="text-center text-muted mb-3">
                {{ getRiskLevel(patientAnalysis.risk_score).description }}
              </p>
              <div class="trend-badge" :class="`trend-${patientAnalysis.trend}`">
                <i class="bi" :class="getTrendIcon(patientAnalysis.trend)"></i>
                <span class="ms-2">Tendencia: {{ getTrendLabel(patientAnalysis.trend) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="card shadow-sm mb-4 border-0">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="bi bi-lightbulb-fill me-2"></i>
            Recomendaciones Personalizadas
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div 
              v-for="(recommendation, index) in patientAnalysis.recommendations" 
              :key="index"
              class="col-md-6"
            >
              <div class="recommendation-card h-100">
                <div class="recommendation-header">
                  <i class="bi bi-check-circle-fill text-primary me-2"></i>
                  <span class="fw-bold">{{ recommendation.title || `Recomendación ${index + 1}` }}</span>
                </div>
                <p class="recommendation-text">{{ recommendation.description || recommendation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historical Data -->
      <div class="card shadow-sm border-0">
        <div class="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="bi bi-graph-up me-2 text-primary"></i>
            Historial de Métricas
          </h5>
          <button 
            @click="toggleHistory" 
            class="btn btn-sm btn-outline-primary"
          >
            <i class="bi" :class="showHistory ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            {{ showHistory ? 'Ocultar' : 'Mostrar' }}
          </button>
        </div>
        <div v-if="showHistory" class="card-body">
          <div v-if="loadingHistory" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else-if="historyData" class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>TIR %</th>
                  <th>CV %</th>
                  <th>TBR %</th>
                  <th>TAR %</th>
                  <th>GMI %</th>
                  <th>Lecturas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in historyData.metrics" :key="metric.date">
                  <td>{{ formatDate(metric.date) }}</td>
                  <td>
                    <span class="badge" :class="getTIRBadgeClass(metric.tir)">
                      {{ metric.tir.toFixed(1) }}%
                    </span>
                  </td>
                  <td>{{ metric.cv.toFixed(1) }}%</td>
                  <td>{{ metric.tbr.toFixed(1) }}%</td>
                  <td>{{ metric.tar.toFixed(1) }}%</td>
                  <td>{{ metric.gmi.toFixed(1) }}%</td>
                  <td>{{ metric.n_readings }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Clusters Info Modal -->
    <div class="mt-4 text-center">
      <button 
        class="btn btn-outline-primary" 
        data-bs-toggle="modal" 
        data-bs-target="#clustersModal"
        @click="loadClustersInfo"
      >
        <i class="bi bi-info-circle me-2"></i>
        Información sobre Clusters
      </button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="clustersModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-diagram-3-fill me-2"></i>
              Clasificación de Clusters
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="clustersInfo">
              <p class="text-muted mb-4">
                Total de clusters identificados: <strong>{{ clustersInfo.total_clusters }}</strong>
              </p>
              <div 
                v-for="cluster in clustersInfo.clusters" 
                :key="cluster.id"
                class="cluster-info-card mb-3"
              >
                <div class="cluster-header" :style="{ backgroundColor: getClusterColor(cluster.id) }">
                  <h6 class="text-white mb-0">{{ cluster.name }}</h6>
                  <span class="badge bg-white text-dark">Cluster {{ cluster.id }}</span>
                </div>
                <div class="cluster-body">
                  <p class="mb-0">{{ cluster.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// State
const apiBaseUrl = ref('https://9b9v7hgp-8000.brs.devtunnels.ms');
const patientId = ref('');
const analysisDays = ref(7);
const loading = ref(false);
const loadingHistory = ref(false);
const error = ref(null);
const patientAnalysis = ref(null);
const historyData = ref(null);
const showHistory = ref(false);
const clustersInfo = ref(null);

// Methods
const loadPatientAnalysis = async () => {
  if (!patientId.value) {
    error.value = 'Por favor ingrese un ID de paciente';
    return;
  }

  loading.value = true;
  error.value = null;
  patientAnalysis.value = null;

  try {
    const response = await axios.get(
      `${apiBaseUrl.value}/analysis/${patientId.value}`,
      { params: { days: analysisDays.value } }
    );
    patientAnalysis.value = response.data;
    console.log(patientAnalysis.value);
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error al cargar el análisis del paciente';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const toggleHistory = async () => {
  showHistory.value = !showHistory.value;
  
  if (showHistory.value && !historyData.value) {
    await loadHistory();
  }
};

const loadHistory = async () => {
  loadingHistory.value = true;
  try {
    const response = await axios.get(
      `${apiBaseUrl.value}/analysis/${patientId.value}/history`,
      { params: { days: 30 } }
    );
    historyData.value = response.data;
  } catch (err) {
    console.error('Error loading history:', err);
  } finally {
    loadingHistory.value = false;
  }
};

const loadClustersInfo = async () => {
  if (clustersInfo.value) return;
  
  try {
    const response = await axios.get(`${apiBaseUrl.value}/analysis/clusters/info`);
    clustersInfo.value = response.data;
  } catch (err) {
    console.error('Error loading clusters info:', err);
  }
};

const getClusterColor = (clusterId) => {
  const colors = {
    0: '#28a745', // Verde - Excelente
    1: '#17a2b8', // Azul - Moderado
    2: '#ffc107', // Amarillo - Alta Variabilidad
    3: '#fd7e14', // Naranja - Riesgo Hipoglucemia
    4: '#dc3545'  // Rojo - Subóptimo
  };
  return colors[clusterId] || '#00A79D';
};

const getRiskColor = (riskScore) => {
  if (riskScore < 30) return '#28a745';
  if (riskScore < 50) return '#ffc107';
  if (riskScore < 70) return '#fd7e14';
  return '#dc3545';
};

const getRiskLevel = (riskScore) => {
  if (riskScore < 30) {
    return { 
      label: 'Riesgo Bajo', 
      color: 'success',
      description: 'El control glucémico está dentro de rangos aceptables'
    };
  }
  if (riskScore < 50) {
    return { 
      label: 'Riesgo Moderado', 
      color: 'warning',
      description: 'Se recomienda seguimiento y ajustes menores'
    };
  }
  if (riskScore < 70) {
    return { 
      label: 'Riesgo Alto', 
      color: 'orange',
      description: 'Requiere atención y ajustes en el tratamiento'
    };
  }
  return { 
    label: 'Riesgo Crítico', 
    color: 'danger',
    description: 'Requiere intervención inmediata'
  };
};

const getTrendIcon = (trend) => {
  const icons = {
    improving: 'bi-arrow-up-circle-fill',
    worsening: 'bi-arrow-down-circle-fill',
    stable: 'bi-dash-circle-fill'
  };
  return icons[trend] || 'bi-dash-circle';
};

const getTrendLabel = (trend) => {
  const labels = {
    improving: 'Mejorando',
    worsening: 'Empeorando',
    stable: 'Estable'
  };
  return labels[trend] || 'Desconocido';
};

const getTIRBadgeClass = (tir) => {
  if (tir >= 70) return 'bg-success';
  if (tir >= 50) return 'bg-warning';
  return 'bg-danger';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
</script>

<style scoped>
.glucose-analysis-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.text-primary, .btn-primary {
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

.bg-primary {
  background-color: #00A79D !important;
}

.analysis-header h2 {
  font-weight: 600;
  margin: 0;
}

.cluster-badge {
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.metric-item {
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.metric-label {
  display: block;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #00A79D;
}

.metric-card {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 167, 157, 0.15);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.metric-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.metric-name {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.metric-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 3px;
}

.risk-score-container {
  width: 150px;
  height: 150px;
}

.risk-gauge {
  width: 100%;
  height: 100%;
}

.risk-score-text {
  font-size: 2rem;
  font-weight: 700;
  fill: #212529;
}

.trend-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.trend-improving {
  background-color: #d4edda;
  color: #155724;
}

.trend-stable {
  background-color: #d1ecf1;
  color: #0c5460;
}

.trend-worsening {
  background-color: #f8d7da;
  color: #721c24;
}

.recommendation-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #00A79D;
}

.recommendation-header {
  font-size: 1rem;
  margin-bottom: 10px;
}

.recommendation-text {
  margin: 0;
  color: #495057;
  line-height: 1.6;
}

.cluster-info-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.cluster-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cluster-body {
  padding: 15px;
  background: white;
}

.text-orange {
  color: #fd7e14;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>