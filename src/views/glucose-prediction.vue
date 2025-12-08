<template>
  <Header @toggle-menu="handleToggleMenu" />
  <div class="prediccion-glucosa espacio-header">
    <!-- Header -->
    
    <div class="container-fluid bg-white shadow-sm mb-4">
      <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="display-5 fw-bold text-primary mb-2">
              <i class="bi bi-graph-up-arrow"></i> Predicción de Glucosa
            </h1>
            <p class="lead text-muted mb-0">Sistema inteligente para diabetes tipo 1</p>
          </div>
          <div class="status-indicator">
            <span 
              class="status-dot me-2" 
              :class="{ 'connected': apiConnected }"
            ></span>
            <span class="status-text fw-semibold">
              {{ apiStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row g-4">
        <!-- Panel izquierdo: Entrada de datos -->
        <div class="col-lg-5">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-clipboard-data"></i> Datos Históricos
              </h5>
            </div>
            <div class="card-body">
              <p class="text-muted mb-3">
                Ingresa las últimas 12 lecturas de glucosa (60 minutos)
              </p>
              
              <!-- Lecturas históricas -->
              <div class="readings-container mb-3">
                <div 
                  v-for="(reading, index) in historicalReadings" 
                  :key="index"
                  class="reading-item card mb-2"
                >
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="fw-semibold">
                        <i class="bi bi-clock"></i> {{ reading.timeStr }}
                      </span>
                      <span class="badge bg-secondary">
                        Hace {{ reading.minutesAgo }} min
                      </span>
                    </div>
                    
                    <div class="row g-2">
                      <div class="col-6 col-md-3">
                        <label class="form-label small mb-1">Glucosa (mg/dL) *</label>
                        <input 
                          v-model.number="reading.glucose"
                          type="number" 
                          class="form-control form-control-sm"
                          placeholder="150"
                          min="20"
                          max="600"
                          required
                        >
                      </div>
                      <div class="col-6 col-md-3">
                        <label class="form-label small mb-1">Carbs (g)</label>
                        <input 
                          v-model.number="reading.carbs"
                          type="number" 
                          class="form-control form-control-sm"
                          placeholder="0"
                          min="0"
                        >
                      </div>
                      <div class="col-6 col-md-3">
                        <label class="form-label small mb-1">Insulina (U)</label>
                        <input 
                          v-model.number="reading.bolus"
                          type="number" 
                          class="form-control form-control-sm"
                          placeholder="0"
                          min="0"
                          step="0.1"
                        >
                      </div>
                      <div class="col-6 col-md-3">
                        <label class="form-label small mb-1">Ejercicio (min)</label>
                        <input 
                          v-model.number="reading.exercise"
                          type="number" 
                          class="form-control form-control-sm"
                          placeholder="0"
                          min="0"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                @click="loadSampleData" 
                class="btn btn-outline-primary w-100"
              >
                <i class="bi bi-download"></i> Cargar Datos de Ejemplo
              </button>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-bullseye"></i> Predicción Futura
              </h5>
            </div>
            <div class="card-body">
              <!-- Horizonte de predicción -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Horizonte de predicción:</label>
                <select 
                  v-model.number="nSteps" 
                  class="form-select"
                  @change="updateUserInputs"
                >
                  <option :value="6">30 minutos (6 pasos)</option>
                  <option :value="12">1 hora (12 pasos)</option>
                  <option :value="18">1.5 horas (18 pasos)</option>
                  <option :value="24">2 horas (24 pasos)</option>
                </select>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-semibold mb-0">
                  <i class="bi bi-calendar-event"></i> Eventos Planificados
                </h6>
                <button 
                  @click="reloadStoredData" 
                  class="btn btn-sm btn-outline-primary"
                  title="Cargar desde registro de alimentos y bolus"
                >
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
              </div>
              <p class="text-muted small mb-3">
                Ingresa comidas, insulina o ejercicio que planeas realizar
              </p>
              
              <!-- Indicador de datos cargados -->
              <div v-if="foodRegistrationData || bolusResultData" class="alert alert-info alert-sm mb-3 py-2">
                <small>
                  <i class="bi bi-info-circle-fill me-1"></i>
                  <span v-if="foodRegistrationData">Carbohidratos: <strong>{{ foodRegistrationData.alimentosSeleccionados?.reduce((s, a) => s + a.hidratos_carbono, 0) || 0 }}g</strong></span>
                  <span v-if="foodRegistrationData && bolusResultData"> | </span>
                  <span v-if="bolusResultData">Insulina: <strong>{{ bolusResultData.dose }}U</strong></span>
                </small>
              </div>

              <!-- Inputs del usuario -->
              <div class="user-inputs-container mb-3">
                <div 
                  v-for="(input, index) in userInputs" 
                  :key="index"
                  class="user-input-item card mb-2"
                >
                  <div class="card-body p-3">
                    <div class="mb-2">
                      <strong><i class="bi bi-clock-history"></i> +{{ (index + 1) * 5 }} minutos</strong>
                    </div>
                    
                    <div class="row g-2">
                      <div class="col-6">
                        <label class="form-label small mb-1">Carbohidratos (g)</label>
                        <input 
                          v-model.number="input.carbs"
                          type="number" 
                          class="form-control form-control-sm"
                          placeholder="0"
                          min="0"
                        >
                      </div>
                      <div class="col-6">
                        <label class="form-label small mb-1">Insulina (U)</label>
                        <input 
                          v-model.number="input.bolus"
                          type="number" 
                          class="form-control form-control-sm"
                          placeholder="0"
                          min="0"
                          step="0.1"
                        >
                      </div>
                      <div class="col-6">
                        <label class="form-label small mb-1">Intensidad ejercicio (0-10)</label>
                        <input 
                          v-model.number="input.exerciseIntensity"
                          type="number" 
                          class="form-control form-control-sm"
                          placeholder="0"
                          min="0"
                          max="10"
                        >
                      </div>
                      <div class="col-6">
                        <label class="form-label small mb-1">Duración ejercicio (min)</label>
                        <input 
                          v-model.number="input.exerciseDuration"
                          type="number" 
                          class="form-control form-control-sm"
                          placeholder="0"
                          min="0"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                @click="makePrediction" 
                class="btn btn-primary btn-lg w-100"
                :disabled="isLoading"
              >
                <span v-if="isLoading">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Calculando...
                </span>
                <span v-else>
                  <i class="bi bi-magic"></i> Predecir Glucosa
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Panel derecho: Resultados -->
        <div class="col-lg-7">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-graph-up"></i> Resultados de Predicción
              </h5>
            </div>
            <div class="card-body">
              <!-- Estado de carga -->
              <div v-if="isLoading" class="text-center py-5">
                <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
                <p class="text-muted">Calculando predicciones...</p>
              </div>

              <!-- Estado vacío -->
              <div v-else-if="!hasResults" class="text-center py-5">
                <i class="bi bi-graph-up display-1 text-muted mb-3"></i>
                <h5>Sin predicciones aún</h5>
                <p class="text-muted">
                  Completa los datos históricos y haz clic en "Predecir Glucosa" para ver los resultados
                </p>
              </div>

              <!-- Resultados -->
              <div v-else>
                <!-- Tarjetas de resumen -->
                <div class="row g-3 mb-4">
                  <div class="col-6 col-md-3">
                    <div class="summary-card text-center p-3 bg-light rounded">
                      <div class="small text-muted mb-1">Glucosa Actual</div>
                      <div class="h3 fw-bold text-primary mb-0">{{ results.summary.current_glucose }}</div>
                      <div class="small text-muted">mg/dL</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="summary-card text-center p-3 bg-light rounded">
                      <div class="small text-muted mb-1">Predicción Final</div>
                      <div class="h3 fw-bold text-primary mb-0">{{ results.summary.final_glucose }}</div>
                      <div class="small text-muted">mg/dL</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="summary-card text-center p-3 bg-light rounded">
                      <div class="small text-muted mb-1">Cambio</div>
                      <div 
                        class="h3 fw-bold mb-0"
                        :class="changeColorClass"
                      >
                        {{ changeDisplay }}
                      </div>
                      <div class="small text-muted">mg/dL</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="summary-card text-center p-3 bg-light rounded">
                      <div class="small text-muted mb-1">Tendencia</div>
                      <div 
                        class="h5 fw-bold mb-0"
                        :class="trendColorClass"
                      >
                        {{ trendDisplay }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Alertas -->
                <div class="mb-4">
                  <div v-if="results.alerts.length === 0" class="alert alert-success">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    <strong>Todo bien</strong> - No se detectaron alertas críticas en el horizonte de predicción.
                  </div>
                  <div 
                    v-for="(alert, index) in results.alerts" 
                    :key="index"
                    class="alert mb-2"
                    :class="alertClass(alert.severity)"
                  >
                    <div class="d-flex align-items-start">
                      <i 
                        class="me-2 fs-5"
                        :class="alertIcon(alert.type)"
                      ></i>
                      <div class="flex-grow-1">
                        <div class="fw-bold">{{ alert.type }} - {{ alert.time }}</div>
                        <div>{{ alert.message }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Gráfico -->
                <div class="chart-container mb-4" style="height: 400px;">
                  <canvas ref="chartCanvas" id="glucoseChart"></canvas>
                </div>

                <!-- Tabla de predicciones -->
                <div class="mb-4">
                  <h6 class="fw-semibold mb-3">
                    <i class="bi bi-table"></i> Detalles de Predicción
                  </h6>
                  <div class="table-responsive">
                    <table class="table table-sm table-hover">
                      <thead class="table-light">
                        <tr>
                          <th>Tiempo</th>
                          <th>Glucosa</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="(pred, index) in results.predictions" 
                          :key="index"
                        >
                          <td>
                            {{ formatTime(results.timestamps[index]) }}
                            <span class="text-muted small">(+{{ (index + 1) * 5 }} min)</span>
                          </td>
                          <td>
                            <strong>{{ pred.toFixed(1) }}</strong> mg/dL
                          </td>
                          <td>
                            <span 
                              class="badge"
                              :class="statusBadgeClass(pred)"
                            >
                              {{ getGlucoseStatusText(pred) }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Estadísticas adicionales -->
                <div class="row g-3">
                  <div class="col-6 col-md-3">
                    <div class="stat-card p-3 border rounded text-center">
                      <div class="small text-muted mb-1">Mínimo</div>
                      <div class="h5 fw-bold mb-0">{{ results.summary.min_glucose }}</div>
                      <div class="small text-muted">mg/dL</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="stat-card p-3 border rounded text-center">
                      <div class="small text-muted mb-1">Máximo</div>
                      <div class="h5 fw-bold mb-0">{{ results.summary.max_glucose }}</div>
                      <div class="small text-muted">mg/dL</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="stat-card p-3 border rounded text-center">
                      <div class="small text-muted mb-1">Promedio</div>
                      <div class="h5 fw-bold mb-0">{{ results.summary.avg_glucose }}</div>
                      <div class="small text-muted">mg/dL</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="stat-card p-3 border rounded text-center">
                      <div class="small text-muted mb-1">Tiempo en Rango</div>
                      <div class="h5 fw-bold mb-0">{{ results.summary.time_in_range.toFixed(1) }}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificaciones -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div 
        v-for="(notification, index) in notifications" 
        :key="index"
        class="toast show"
        :class="`bg-${notification.type}`"
        role="alert"
      >
        <div class="toast-body text-white">
          <i :class="notificationIcon(notification.type)"></i>
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import Header from '@/common/Header.vue'

// Configuración
const API_BASE_URL = '/api/glucose-prediction'

// Estado
const apiConnected = ref(false)
const apiStatus = ref('Conectando...')
const isLoading = ref(false)
const hasResults = ref(false)
const historicalReadings = ref([])
const userInputs = ref([])
const nSteps = ref(12)
const results = ref(null)
const notifications = ref([])
const chartCanvas = ref(null)
let glucoseChart = null

// Datos cargados desde localStorage
const foodRegistrationData = ref(null)
const bolusResultData = ref(null)

// Computed
const changeDisplay = computed(() => {
  if (!results.value) return '--'
  const change = results.value.summary.change
  return change > 0 ? `+${change}` : change
})

const changeColorClass = computed(() => {
  if (!results.value) return ''
  return results.value.summary.change > 0 ? 'text-warning' : 'text-success'
})

const trendDisplay = computed(() => {
  if (!results.value) return '--'
  return results.value.summary.trend === 'ascendente' ? '↗️ Subiendo' : '↘️ Bajando'
})

const trendColorClass = computed(() => {
  if (!results.value) return ''
  return results.value.summary.trend === 'ascendente' ? 'text-warning' : 'text-success'
})

// Métodos
const checkAPIConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/glucose-health`)
    const data = await response.json()
    
    if (data.status === 'healthy' && data.model_loaded) {
      apiConnected.value = true
      apiStatus.value = 'Conectado'
      console.log('✓ Conexión con API establecida')
    } else {
      throw new Error('Modelo no cargado')
    }
  } catch (error) {
    apiStatus.value = 'Desconectado'
    console.error('Error de conexión:', error)
    showNotification('Error de conexión con el servidor', 'danger')
  }
}

const generateHistoricalReadings = () => {
  const now = new Date()
  historicalReadings.value = []
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now - (i * 5 * 60 * 1000))
    historicalReadings.value.push({
      timestamp: time.toISOString(),
      timeStr: time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      minutesAgo: i * 5,
      glucose: null,
      carbs: 0,
      bolus: 0,
      exercise: 0
    })
  }
}

const updateUserInputs = () => {
  userInputs.value = []
  for (let i = 0; i < nSteps.value; i++) {
    userInputs.value.push({
      carbs: 0,
      bolus: 0,
      exerciseIntensity: 0,
      exerciseDuration: 0
    })
  }
}

// Cargar datos desde localStorage
const loadDataFromStorage = () => {
  try {
    // Cargar datos de registro de alimentos
    const foodData = localStorage.getItem('diabetes-food-registration')
    if (foodData) {
      foodRegistrationData.value = JSON.parse(foodData)
      console.log('✅ Datos de alimentos cargados:', foodRegistrationData.value)
    }
    
    // Cargar resultado de bolus
    const bolusData = localStorage.getItem('diabetes-bolus-result')
    if (bolusData) {
      bolusResultData.value = JSON.parse(bolusData)
      console.log('✅ Datos de bolus cargados:', bolusResultData.value)
    }
    
    // Aplicar datos automáticamente si están disponibles
    applyStoredDataToInputs()
  } catch (error) {
    console.error('❌ Error al cargar datos desde localStorage:', error)
  }
}

// Aplicar datos guardados a los inputs del usuario
const applyStoredDataToInputs = () => {
  if (!userInputs.value.length) return
  
  let hasData = false
  
  // Aplicar carbohidratos del registro de alimentos al primer paso
  if (foodRegistrationData.value && foodRegistrationData.value.alimentosSeleccionados) {
    const totalCarbs = foodRegistrationData.value.alimentosSeleccionados.reduce(
      (sum, alimento) => sum + alimento.hidratos_carbono,
      0
    )
    if (totalCarbs > 0) {
      userInputs.value[0].carbs = Math.round(totalCarbs)
      hasData = true
      console.log(`📊 Carbohidratos aplicados: ${totalCarbs}g`)
    }
  }
  
  // Aplicar insulina del resultado de bolus al primer paso
  if (bolusResultData.value && bolusResultData.value.dose) {
    userInputs.value[0].bolus = bolusResultData.value.dose
    hasData = true
    console.log(`💉 Insulina aplicada: ${bolusResultData.value.dose}U`)
  }
  
  if (hasData) {
    showNotification('Datos cargados desde registro previo', 'success')
  }
}

// Recargar datos manualmente
const reloadStoredData = () => {
  loadDataFromStorage()
  
  if (foodRegistrationData.value || bolusResultData.value) {
    const messages = []
    if (foodRegistrationData.value) {
      const totalCarbs = foodRegistrationData.value.alimentosSeleccionados?.reduce(
        (sum, alimento) => sum + alimento.hidratos_carbono,
        0
      ) || 0
      messages.push(`Carbohidratos: ${totalCarbs}g`)
    }
    if (bolusResultData.value) {
      messages.push(`Insulina: ${bolusResultData.value.dose}U`)
    }
    alert(`✅ Datos recargados:\n${messages.join('\n')}`)
  } else {
    alert('⚠️ No hay datos guardados en el registro de alimentos o cálculo de bolus.')
  }
}

const loadSampleData = () => {
  const sampleGlucose = [150, 145, 142, 138, 135, 140, 145, 150, 155, 160, 165, 170]
  
  historicalReadings.value.forEach((reading, index) => {
    reading.glucose = sampleGlucose[index]
  })
  
  // Simular una comida hace 30 minutos
  historicalReadings.value[6].carbs = 45
  historicalReadings.value[6].bolus = 5.0
  
  showNotification('Datos de ejemplo cargados correctamente', 'success')
}

const collectHistoricalData = () => {
  const data = []
  
  for (let i = 0; i < historicalReadings.value.length; i++) {
    const reading = historicalReadings.value[i]
    
    if (!reading.glucose || reading.glucose < 20 || reading.glucose > 600) {
      throw new Error(`Glucosa inválida en lectura ${i + 1}. Debe estar entre 20-600 mg/dL.`)
    }
    
    data.push({
      timestamp: reading.timestamp,
      glucose: reading.glucose,
      carbs: reading.carbs || 0,
      bolus: reading.bolus || 0,
      exercise_intensity: reading.exercise > 0 ? 5 : 0,
      exercise_duration: reading.exercise || 0
    })
  }
  
  return data
}

const collectUserInputs = () => {
  return userInputs.value.map(input => ({
    carbs: input.carbs || 0,
    bolus: input.bolus || 0,
    exercise_intensity: input.exerciseIntensity || 0,
    exercise_duration: input.exerciseDuration || 0
  }))
}

const makePrediction = async () => {
  try {
    isLoading.value = true
    
    const historicalData = collectHistoricalData()
    const userInputsData = collectUserInputs()
    
    console.log('Enviando datos:', { historicalData, userInputsData, nSteps: nSteps.value })
    
    const response = await fetch(`${API_BASE_URL}/predict-glucose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        historical_data: historicalData,
        user_inputs: userInputsData,
        n_steps: nSteps.value
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Error en la predicción')
    }
    
    const result = await response.json()
    console.log('Resultado:', result)
    
    results.value = result
    hasResults.value = true
    
    // Esperar a que el DOM se actualice completamente
    await nextTick()
    // Pequeña espera adicional para asegurar que el canvas esté disponible
    setTimeout(() => {
      displayChart()
    }, 50)
    
    showNotification('Predicción completada exitosamente', 'success')
    
  } catch (error) {
    console.error('Error:', error)
    showNotification(error.message, 'danger')
  } finally {
    isLoading.value = false
  }
}

const displayChart = () => {
  if (!chartCanvas.value) {
    console.error('Canvas no encontrado')
    // Intentar buscar por ID como fallback
    const canvas = document.getElementById('glucoseChart')
    if (!canvas) {
      console.error('Canvas tampoco encontrado por ID')
      return
    }
    chartCanvas.value = canvas
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  if (glucoseChart) {
    glucoseChart.destroy()
  }
  
  const labels = results.value.timestamps.map(ts => {
    const date = new Date(ts)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  })
  
  // Crear datasets con líneas de referencia
  const datasets = [
    {
      label: 'Predicción de Glucosa',
      data: results.value.predictions,
      borderColor: '#00A79D',
      backgroundColor: 'rgba(0, 167, 157, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#00A79D',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }
  ]
  
  glucoseChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#64748b',
            font: {
              size: 12,
              weight: 'bold'
            },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return `Glucosa: ${context.parsed.y.toFixed(1)} mg/dL`
            },
            afterLabel: function(context) {
              const value = context.parsed.y
              if (value < 70) return '⚠️ Hipoglucemia'
              if (value < 80) return '⚡ Bajo'
              if (value > 180 && value <= 250) return '⬆️ Alto'
              if (value > 250) return '🔴 Hiperglucemia'
              return '✅ Normal'
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: Math.min(...results.value.predictions) - 20,
          max: Math.max(...results.value.predictions) + 20,
          grid: {
            color: '#e2e8f0',
            drawBorder: false
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 11
            },
            padding: 10,
            callback: function(value) {
              return value + ' mg/dL'
            }
          },
          title: {
            display: true,
            text: 'Nivel de Glucosa (mg/dL)',
            color: '#475569',
            font: {
              size: 13,
              weight: 'bold'
            },
            padding: 10
          }
        },
        x: {
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 10
            },
            maxRotation: 45,
            minRotation: 45,
            padding: 5
          },
          title: {
            display: true,
            text: 'Tiempo',
            color: '#475569',
            font: {
              size: 13,
              weight: 'bold'
            },
            padding: 10
          }
        }
      }
    },
    plugins: [{
      id: 'customLines',
      beforeDraw: function(chart) {
        const ctx = chart.ctx
        const yAxis = chart.scales.y
        const xAxis = chart.scales.x
        
        // Línea de hipoglucemia (70 mg/dL)
        const y70 = yAxis.getPixelForValue(70)
        ctx.save()
        ctx.beginPath()
        ctx.setLineDash([5, 5])
        ctx.moveTo(xAxis.left, y70)
        ctx.lineTo(xAxis.right, y70)
        ctx.lineWidth = 2
        ctx.strokeStyle = '#ef4444'
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
        
        // Línea de hiperglucemia (180 mg/dL)
        const y180 = yAxis.getPixelForValue(180)
        ctx.save()
        ctx.beginPath()
        ctx.setLineDash([5, 5])
        ctx.moveTo(xAxis.left, y180)
        ctx.lineTo(xAxis.right, y180)
        ctx.lineWidth = 2
        ctx.strokeStyle = '#f59e0b'
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
        
        // Zona de rango objetivo (80-180 mg/dL)
        const y80 = yAxis.getPixelForValue(80)
        ctx.save()
        ctx.fillStyle = 'rgba(16, 185, 129, 0.05)'
        ctx.fillRect(xAxis.left, y180, xAxis.right - xAxis.left, y80 - y180)
        ctx.restore()
      }
    }]
  })
  
  console.log('Gráfico creado exitosamente')
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const getGlucoseStatusText = (glucose) => {
  if (glucose < 70) return 'Hipoglucemia'
  if (glucose < 80) return 'Bajo'
  if (glucose > 180 && glucose <= 250) return 'Alto'
  if (glucose > 250) return 'Hiperglucemia'
  return 'Normal'
}

const statusBadgeClass = (glucose) => {
  if (glucose < 70 || glucose > 250) return 'bg-danger'
  if (glucose < 80) return 'bg-warning'
  if (glucose > 180) return 'bg-warning'
  return 'bg-success'
}

const alertClass = (severity) => {
  return severity === 'CRÍTICO' ? 'alert-danger' : 'alert-warning'
}

const alertIcon = (type) => {
  return type === 'HIPOGLUCEMIA' ? 'bi bi-exclamation-triangle-fill' : 'bi bi-arrow-up-circle-fill'
}

const showNotification = (message, type = 'info') => {
  const notification = { message, type }
  notifications.value.push(notification)
  
  setTimeout(() => {
    const index = notifications.value.indexOf(notification)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }, 3000)
}

const notificationIcon = (type) => {
  const icons = {
    success: 'bi bi-check-circle-fill',
    danger: 'bi bi-x-circle-fill',
    warning: 'bi bi-exclamation-circle-fill',
    info: 'bi bi-info-circle-fill'
  }
  return icons[type] || icons.info
}

// Lifecycle
onMounted(() => {
  checkAPIConnection()
  generateHistoricalReadings()
  updateUserInputs()
  loadDataFromStorage() // Cargar datos desde localStorage
})

// Watchers
watch(nSteps, () => {
  updateUserInputs()
})
</script>

<style scoped>
/* Color principal */
.text-primary {
  color: #00A79D !important;
}

.bg-primary {
  background-color: #00A79D !important;
}

.btn-primary {
  background-color: #00A79D;
  border-color: #00A79D;
}

.btn-primary:hover {
  background-color: #008f86;
  border-color: #008f86;
}

.btn-outline-primary {
  color: #00A79D;
  border-color: #00A79D;
}

.btn-outline-primary:hover {
  background-color: #00A79D;
  border-color: #00A79D;
  color: white;
}

/* Status indicator */
.status-indicator {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ef4444;
  animation: pulse 2s infinite;
}

.status-dot.connected {
  background-color: #10b981;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Reading items */
.reading-item {
  transition: all 0.2s ease;
}

.reading-item:hover {
  box-shadow: 0 2px 8px rgba(0, 167, 157, 0.2);
}

.readings-container {
  max-height: 500px;
  overflow-y: auto;
}

.user-inputs-container {
  max-height: 400px;
  overflow-y: auto;
}

/* Summary cards */
.summary-card {
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

/* Chart container */
.chart-container {
  position: relative;
}

/* Scrollbar personalizado */
.readings-container::-webkit-scrollbar,
.user-inputs-container::-webkit-scrollbar {
  width: 8px;
}

.readings-container::-webkit-scrollbar-track,
.user-inputs-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.readings-container::-webkit-scrollbar-thumb,
.user-inputs-container::-webkit-scrollbar-thumb {
  background: #00A79D;
  border-radius: 4px;
}

.readings-container::-webkit-scrollbar-thumb:hover,
.user-inputs-container::-webkit-scrollbar-thumb:hover {
  background: #008f86;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reading-item,
.user-input-item {
  animation: fadeIn 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .display-5 {
    font-size: 1.5rem;
  }
}

</style>
