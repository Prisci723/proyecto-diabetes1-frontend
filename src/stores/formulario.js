// stores/formulario.js
import { defineStore } from 'pinia'

export const useFormularioStore = defineStore('formulario', {
  state: () => ({
    datos: {
        tiempo_desde_diagnostico: '',
        peso_diagnostico: '',
        altura_diagnostico: '',
        nivel_actividad_fisica: '',
        frecuencia_actividad_fisica: '',
        hba1_mas_reciente: '',
        hba1_fecha: '',
        alergias: '',
        aceptacion_terminos: false,
        aceptacion_uso_datos: false
    },
    pasoActual: 1
  }),
  
  actions: {
    actualizarDato(campo, valor) {
      this.datos[campo] = valor
    },
    
    siguientePaso() {
      if (this.pasoActual < 3) this.pasoActual++
    },
    
    pasoAnterior() {
      if (this.pasoActual > 1) this.pasoActual--
    },
    
    resetear() {
      this.$reset()
    }
  }
})