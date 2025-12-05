<template>
  <div class="medical-info-container">
    <!-- Header --> 

    <!-- Main Content -->
    <div class="container mt-4">
      <!-- Instructions -->
      <h5 class="mb-3">Ingrese los datos necesarios para comenzar con la aplicación</h5>

      <!-- Medical Information Section -->
      <div class="form-section">
        <!-- Time Since Diagnosis -->
        <div class="section-header mb-3">
         Nivel de actividad física
        </div>
        <div class="mb-4">
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="nivelActividad"
              id="nivel1"
              value="sedentario"
              v-model="datos.frecuencia_actividad_fisica"
            />
            <label class="form-check-label" for="nivel1">
              Sedentario (poco ejercicio)
            </label>
          </div>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="nivelActividad"
              id="nivel1"
              value="ligero"
              v-model="datos.frecuencia_actividad_fisica"
            />
            <label class="form-check-label" for="nivel1">
              Ligero (ejercicio 1-3 días)
            </label>
          </div>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="nivelActividad"
              id="nivel1"
              value="moderado"
              v-model="datos.frecuencia_actividad_fisica"
            />
            <label class="form-check-label" for="nivel1">
              Moderado (ejercicio 3-5 días)
            </label>
          </div>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="nivelActividad"
              id="nivel1"
              value="activo"
              v-model="datos.frecuencia_actividad_fisica"
            />
            <label class="form-check-label" for="nivel1">
              Activo (ejercicio 6-7 días)
            </label>
          </div>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="nivelActividad"
              id="nivel1"
              value="muy_activo"
              v-model="datos.frecuencia_actividad_fisica"
            />
            <label class="form-check-label" for="nivel1">
              Muy activo (atleta)
            </label>
          </div>
        </div>
        <h6 class="mb-3"><strong>HISTORIAL MÉDICO</strong></h6>

        <!-- HbA1 -->
        <div class="section-header mb-3">
          HbA1 más reciente (última medición)
        </div>
        <div class="mb-4">
          <div class="input-group" style="max-width: 600px;">
            <input
              type="number"
              class="form-control"
              v-model="datos.hba1_mas_reciente"
              placeholder=""
            />
            <span class="input-group-text">%</span>
          </div>
        </div>

        <!-- Fecha -->
        <div class="section-header mb-3">
          Fecha de la última medición de HbA1
        </div>
        <div class="mb-4">
          <div class="input-group" style="max-width: 600px;">
            <input
              type="date"
              class="form-control"
              v-model="datos.hba1_fecha"
              placeholder=""
            />
          </div>
        </div>

        <!-- Alergia o Intolerancia -->
        <div class="section-header mb-3">
          Alergia o Intolerancia
        </div>
        <div class="mb-4">
          <div class="input-group" style="max-width: 250px;">
            <input
              type="text"
              class="form-control"
              v-model="datos.alergias"
              placeholder=""
            />
          </div>
        </div>

        <!-- Next Button -->
        <div class="d-flex justify-content-end">
          <button class="btn btn-next" @click="handleNext">
            siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../common/Header.vue';
// import { useFormularioStore } from '@/stores/formulario';

// const store = useFormularioStore();

const router = useRouter();

const datos = ref({
  frecuencia_actividad_fisica: '',
  hba1_mas_reciente: '',
  hba1_fecha: '',
  alergias: ''
});

const handleNext = () => {
  console.log('Form data:', datos.value);
  
  if (datos.value.frecuencia_actividad_fisica && datos.value.hba1_mas_reciente) {
    router.push('/formularioInicio3');
  } else {
    alert('Por favor, complete todos los campos antes de continuar.');
  }
};
</script>
  

<style scoped>
.medical-info-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar-custom {
  background-color: #00A79D;
  padding: 1rem;
  /* width: 100%; */
}

.welcome-banner {
  background-color: #00A79D;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

.form-section {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  background-color: #00A79D;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.form-check-input {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.15rem;
}

.form-check-input:checked {
  background-color: #046b64;
  border-color: #14d2c5;
}

.form-check-label {
  margin-left: 0.5rem;
  font-size: 1rem;
}

.input-group-text {
  background-color: white;
  border-left: none;
  font-weight: 500;
}

.form-control:focus {
  border-color: #17a2b8;
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25);
}

.btn-next {
  background-color: #006962;
  color: white;
  padding: 0.75rem 2.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-next:hover {
  background-color: #00A79D;
  color: white;
}

/* Estilos para los radio buttons personalizados */
.form-check-input[type="radio"] {
  border-radius: 50%;
}
</style>