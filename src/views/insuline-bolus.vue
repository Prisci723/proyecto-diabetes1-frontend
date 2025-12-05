<template>
  <div>
    <Header @toggle-mobile-menu="toggleSidebar" />
    <div class="bolus-calculator">
      <div class="container-fluid py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8 col-xl-6">
            <!-- Card Principal -->
            <div class="card shadow-sm">
              <div class="card-body p-4">
                <h2 class="text-center mb-4">
                  <i class="bi bi-calculator-fill me-2"></i>
                  Calculadora de Dosis de Bolus
                </h2>
                
                <!-- Estado de la API -->
                <div v-if="!apiStatus.healthy" class="alert alert-warning" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Advertencia:</strong> No se puede conectar con el servidor de predicción.
                  Verifica que la API esté corriendo en {{ apiBaseUrl }}
                </div>

                <form @submit.prevent="calculateBolus">
                  <!-- Glucosa Actual -->
                  <div class="mb-4">
                    <label for="glucose" class="form-label">
                      <i class="bi bi-droplet-fill me-2"></i>
                      Glucosa Actual
                    </label>
                    <div class="input-group input-group-lg">
                      <input
                        id="glucose"
                        v-model.number="formData.glucose"
                        type="number"
                        class="form-control"
                        placeholder="Nivel actual"
                        min="2"
                        max="30"
                        step="0.1"
                        required
                      >
                      <span class="input-group-text">mmol/L</span>
                    </div>
                    <div class="form-text">Nivel de glucosa en sangre actual (2.0 - 30.0 mmol/L)</div>
                  </div>

                  <!-- Gramos de Carbohidratos -->
                  <div class="mb-4">
                    <label for="carbs" class="form-label">
                      <i class="bi bi-egg-fried me-2"></i>
                      Gramos de Carbohidratos
                    </label>
                    <div class="input-group input-group-lg">
                      <input
                        id="carbs"
                        v-model.number="formData.carbs"
                        type="number"
                        class="form-control"
                        placeholder="Ingrese gramos"
                        min="0"
                        max="300"
                        step="0.1"
                        required
                      >
                      <span class="input-group-text">g</span>
                      <button 
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="reloadCarbsFromStorage"
                        title="Cargar desde registro de alimentos"
                      >
                        <i class="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>
                    <div class="form-text">
                      Cantidad total de carbohidratos en la comida (0 - 300g)
                      <span v-if="foodRegistrationData && foodRegistrationData.alimentosSeleccionados?.length > 0" class="text-success">
                        <i class="bi bi-check-circle-fill ms-2"></i>
                        Cargados desde registro de alimentos
                      </span>
                    </div>
                  </div>

                  <!-- Insulina Basal Activa -->
                  <div class="mb-4">
                    <label class="form-label">
                      <i class="bi bi-activity me-2"></i>
                      ¿Tiene insulina basal activa hoy?
                    </label>
                    <div class="d-flex gap-3">
                      <div class="form-check form-check-lg">
                        <input
                          id="basalYes"
                          v-model="formData.hasBasal"
                          class="form-check-input"
                          type="radio"
                          :value="true"
                        >
                        <label class="form-check-label" for="basalYes">
                          Sí
                        </label>
                      </div>
                      <div class="form-check form-check-lg">
                        <input
                          id="basalNo"
                          v-model="formData.hasBasal"
                          class="form-check-input"
                          type="radio"
                          :value="false"
                        >
                        <label class="form-check-label" for="basalNo">
                          No
                        </label>
                      </div>
                    </div>
                    <div class="form-text">Indica si tiene insulina de acción prolongada activa</div>
                  </div>

                  <!-- Tipo de Comida -->
                  <div class="mb-4">
                    <label for="mealType" class="form-label">
                      <i class="bi bi-clock-fill me-2"></i>
                      Tipo de Comida
                    </label>
                    <select
                      id="mealType"
                      v-model="formData.mealType"
                      class="form-select form-select-lg"
                      required
                    >
                      <option value="meal_Breakfast">🌅 Desayuno</option>
                      <option value="meal_Lunch">🌞 Almuerzo</option>
                      <option value="meal_Dinner">🌙 Cena</option>
                      <option value="meal_Snack">🍎 Colación</option>
                      <option value="meal_Pre-meal">🕐 Pre-comida</option>
                      <option value="meal_Post-meal">🕑 Post-comida</option>
                    </select>
                    <div class="form-text">Momento del día en que se administrará el bolus</div>
                  </div>

                  <!-- Opciones Avanzadas (Colapsable) -->
                  <div class="mb-4">
                    <button
                      class="btn btn-link text-decoration-none p-0"
                      type="button"
                      @click="showAdvanced = !showAdvanced"
                    >
                      <i :class="showAdvanced ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                      Opciones Avanzadas
                    </button>
                    
                    <div v-show="showAdvanced" class="mt-3">
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label for="hourOfDay" class="form-label">Hora del Día</label>
                          <input
                            id="hourOfDay"
                            v-model.number="formData.hourOfDay"
                            type="number"
                            class="form-control"
                            min="0"
                            max="23"
                            step="1"
                          >
                          <div class="form-text">0-23 (actual: {{ currentHour }})</div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label for="dayOfWeek" class="form-label">Día de la Semana</label>
                          <select
                            id="dayOfWeek"
                            v-model.number="formData.dayOfWeek"
                            class="form-select"
                          >
                            <option :value="0">Lunes</option>
                            <option :value="1">Martes</option>
                            <option :value="2">Miércoles</option>
                            <option :value="3">Jueves</option>
                            <option :value="4">Viernes</option>
                            <option :value="5">Sábado</option>
                            <option :value="6">Domingo</option>
                          </select>
                        </div>
                        <div class="col-12">
                          <label for="minutesBefore" class="form-label">Minutos antes del bolus</label>
                          <input
                            id="minutesBefore"
                            v-model.number="formData.glucoseMinutesBefore"
                            type="number"
                            class="form-control"
                            min="0"
                            max="120"
                            step="1"
                          >
                          <div class="form-text">Tiempo entre medición de glucosa y administración</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Botón de Calcular -->
                  <div class="d-grid gap-2 mb-4">
                    <button 
                      type="submit" 
                      class="btn btn-calculate btn-lg"
                      :disabled="loading || !apiStatus.healthy"
                    >
                      <span v-if="loading">
                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                        Calculando...
                      </span>
                      <span v-else>
                        <i class="bi bi-calculator-fill me-2"></i>
                        Calcular Dosis de Bolus
                      </span>
                    </button>
                  </div>
                </form>

                <!-- Resultado -->
                <div v-if="result.show" class="result-container">
                  <div class="result-header">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    Dosis Recomendada
                  </div>
                  <div class="result-body">
                    <div class="bolus-dose">
                      {{ result.predictedDose }} <span class="units">unidades</span>
                    </div>
                    
                    <!-- Badge de Confianza -->
                    <div class="text-center mb-3">
                      <span 
                        class="badge"
                        :class="{
                          'bg-success': result.confidence === 'high',
                          'bg-warning text-dark': result.confidence === 'medium',
                          'bg-danger': result.confidence === 'low'
                        }"
                      >
                        Confianza: {{ getConfidenceText(result.confidence) }}
                      </span>
                    </div>

                    <div class="result-details">
                      <div class="detail-item">
                        <span class="detail-label">
                          <i class="bi bi-droplet-fill me-1"></i>
                          Glucosa:
                        </span>
                        <span class="detail-value">{{ result.inputSummary.glucose }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">
                          <i class="bi bi-egg-fried me-1"></i>
                          Carbohidratos:
                        </span>
                        <span class="detail-value">{{ result.inputSummary.carbs }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">
                          <i class="bi bi-activity me-1"></i>
                          Basal activa:
                        </span>
                        <span class="detail-value">{{ result.inputSummary.basal }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">
                          <i class="bi bi-clock-fill me-1"></i>
                          Tipo de comida:
                        </span>
                        <span class="detail-value">{{ result.inputSummary.meal_type }}</span>
                      </div>
                    </div>

                    <!-- Advertencias -->
                    <div v-if="result.warnings && result.warnings.length > 0" class="warnings-section mt-3">
                      <div class="alert alert-warning mb-0" role="alert">
                        <div v-for="(warning, index) in result.warnings" :key="index" class="mb-1">
                          <i class="bi bi-exclamation-triangle-fill me-2"></i>
                          {{ warning }}
                        </div>
                      </div>
                    </div>

                    <div class="result-note mt-3">
                      <i class="bi bi-robot me-2"></i>
                      Predicción generada por red neuronal basada en datos históricos
                    </div>
                  </div>
                </div>

                <!-- Información adicional -->
                <div v-if="result.show" class="alert alert-info mt-4" role="alert">
                  <i class="bi bi-shield-fill-exclamation me-2"></i>
                  <strong>Importante:</strong> Esta dosis está calculada con base en un modelo de IA entrenado. 
                  Siempre consulte con su médico antes de administrar insulina.
                </div>
              </div>
            </div>

            <!-- Historial Reciente -->
            <div v-if="recentHistory.length > 0" class="card shadow-sm mt-4">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="mb-0">
                    <i class="bi bi-clock-history me-2"></i>
                    Cálculos Recientes
                  </h5>
                  <button 
                    class="btn btn-sm btn-outline-secondary"
                    @click="clearHistory"
                  >
                    <i class="bi bi-trash me-1"></i>
                    Limpiar
                  </button>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover table-sm">
                    <thead>
                      <tr>
                        <th>Glucosa</th>
                        <th>Carbos</th>
                        <th>Basal</th>
                        <th>Tipo</th>
                        <th>Dosis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in recentHistory" :key="index">
                        <td>{{ item.glucose }} mmol/L</td>
                        <td>{{ item.carbs }} g</td>
                        <td>
                          <span :class="item.hasBasal ? 'badge bg-success' : 'badge bg-secondary'">
                            {{ item.hasBasal ? 'Sí' : 'No' }}
                          </span>
                        </td>
                        <td>{{ getMealTypeIcon(item.mealType) }}</td>
                        <td>
                          <strong>{{ item.dose }} U</strong>
                          <span 
                            class="badge ms-1"
                            :class="{
                              'bg-success': item.confidence === 'high',
                              'bg-warning text-dark': item.confidence === 'medium',
                              'bg-danger': item.confidence === 'low'
                            }"
                          >
                            {{ item.confidence }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
import { ref, reactive, onMounted, computed } from 'vue'
import Header from '@/common/Header.vue'

const sidebarRef = ref(null)

// Configuración de la API
const apiBaseUrl = ref('https://9b9v7hgp-8000.brs.devtunnels.ms/prediction')

// Estado de la API
const apiStatus = reactive({
  healthy: false,
  modelLoaded: false
})

// Estado de carga
const loading = ref(false)

// Mostrar opciones avanzadas
const showAdvanced = ref(false)

// Hora y día actuales
const currentHour = computed(() => new Date().getHours())
const currentDay = computed(() => new Date().getDay())

// Datos del formulario
const formData = reactive({
  glucose: null,
  carbs: null,
  hasBasal: true,
  mealType: 'Lunch',
  hourOfDay: null,
  dayOfWeek: null,
  glucoseMinutesBefore: 10
})

// Información de carbohidratos desde food-registration
const foodRegistrationData = ref(null)

// Resultado del cálculo
const result = reactive({
  show: false,
  predictedDose: 0,
  confidence: '',
  inputSummary: {},
  warnings: [],
  timestamp: ''
})

// Historial de cálculos recientes (localStorage)
const recentHistory = ref([])

// Información del modelo
const modelInfo = ref(null)

// Methods
const toggleSidebar = () => {
  sidebarRef.value?.openMobileMenu()
}

// Verificar estado de la API
const checkApiHealth = async () => {
  try {
    const response = await fetch(`${apiBaseUrl.value}/model-info`)
    if (response.ok) {
      const data = await response.json()
      apiStatus.modelLoaded = data.model_loaded
      apiStatus.healthy = true
      return true
    }
  } catch (error) {
    console.error('Error checking API health:', error)
    apiStatus.modelLoaded = false
  }
  return false
}

// Obtener información del modelo
const getModelInfo = async () => {
  try {
    const response = await fetch(`${apiBaseUrl.value}/model-info`)
    if (response.ok) {
      modelInfo.value = await response.json()
    }
  } catch (error) {
    console.error('Error getting model info:', error)
  }
}

// Función para calcular la dosis de bolus
const calculateBolus = async () => {
  if (!apiStatus.healthy) {
    alert('La API no está disponible. Verifica que el servidor esté corriendo.')
    return
  }

  loading.value = true
  result.show = false

  try {
    // Preparar datos para la API
    const requestData = {
      glucose_value: formData.glucose,
      carbs_g: formData.carbs,
      has_basal_today: formData.hasBasal,
      meal_type: formData.mealType,
      hour_of_day: formData.hourOfDay !== null ? formData.hourOfDay : currentHour.value,
      day_of_week: formData.dayOfWeek !== null ? formData.dayOfWeek : currentDay.value,
      glucose_minutes_before: formData.glucoseMinutesBefore
    }

    // Llamar a la API
    const response = await fetch(`${apiBaseUrl.value}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Actualizar resultado
    result.show = true
    result.predictedDose = data.predicted_dose
    result.confidence = data.confidence
    result.inputSummary = data.input_summary
    result.warnings = data.warnings || []
    result.timestamp = data.timestamp

    // Agregar al historial
    const historyItem = {
      glucose: formData.glucose,
      carbs: formData.carbs,
      hasBasal: formData.hasBasal,
      mealType: formData.mealType,
      dose: data.predicted_dose,
      confidence: data.confidence,
      timestamp: new Date().toISOString()
    }

    recentHistory.value.unshift(historyItem)

    // Mantener solo los últimos 10 cálculos
    if (recentHistory.value.length > 10) {
      recentHistory.value = recentHistory.value.slice(0, 10)
    }

    // Guardar en localStorage (historial y resultado actual)
    saveHistoryToStorage()
    saveBolusResultToStorage(data.predicted_dose, data.confidence)

    // Scroll suave al resultado
    setTimeout(() => {
      const resultElement = document.querySelector('.result-container')
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 100)

  } catch (error) {
    console.error('Error calculating bolus:', error)
    alert(`Error al calcular la dosis: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// Guardar historial en localStorage
const saveHistoryToStorage = () => {
  try {
    localStorage.setItem('bolusHistory', JSON.stringify(recentHistory.value))
  } catch (error) {
    console.error('Error saving history to localStorage:', error)
  }
}

// Guardar resultado actual de bolus en localStorage
const saveBolusResultToStorage = (dose, confidence) => {
  try {
    const bolusResult = {
      dose: dose,
      confidence: confidence,
      glucose: formData.glucose,
      carbs: formData.carbs,
      hasBasal: formData.hasBasal,
      mealType: formData.mealType,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('diabetes-bolus-result', JSON.stringify(bolusResult))
    console.log('✅ Resultado de bolus guardado en localStorage')
  } catch (error) {
    console.error('❌ Error al guardar resultado de bolus:', error)
  }
}

// Cargar historial desde localStorage
const loadHistoryFromStorage = () => {
  try {
    const saved = localStorage.getItem('bolusHistory')
    if (saved) {
      recentHistory.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading history from localStorage:', error)
  }
}

// Limpiar historial
const clearHistory = () => {
  if (confirm('¿Está seguro de que desea limpiar el historial?')) {
    recentHistory.value = []
    localStorage.removeItem('bolusHistory')
  }
}

// Obtener texto de confianza
const getConfidenceText = (confidence) => {
  const texts = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja'
  }
  return texts[confidence] || confidence
}

// Obtener icono de tipo de comida
const getMealTypeIcon = (mealType) => {
  const icons = {
    Breakfast: '🌅',
    Lunch: '🌞',
    Dinner: '🌙',
    Snack: '🍎',
    'Pre-meal': '🕐',
    'Post-meal': '🕑'
  }
  return icons[mealType] || '🍽️'
}

// Cargar datos de carbohidratos desde localStorage
const loadFoodRegistrationData = () => {
  try {
    const saved = localStorage.getItem('diabetes-food-registration')
    if (saved) {
      const data = JSON.parse(saved)
      foodRegistrationData.value = data
      
      // Si hay carbohidratos guardados, cargarlos automáticamente
      if (data.alimentosSeleccionados && data.alimentosSeleccionados.length > 0) {
        const totalCarbs = data.alimentosSeleccionados.reduce(
          (sum, alimento) => sum + alimento.hidratos_carbono,
          0
        )
        formData.carbs = Math.round(totalCarbs * 10) / 10 // Redondear a 1 decimal
        
        // Mapear tiempo de comida si está disponible
        if (data.tiempoComidaSeleccionado) {
          const mealTypeMap = {
            'desayuno': 'meal_Breakfast',
            'almuerzo': 'meal_Lunch',
            'cena': 'meal_Dinner'
          }
          formData.mealType = mealTypeMap[data.tiempoComidaSeleccionado] || 'meal_Lunch'
        }
      }
    }
  } catch (error) {
    console.error('Error loading food registration data:', error)
  }
}

// Recargar datos de carbohidratos manualmente
const reloadCarbsFromStorage = () => {
  loadFoodRegistrationData()
  if (foodRegistrationData.value && formData.carbs) {
    alert(`✅ Carbohidratos cargados: ${formData.carbs}g`)
  } else {
    alert('⚠️ No hay datos de carbohidratos guardados en el registro de alimentos.')
  }
}

// Inicialización
onMounted(async () => {
  await checkApiHealth()
  if (apiStatus.healthy) {
    await getModelInfo()
  }
  loadHistoryFromStorage()
  loadFoodRegistrationData() // Cargar datos de carbohidratos
  
  // Establecer valores por defecto
  formData.hourOfDay = currentHour.value
  formData.dayOfWeek = currentDay.value
})
</script>

<style scoped>
.bolus-calculator {
  min-height: 100vh;
  background: linear-gradient(135deg, #5bdcd3 0%, #116560 100%);
  padding-top: 60px;
}

.btn-calculate {
  background: linear-gradient(135deg,  #00A79D 0%, #116560 100%);
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-calculate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-calculate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-container {
  background: linear-gradient(135deg, #67bfb9 0%, #116560 100%);
  border-radius: 15px;
  overflow: hidden;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 20px;
  font-weight: 600;
  color: white;
  font-size: 1.1rem;
}

.result-body {
  padding: 30px 20px;
  background: white;
}

.bolus-dose {
  font-size: 3.5rem;
  font-weight: 700;
  color: #00A79D;
  text-align: center;
  margin-bottom: 20px;
}

.bolus-dose .units {
  font-size: 1.5rem;
  color: #888;
  font-weight: 400;
}

.result-details {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #555;
}

.detail-value {
  font-weight: 600;
  color: #333;
}

.result-note {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.warnings-section {
  border-radius: 8px;
  overflow: hidden;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.card {
  border: none;
  border-radius: 15px;
}

.table-sm td, .table-sm th {
  padding: 0.5rem;
  vertical-align: middle;
}
</style>