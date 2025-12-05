<template>
  <div class="medical-info-container">
    <!-- Header -->
    <!-- Main Content -->
    <div class="container mt-4">
      <!-- Instructions -->
      <h5 class="mb-3">Terminos y condiciones de servicio</h5>
      <!-- Medical Information Section -->
      <div class="form-section">
        <!-- Terms and Conditions -->
        <div class="section-header mb-3">
         Aceptación de términos y condiciones
        </div>
        <div class="mb-4">
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              name="aceptacionTerminos"
              id="terminos1"
              v-model="datos.aceptacion_terminos"
            />
            <label class="form-check-label" for="terminos1">
              Acepto los términos y condiciones de servicio
            </label>
          </div>
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              name="aceptacionUsoDatos"
              id="terminos2"
              v-model="datos.aceptacion_uso_datos"
            />
            <label class="form-check-label" for="terminos2">
              Acepto el uso de mis datos conforme a la política de privacidad
            </label>
          </div>


        <!-- Next Button -->
        <div class="d-flex justify-content-end">
          <button class="btn btn-next" @click="handleNext" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ loading ? 'Finalizando...' : 'Finalizar' }}
          </button>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>
      </div>
    </div>
    </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../common/Header.vue';
import { usersAPI } from '@/services/api';
// import { useFormularioStore } from '@/stores/formulario';

// const store = useFormularioStore();

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

const datos = ref({
  aceptacion_terminos: false,
  aceptacion_uso_datos: false
});

const handleNext = async () => {
  console.log('Form data:', datos.value);
  
  // Validar que ambos términos estén aceptados
  if (!datos.value.aceptacion_terminos || !datos.value.aceptacion_uso_datos) {
    alert('Por favor, acepta todos los términos y condiciones antes de continuar.');
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    // Obtener el ID del usuario desde localStorage
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('Error: No se encontró información del usuario. Por favor, inicia sesión nuevamente.');
      router.push('/');
      return;
    }

    // Actualizar formulario_inicio a true en el backend
    await usersAPI.updateFormularioInicio(userId, true);
    
    // Actualizar el objeto user en localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.formulario_inicio = true;
      localStorage.setItem('user', JSON.stringify(user));
    }

    console.log('Formulario inicial completado exitosamente');
    router.push('/paginaInicio');
    
  } catch (error) {
    console.error('Error al actualizar formulario inicial:', error);
    errorMessage.value = error.response?.data?.detail || 'Error al completar el formulario';
    alert('Error al completar el formulario. Por favor, intenta nuevamente.');
  } finally {
    loading.value = false;
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