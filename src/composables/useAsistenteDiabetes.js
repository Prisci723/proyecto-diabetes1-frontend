// composables/useAsistenteDiabetes.js
import { ref, computed } from 'vue'

/**
 * Composable para manejar la lógica del Asistente de Diabetes
 * Separa la lógica de negocio del componente UI
 */
export function useAsistenteDiabetes() {
  // Configuración de la API
  const API_URL = import.meta.env.VITE_API_URL || '/api'

  // Estado reactivo
  const categorias = ref([])
  const alimentosSeleccionados = ref([])
  const alimentosActuales = ref([])
  const cargandoAlimentos = ref(false)
  const error = ref(null)

  // Estado de la dieta
  const dietaSeleccionada = ref(null)
  const tiempoComidaSeleccionado = ref(null)
  const carbohidratosPermitidos = ref(0)

  /**
   * Cargar categorías desde el API
   */
  const cargarCategorias = async () => {
    try {
      error.value = null
      const response = await fetch(`${API_URL}/categorias`)
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      categorias.value = data.categorias
    } catch (err) {
      error.value = 'No se pudieron cargar las categorías. Verifica que el servidor esté corriendo.'
      console.error('Error al cargar categorías:', err)
      throw err
    }
  }

  /**
   * Cargar alimentos de una categoría
   */
  const cargarAlimentos = async (categoria) => {
    try {
      error.value = null
      cargandoAlimentos.value = true
      
      const response = await fetch(`${API_URL}/alimentos/${categoria}`)
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      
      const alimentos = await response.json()
      alimentosActuales.value = alimentos
      
      return alimentos
    } catch (err) {
      error.value = 'Error al cargar los alimentos'
      console.error('Error al cargar alimentos:', err)
      throw err
    } finally {
      cargandoAlimentos.value = false
    }
  }

  /**
   * Verificar si un alimento está seleccionado
   */
  const isAlimentoSeleccionado = (id) => {
    return alimentosSeleccionados.value.some(a => a.id_alimento === id)
  }

  /**
   * Toggle selección de alimento
   */
  const toggleAlimento = (alimento, categoria) => {
    const index = alimentosSeleccionados.value.findIndex(
      a => a.id_alimento === alimento.id
    )
    
    if (index > -1) {
      // Quitar alimento
      alimentosSeleccionados.value.splice(index, 1)
    } else {
      // Agregar alimento
      alimentosSeleccionados.value.push({
        categoria: categoria,
        id_alimento: alimento.id,
        nombre_alimento: alimento.alimento,
        hidratos_carbono: alimento.hidratos_carbono || 0
      })
    }
  }

  /**
   * Limpiar toda la selección
   */
  const limpiarSeleccion = () => {
    alimentosSeleccionados.value = []
  }

  /**
   * Establecer dieta seleccionada
   */
  const setDieta = (calorias, tiempoComida, carbohidratos) => {
    dietaSeleccionada.value = calorias
    tiempoComidaSeleccionado.value = tiempoComida
    carbohidratosPermitidos.value = carbohidratos
    limpiarSeleccion()
  }

  // Computed properties
  const totalCarbohidratos = computed(() => {
    return alimentosSeleccionados.value.reduce(
      (sum, alimento) => sum + alimento.hidratos_carbono, 
      0
    )
  })

  const excesoPermitido = computed(() => {
    if (!dietaSeleccionada.value || carbohidratosPermitidos.value === 0) {
      return false
    }
    return totalCarbohidratos.value > carbohidratosPermitidos.value
  })

  const diferenciaCarbohidratos = computed(() => {
    return totalCarbohidratos.value - carbohidratosPermitidos.value
  })

  const porcentajeConsumo = computed(() => {
    if (carbohidratosPermitidos.value === 0) return 0
    return (totalCarbohidratos.value / carbohidratosPermitidos.value) * 100
  })

  const estadoConsumo = computed(() => {
    if (!dietaSeleccionada.value) return 'sin-dieta'
    
    const diferencia = diferenciaCarbohidratos.value
    
    if (totalCarbohidratos.value <= carbohidratosPermitidos.value) {
      return 'ok'
    } else if (diferencia <= 5) {
      return 'warning'
    } else {
      return 'danger'
    }
  })

  /**
   * Agrupar platos preparados por plato_base
   */
  const agruparPlatosPreparados = (alimentos) => {
    const grupos = {}
    
    alimentos.forEach(alimento => {
      const platoBase = alimento.plato_base || alimento.alimento
      if (!grupos[platoBase]) {
        grupos[platoBase] = {
          imagen: alimento.imagen,
          porciones: []
        }
      }
      grupos[platoBase].porciones.push(alimento)
    })
    
    return grupos
  }

  return {
    // Estado
    categorias,
    alimentosSeleccionados,
    alimentosActuales,
    cargandoAlimentos,
    error,
    dietaSeleccionada,
    tiempoComidaSeleccionado,
    carbohidratosPermitidos,
    
    // Computed
    totalCarbohidratos,
    excesoPermitido,
    diferenciaCarbohidratos,
    porcentajeConsumo,
    estadoConsumo,
    
    // Métodos
    cargarCategorias,
    cargarAlimentos,
    isAlimentoSeleccionado,
    toggleAlimento,
    limpiarSeleccion,
    setDieta,
    agruparPlatosPreparados
  }
}
