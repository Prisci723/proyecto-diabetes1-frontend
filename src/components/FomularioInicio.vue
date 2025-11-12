<template>
            <Header />
  <div class="medical-info-container">
    <!-- Header -->

    <!-- Main Content -->
    <div class="container mt-4">
      <!-- Welcome Banner -->
      <div class="welcome-banner text-center mb-4">
        <h2>¡Bienvenido!</h2>
      </div>

      <!-- Instructions -->
      <h5 class="mb-3">Ingrese los datos necesarios para comenzar con la aplicación</h5>

      <!-- Medical Information Section -->
      <div class="form-section">
        <h6 class="mb-3"><strong>INFORMACIÓN MÉDICA</strong></h6>

        <!-- Time Since Diagnosis -->
        <div class="section-header mb-3">
          Tiempo desde el diagnóstico
        </div>

        <div class="mb-4">
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="diagnosticTime"
              id="time1"
              value="menos6"
              v-model="datos.tiempo_desde_diagnostico"
            />
            <label class="form-check-label" for="time1">
              menos de 6 meses
            </label>
          </div>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="diagnosticTime"
              id="time2"
              value="6a1"
              v-model="datos.tiempo_desde_diagnostico"
            />
            <label class="form-check-label" for="time2">
              6 meses a 1 año
            </label>
          </div>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="diagnosticTime"
              id="time3"
              value="1a5"
              v-model="datos.tiempo_desde_diagnostico"
            />
            <label class="form-check-label" for="time3">
              1 a 5 años
            </label>
          </div>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="diagnosticTime"
              id="time4"
              value="mas5"
              v-model="datos.tiempo_desde_diagnostico"
            />
            <label class="form-check-label" for="time4">
              más de 5 años
            </label>
          </div>
        </div>

        <!-- Physical Information Section -->
        <h6 class="mb-3"><strong>INFORMACIÓN FÍSICA</strong></h6>

        <!-- Weight -->
        <div class="section-header mb-3">
          Peso
        </div>
        <div class="mb-4">
          <div class="input-group" style="max-width: 600px;">
            <input
              type="number"
              class="form-control"
              v-model="datos.peso_diagnostico"
              placeholder=""
            />
            <span class="input-group-text">kg</span>
          </div>
        </div>

        <!-- Height -->
        <div class="section-header mb-3">
          Altura
        </div>
        <div class="mb-4">
          <div class="input-group" style="max-width: 250px;">
            <input
              type="number"
              class="form-control"
              v-model="datos.altura_diagnostico"
              placeholder=""
            />
            <span class="input-group-text">cm</span>
          </div>
        </div>

        <!-- Next Button -->
        <div  class="d-flex justify-content-end">
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
import Header from '@/common/Header.vue';
// import { useFormularioStore } from '@/stores/formulario';

// const store = useFormularioStore();

const router = useRouter();

const datos = ref({
  tiempo_desde_diagnostico: '',
  peso_diagnostico: '',
  altura_diagnostico: ''
});

const handleNext = () => {
  console.log('Form data:', datos.value);
  
  if (datos.value.tiempo_desde_diagnostico && datos.value.altura_diagnostico) {
    router.push('/formularioInicio2');
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