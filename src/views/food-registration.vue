<template>
  <Header @toggle-menu="handleToggleMenu" />
  <div class="asistente-diabetes espacio-header">
    <!-- Header con selección de dieta -->
    <div class="container-fluid bg-white shadow-sm mb-4">
      <div class="container py-4">
        <div class="text-center mb-4">
          <h1 class="display-5 fw-bold text-primary">
            <i class="bi bi-hospital"></i> Asistente Inteligente para Diabetes Tipo 1
          </h1>
          <p class="lead text-muted">Selecciona la dieta recomendada por tu nutricionista</p>
        </div>
        
        <div class="row g-2 mb-3 justify-content-center">
          <div class="col-md-3" v-for="calorias in [1200, 1400, 1600, 1800]" :key="calorias">
            <button 
              @click="abrirModalDieta(calorias)" 
              class="btn btn-outline-primary w-100 py-3"
            >
              <i class="bi bi-clipboard-data"></i> Dieta {{ calorias }} Kcal/día
            </button>
          </div>
        </div>
        
        <div v-if="dietaSeleccionada" class="alert alert-primary text-center" role="alert">
          <div class="row">
            <div class="col-md-4">
              <strong>Dieta seleccionada:</strong> {{ dietaActualNombre }}
            </div>
            <div class="col-md-4">
              <strong>Tiempo de comida:</strong> {{ tiempoComidaNombre }}
            </div>
            <div class="col-md-4">
              <strong>Carbohidratos permitidos:</strong> 
              <span class="badge bg-primary fs-6">{{ carbohidratosPermitidos }}g</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <!-- Columna izquierda: Categorías y Alimentos -->
        <div class="col-lg-8">
          <!-- Sección de Categorías -->
          <div v-if="!categoriaActual" class="categorias-section mb-4">
            <h2 class="h3 mb-4">
              <i class="bi bi-grid-3x3-gap"></i> Categorías de Alimentos
            </h2>
            <div class="row g-3">
              <div 
                v-for="categoria in categorias" 
                :key="categoria.id" 
                class="col-md-6 col-lg-4"
              >
                <div 
                  @click="seleccionarCategoria(categoria.id, categoria.nombre)"
                  class="card categoria-card h-100 shadow-sm"
                  :class="{ 'disabled': !dietaSeleccionada }"
                >
                  <div class="card-body text-center">
                    <h5 class="card-title">{{ categoria.nombre }}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de Alimentos -->
          <div v-else class="alimentos-section mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h3 mb-0">
                <i class="bi bi-basket"></i> {{ categoriaNombre }}
              </h2>
              <button @click="volverACategorias" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> Volver a Categorías
              </button>
            </div>

            <!-- Loading -->
            <div v-if="cargandoAlimentos" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <!-- Lista de alimentos (no platos preparados) -->
            <div v-else-if="categoriaActual !== 'platos_preparados'" class="alimentos-list">
              <div v-if="alimentosActuales.length === 0" class="alert alert-info">
                No hay alimentos registrados en esta categoría
              </div>
              <div 
                v-for="alimento in alimentosActuales" 
                :key="alimento.id"
                class="card alimento-item mb-2"
                :class="{ 'selected': isAlimentoSeleccionado(alimento.id) }"
              >
                <div class="card-body py-2">
                  <div class="d-flex align-items-center">
                    <div class="form-check me-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :id="`alimento-${categoriaActual}-${alimento.id}`"
                        :checked="isAlimentoSeleccionado(alimento.id)"
                        @change="toggleAlimento(alimento)"
                      >
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1">{{ alimento.alimento }}</h6>
                      <div class="alimento-detalles">
                        <span class="badge bg-light text-dark me-2">
                          <i class="bi bi-rulers"></i> {{ alimento.cantidad_sugerida || '-' }} {{ alimento.unidad || '' }}
                        </span>
                        <span class="badge bg-light text-dark me-2">
                          <i class="bi bi-lightning"></i> {{ alimento.energia_kcal || '-' }} kcal
                        </span>
                        <span class="badge bg-light text-dark">
                          <i class="bi bi-egg"></i> {{ alimento.proteina || '-' }}g proteína
                        </span>
                      </div>
                    </div>
                    <div class="ms-3">
                      <span class="badge bg-primary fs-6 px-3 py-2">
                        {{ alimento.hidratos_carbono || 0 }}g CHO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Platos preparados con imágenes -->
            <div v-else class="platos-preparados">
              <div 
                v-for="(grupo, platoBase) in platosAgrupados" 
                :key="platoBase"
                class="card mb-4 shadow-sm"
              >
                <div class="row g-0">
                  <div class="col-md-4">
                    <img 
                      :src="`/images/${grupo.imagen}`" 
                      :alt="platoBase"
                      class="img-fluid rounded-start plato-imagen"
                      @error="handleImageError"
                    >
                    <h5 class="text-center mt-2 fw-bold">{{ platoBase }}</h5>
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h6 class="card-title mb-3">Porciones disponibles:</h6>
                      <div 
                        v-for="alimento in grupo.porciones" 
                        :key="alimento.id"
                        class="porcion-item mb-2 p-2 border rounded"
                        :class="{ 'selected': isAlimentoSeleccionado(alimento.id) }"
                      >
                        <div class="d-flex align-items-center">
                          <div class="form-check me-2">
                            <input 
                              class="form-check-input" 
                              type="checkbox"
                              :id="`alimento-${categoriaActual}-${alimento.id}`"
                              :checked="isAlimentoSeleccionado(alimento.id)"
                              @change="toggleAlimento(alimento)"
                            >
                          </div>
                          <div class="flex-grow-1">
                            <div class="fw-semibold">{{ alimento.alimento }}</div>
                            <small class="text-muted">
                              <i class="bi bi-lightning"></i> {{ alimento.energia_kcal || '-' }} kcal
                              <i class="bi bi-egg ms-2"></i> {{ alimento.proteina || '-' }}g proteína
                            </small>
                          </div>
                          <span class="badge bg-primary">
                            {{ alimento.hidratos_carbono || 0 }}g CHO
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Resumen -->
        <div class="col-lg-4">
          <div class="card shadow-sm sticky-top" style="top: 20px;">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-graph-up"></i> Resumen de Carbohidratos
              </h5>
            </div>
            <div class="card-body">
              <div v-if="alimentosSeleccionados.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-inbox display-4 d-block mb-2"></i>
                No has seleccionado ningún alimento
              </div>
              <div v-else>
                <div class="alimentos-seleccionados-list mb-3">
                  <div 
                    v-for="alimento in alimentosSeleccionados" 
                    :key="alimento.id_unico"
                    class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                  >
                    <span class="text-truncate me-2">{{ alimento.nombre_alimento }}</span>
                    <span class="badge bg-secondary">{{ alimento.hidratos_carbono }}g</span>
                  </div>
                </div>
                
                <div class="total-carbohidratos bg-light p-3 rounded mb-3">
                  <h5 class="mb-0 text-center">
                    Total: <span class="text-primary fw-bold">{{ totalCarbohidratos.toFixed(1) }}g</span>
                  </h5>
                </div>

                <!-- Alerta de comparación -->
                <div v-if="dietaSeleccionada" class="alert mb-3" :class="alertClass">
                  <div v-html="alertMessage"></div>
                </div>

                <button @click="limpiarSeleccion" class="btn btn-danger w-100">
                  <i class="bi bi-trash"></i> Limpiar Selección
                </button>

                <button
                  @click="router.push('/insuline-bolus')" 
                  class="btn btn-primary w-100 mt-2"
                >Calcular Insulina</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Dieta -->
    <div 
      class="modal fade" 
      :class="{ 'show': modalDietaVisible }" 
      :style="{ display: modalDietaVisible ? 'block' : 'none' }"
      tabindex="-1"
      @click.self="cerrarModalDieta"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ dietaActual?.titulo }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarModalDieta"></button>
          </div>
          <div class="modal-body">
            <div v-if="dietaActual" class="dieta-contenido">
              <!-- Tabla de nutrientes -->
              <div class="table-responsive mb-4">
                <table class="table table-bordered table-hover">
                  <thead class="table-primary">
                    <tr>
                      <th>NUTRIMENTO</th>
                      <th>PORCENTAJE</th>
                      <th>KCAL</th>
                      <th>GRAMOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="nutriente in dietaActual.nutrientes" :key="nutriente.nombre">
                      <td><strong>{{ nutriente.nombre }}</strong></td>
                      <td>{{ nutriente.porcentaje }}</td>
                      <td>{{ nutriente.kcal }}</td>
                      <td>{{ nutriente.gramos }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Tabla de tiempos de comida -->
              <div class="table-responsive mb-4">
                <h6 class="text-center mb-3">PLAN DE ALIMENTACIÓN PARA CARBOHIDRATOS POR TIEMPOS DE COMIDA</h6>
                <table class="table table-bordered table-hover">
                  <thead class="table-primary">
                    <tr>
                      <th>TIEMPO DE COMIDA</th>
                      <th>PORCENTAJE</th>
                      <th>KCAL</th>
                      <th>GRAMOS DE CARBOHIDRATOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="tiempo in Object.values(dietaActual.tiemposComida)" :key="tiempo.tiempo">
                      <td><strong>{{ tiempo.tiempo }}</strong></td>
                      <td>{{ tiempo.porcentaje }}</td>
                      <td>{{ tiempo.kcal }}</td>
                      <td>{{ tiempo.carbohidratos }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Selector de tiempo de comida -->
              <div class="mb-3">
                <label for="tiempo-comida-select" class="form-label fw-bold text-danger">
                  Selecciona un Tiempo de Comida:
                </label>
                <select 
                  id="tiempo-comida-select" 
                  class="form-select form-select-lg"
                  v-model="tiempoComidaTemp"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="desayuno">Desayuno</option>
                  <option value="almuerzo">Almuerzo</option>
                  <option value="cena">Cena</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelarDieta">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="aceptarDieta">Aceptar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de alerta de exceso -->
    <div 
      class="modal fade" 
      :class="{ 'show': modalAlertaVisible }" 
      :style="{ display: modalAlertaVisible ? 'block' : 'none' }"
      tabindex="-1"
      @click.self="cerrarModalAlerta"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-4">
            <div class="display-1 mb-3">⚠️</div>
            <h4 class="mb-3">¡Atención!</h4>
            <p class="lead">Se ha excedido la cantidad de carbohidratos permitida</p>
            <div class="alert alert-danger">
              <p class="mb-1"><strong>Carbohidratos permitidos:</strong> {{ carbohidratosPermitidos }}g</p>
              <p class="mb-1"><strong>Carbohidratos actuales:</strong> {{ totalCarbohidratos.toFixed(1) }}g</p>
              <p class="mb-0"><strong>Exceso:</strong> {{ (totalCarbohidratos - carbohidratosPermitidos).toFixed(1) }}g</p>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-primary px-5" @click="cerrarModalAlerta">Entendido</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop para modales -->
    <div 
      v-if="modalDietaVisible || modalAlertaVisible" 
      class="modal-backdrop fade show"
      @click="cerrarTodosLosModales"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Header from '../common/Header.vue';
// URL del API Backend
const API_URL = '/api/alimentos';
import { useRouter } from 'vue-router';
const router = useRouter();

// Estado de la aplicación
const categorias = ref([]);
const alimentosSeleccionados = ref([]);
const categoriaActual = ref(null);
const categoriaNombre = ref('');
const alimentosActuales = ref([]);
const cargandoAlimentos = ref(false);

// Estado de la dieta seleccionada
const dietaSeleccionada = ref(null);
const tiempoComidaSeleccionado = ref(null);
const carbohidratosPermitidos = ref(0);
const caloriasDietaActual = ref(null);

// Estado de modales
const modalDietaVisible = ref(false);
const modalAlertaVisible = ref(false);
const tiempoComidaTemp = ref('');

// Datos de las dietas
const dietasData = {
  1200: {
    titulo: "CUADRO DIETOSINTÉTICO - DIETA 1200 kcal/día",
    nombre: "1200 Kcal/día",
    nutrientes: [
      { nombre: "Hidratos de carbono", porcentaje: "60%", kcal: 720, gramos: 180 },
      { nombre: "Proteína", porcentaje: "15%", kcal: 180, gramos: 45 },
      { nombre: "Lípidos", porcentaje: "25%", kcal: 300, gramos: 33 }
    ],
    tiemposComida: {
      desayuno: { tiempo: "Desayuno", porcentaje: "30%", kcal: 216, carbohidratos: 54 },
      almuerzo: { tiempo: "Almuerzo", porcentaje: "40%", kcal: 288, carbohidratos: 72 },
      cena: { tiempo: "Cena", porcentaje: "30%", kcal: 216, carbohidratos: 54 }
    }
  },
  1400: {
    titulo: "CUADRO DIETOSINTÉTICO - DIETA 1400 kcal/día",
    nombre: "1400 Kcal/día",
    nutrientes: [
      { nombre: "Hidratos de carbono", porcentaje: "60%", kcal: 840, gramos: 210 },
      { nombre: "Proteína", porcentaje: "15%", kcal: 210, gramos: 52 },
      { nombre: "Lípidos", porcentaje: "25%", kcal: 350, gramos: 39 }
    ],
    tiemposComida: {
      desayuno: { tiempo: "Desayuno", porcentaje: "30%", kcal: 252, carbohidratos: 63 },
      almuerzo: { tiempo: "Almuerzo", porcentaje: "40%", kcal: 336, carbohidratos: 84 },
      cena: { tiempo: "Cena", porcentaje: "30%", kcal: 252, carbohidratos: 63 }
    }
  },
  1600: {
    titulo: "CUADRO DIETOSINTÉTICO - DIETA 1600 kcal/día",
    nombre: "1600 Kcal/día",
    nutrientes: [
      { nombre: "Hidratos de carbono", porcentaje: "60%", kcal: 986, gramos: 246 },
      { nombre: "Proteína", porcentaje: "15%", kcal: 247, gramos: 62 },
      { nombre: "Lípidos", porcentaje: "25%", kcal: 411, gramos: 46 }
    ],
    tiemposComida: {
      desayuno: { tiempo: "Desayuno", porcentaje: "30%", kcal: 296, carbohidratos: 74 },
      almuerzo: { tiempo: "Almuerzo", porcentaje: "40%", kcal: 394, carbohidratos: 98 },
      cena: { tiempo: "Cena", porcentaje: "30%", kcal: 296, carbohidratos: 74 }
    }
  },
  1800: {
    titulo: "CUADRO DIETOSINTÉTICO - DIETA 1800 kcal/día",
    nombre: "1800 Kcal/día",
    nutrientes: [
      { nombre: "Hidratos de carbono", porcentaje: "60%", kcal: 1080, gramos: 270 },
      { nombre: "Proteína", porcentaje: "15%", kcal: 270, gramos: 68 },
      { nombre: "Lípidos", porcentaje: "25%", kcal: 450, gramos: 50 }
    ],
    tiemposComida: {
      desayuno: { tiempo: "Desayuno", porcentaje: "30%", kcal: 324, carbohidratos: 81 },
      almuerzo: { tiempo: "Almuerzo", porcentaje: "40%", kcal: 432, carbohidratos: 108 },
      cena: { tiempo: "Cena", porcentaje: "30%", kcal: 324, carbohidratos: 81 }
    }
  }
};

// Computed properties
const dietaActual = computed(() => {
  return caloriasDietaActual.value ? dietasData[caloriasDietaActual.value] : null;
});

const dietaActualNombre = computed(() => {
  return dietaActual.value ? dietaActual.value.nombre : '';
});

const tiempoComidaNombre = computed(() => {
  if (!dietaActual.value || !tiempoComidaSeleccionado.value) return '';
  return dietaActual.value.tiemposComida[tiempoComidaSeleccionado.value].tiempo;
});

const totalCarbohidratos = computed(() => {
  return alimentosSeleccionados.value.reduce(
    (sum, alimento) => sum + alimento.hidratos_carbono, 
    0
  );
});

const platosAgrupados = computed(() => {
  const grupos = {};
  alimentosActuales.value.forEach(alimento => {
    const platoBase = alimento.plato_base || alimento.alimento;
    if (!grupos[platoBase]) {
      grupos[platoBase] = {
        imagen: alimento.imagen,
        porciones: []
      };
    }
    grupos[platoBase].porciones.push(alimento);
  });
  return grupos;
});

const alertClass = computed(() => {
  if (!dietaSeleccionada.value) return '';
  
  const total = totalCarbohidratos.value;
  const diferencia = total - carbohidratosPermitidos.value;
  
  if (total <= carbohidratosPermitidos.value) {
    return 'alert-success';
  } else if (diferencia <= 5) {
    return 'alert-warning';
  } else {
    return 'alert-danger';
  }
});

const alertMessage = computed(() => {
  if (!dietaSeleccionada.value) return '';
  
  const total = totalCarbohidratos.value;
  const diferencia = total - carbohidratosPermitidos.value;
  const porcentaje = (total / carbohidratosPermitidos.value) * 100;
  
  if (total <= carbohidratosPermitidos.value) {
    return `✅ <strong>Excelente!</strong> Estás dentro del límite permitido.<br>
            Has consumido ${total.toFixed(1)}g de ${carbohidratosPermitidos.value}g permitidos (${porcentaje.toFixed(1)}%)`;
  } else if (diferencia <= 5) {
    return `⚠️ <strong>Atención:</strong> Estás ligeramente sobre el límite.<br>
            Has consumido ${total.toFixed(1)}g de ${carbohidratosPermitidos.value}g permitidos (+${diferencia.toFixed(1)}g)`;
  } else {
    return `❌ <strong>Cuidado:</strong> Has excedido el límite de carbohidratos.<br>
            Has consumido ${total.toFixed(1)}g de ${carbohidratosPermitidos.value}g permitidos (+${diferencia.toFixed(1)}g)`;
  }
});

// Watch para mostrar modal de alerta
watch(totalCarbohidratos, (newTotal) => {
  if (dietaSeleccionada.value && newTotal > carbohidratosPermitidos.value) {
    modalAlertaVisible.value = true;
  }
});

// Watch para guardar en localStorage cuando cambien los alimentos seleccionados
watch(alimentosSeleccionados, (newValue) => {
  guardarEnLocalStorage();
}, { deep: true });

// Watch para guardar cuando cambie la dieta o tiempo de comida
watch([dietaSeleccionada, tiempoComidaSeleccionado], () => {
  guardarEnLocalStorage();
});

// Funciones de localStorage
const guardarEnLocalStorage = () => {
  const datos = {
    alimentosSeleccionados: alimentosSeleccionados.value,
    dietaSeleccionada: dietaSeleccionada.value,
    tiempoComidaSeleccionado: tiempoComidaSeleccionado.value,
    carbohidratosPermitidos: carbohidratosPermitidos.value,
    caloriasDietaActual: caloriasDietaActual.value,
    timestamp: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('diabetes-food-registration', JSON.stringify(datos));
    console.log('✅ Datos guardados en localStorage');
  } catch (error) {
    console.error('❌ Error al guardar en localStorage:', error);
  }
};

const cargarDesdeLocalStorage = () => {
  try {
    const datos = localStorage.getItem('diabetes-food-registration');
    if (datos) {
      const parsed = JSON.parse(datos);
      
      // Restaurar los datos
      alimentosSeleccionados.value = parsed.alimentosSeleccionados || [];
      dietaSeleccionada.value = parsed.dietaSeleccionada;
      tiempoComidaSeleccionado.value = parsed.tiempoComidaSeleccionado;
      carbohidratosPermitidos.value = parsed.carbohidratosPermitidos || 0;
      caloriasDietaActual.value = parsed.caloriasDietaActual;
      
      console.log('✅ Datos cargados desde localStorage');
      
      // Verificar si los datos son del mismo día
      const timestamp = new Date(parsed.timestamp);
      const hoy = new Date();
      const esMismoDia = timestamp.toDateString() === hoy.toDateString();
      
      if (!esMismoDia) {
        console.log('ℹ️ Los datos son de otro día');
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar desde localStorage:', error);
  }
};

const limpiarLocalStorage = () => {
  try {
    localStorage.removeItem('diabetes-food-registration');
    console.log('✅ localStorage limpiado');
  } catch (error) {
    console.error('❌ Error al limpiar localStorage:', error);
  }
};

// Métodos
const cargarCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/categorias`);
    const data = await response.json();
    categorias.value = data.categorias;
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    alert('No se pudieron cargar las categorías. Verifica que el servidor esté corriendo.');
  }
};

const seleccionarCategoria = async (categoriaId, nombre) => {
  if (!dietaSeleccionada.value || !tiempoComidaSeleccionado.value) {
    alert('⚠️ Debes seleccionar una Dieta y un Tiempo de Comida primero.\n\nPor favor, haz clic en uno de los botones de dieta en el encabezado.');
    return;
  }
  
  categoriaActual.value = categoriaId;
  categoriaNombre.value = nombre;
  await cargarAlimentos(categoriaId);
};

const cargarAlimentos = async (categoria) => {
  cargandoAlimentos.value = true;
  try {
    const response = await fetch(`${API_URL}/alimentos/${categoria}`);
    const alimentos = await response.json();
    alimentosActuales.value = alimentos;
  } catch (error) {
    console.error('Error al cargar alimentos:', error);
    alert('Error al cargar los alimentos');
  } finally {
    cargandoAlimentos.value = false;
  }
};

const volverACategorias = () => {
  categoriaActual.value = null;
  categoriaNombre.value = '';
  alimentosActuales.value = [];
};

// FUNCIÓN CORREGIDA: Verificar si un alimento está seleccionado
const isAlimentoSeleccionado = (idAlimento) => {
  const idUnico = `${categoriaActual.value}-${idAlimento}`;
  return alimentosSeleccionados.value.some(a => a.id_unico === idUnico);
};

// FUNCIÓN CORREGIDA: Toggle de selección de alimento
const toggleAlimento = (alimento) => {
  const idUnico = `${categoriaActual.value}-${alimento.id}`;
  
  const index = alimentosSeleccionados.value.findIndex(
    a => a.id_unico === idUnico
  );
  
  if (index > -1) {
    // Remover alimento
    alimentosSeleccionados.value.splice(index, 1);
  } else {
    // Agregar alimento con ID único
    alimentosSeleccionados.value.push({
      id_unico: idUnico,
      categoria: categoriaActual.value,
      id_alimento: alimento.id,
      nombre_alimento: alimento.alimento,
      hidratos_carbono: alimento.hidratos_carbono || 0
    });
  }
};

const limpiarSeleccion = () => {
  if (alimentosSeleccionados.value.length === 0) return;
  
  if (confirm('¿Estás seguro de que deseas limpiar toda la selección?')) {
    alimentosSeleccionados.value = [];
    guardarEnLocalStorage();
  }
};

const abrirModalDieta = (calorias) => {
  caloriasDietaActual.value = calorias;
  tiempoComidaTemp.value = '';
  modalDietaVisible.value = true;
};

const cerrarModalDieta = () => {
  modalDietaVisible.value = false;
};

const aceptarDieta = () => {
  if (!tiempoComidaTemp.value) {
    alert('⚠️ Por favor, selecciona un Tiempo de Comida');
    return;
  }
  
  const dieta = dietaActual.value;
  const tiempoData = dieta.tiemposComida[tiempoComidaTemp.value];
  
  dietaSeleccionada.value = caloriasDietaActual.value;
  tiempoComidaSeleccionado.value = tiempoComidaTemp.value;
  carbohidratosPermitidos.value = tiempoData.carbohidratos;
  
  cerrarModalDieta();
  
  alimentosSeleccionados.value = [];
  
  alert(`✅ Dieta ${dieta.nombre} configurada\nTiempo de comida: ${tiempoData.tiempo}\nCarbohidratos permitidos: ${tiempoData.carbohidratos}g`);
};

const cancelarDieta = () => {
  if (confirm('¿Estás seguro de cancelar? Deberás seleccionar una dieta para continuar.')) {
    cerrarModalDieta();
  }
};

const cerrarModalAlerta = () => {
  modalAlertaVisible.value = false;
};

const cerrarTodosLosModales = () => {
  modalDietaVisible.value = false;
  modalAlertaVisible.value = false;
};

const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg';
};

// Cargar categorías y datos guardados al montar el componente
cargarDesdeLocalStorage();
cargarCategorias();
</script>

<style scoped>
/* Color principal */
:root {
  --primary-color: #00A79D;
}

/* Override Bootstrap primary color */
.asistente-diabetes {
  --bs-primary: #00A79D;
  --bs-primary-rgb: 0, 167, 157;
}

.text-primary {
  color: var(--primary-color) !important;
}

.bg-primary {
  background-color: var(--primary-color) !important;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #008f86;
  border-color: #008f86;
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.badge.bg-primary {
  background-color: var(--primary-color) !important;
}

.table-primary {
  background-color: rgba(0, 167, 157, 0.1) !important;
}

.alert-primary {
  background-color: rgba(0, 167, 157, 0.1);
  border-color: var(--primary-color);
  color: #004d47;
}

/* Categorías */
.categoria-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
}

.categoria-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 167, 157, 0.3) !important;
  border-color: var(--primary-color);
}

.categoria-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.categoria-card.disabled:hover {
  transform: none;
  box-shadow: none !important;
}

/* Alimentos */
.alimento-item {
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.alimento-item:hover {
  border-left-color: var(--primary-color);
  background-color: rgba(0, 167, 157, 0.05);
}

.alimento-item.selected {
  background-color: rgba(0, 167, 157, 0.1);
  border-left-color: var(--primary-color);
}

.alimento-detalles .badge {
  font-weight: normal;
  font-size: 0.85rem;
}

/* Platos preparados */
.plato-imagen {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.porcion-item {
  transition: all 0.2s ease;
}

.porcion-item:hover {
  background-color: rgba(0, 167, 157, 0.05);
}

.porcion-item.selected {
  background-color: rgba(0, 167, 157, 0.1);
  border-color: var(--primary-color) !important;
}

/* Checkboxes personalizados */
.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.form-check-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.25rem rgba(0, 167, 157, 0.25);
}

/* Modal */
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop.show {
  opacity: 0.5;
}

/* Sticky sidebar */
@media (min-width: 992px) {
  .sticky-top {
    position: sticky;
    top: 20px;
    z-index: 1020;
  }
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

.alimento-item,
.categoria-card {
  animation: fadeIn 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .display-5 {
    font-size: 1.5rem;
  }
  
  .plato-imagen {
    height: 200px;
  }
}
</style>
