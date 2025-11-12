<template>
  <div class="login-container">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-5 col-lg-4">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="logo-circle mx-auto mb-3">
                  <i class="bi bi-person-circle"></i>
                </div>
                <h3 class="card-title fw-bold">{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h3>
                <p class="text-muted small">{{ isLogin ? 'Bienvenido de vuelta' : 'Únete a nosotros' }}</p>
              </div>

              <form @submit.prevent="handleSubmit">
                <div v-if="!isLogin" class="mb-3">
                  <label for="name" class="form-label">Nombre completo</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="formData.name"
                    placeholder="Tu nombre"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="formData.email"
                    placeholder="tu@email.com"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    v-model="formData.password"
                    placeholder="••••••••"
                    required
                  >
                </div>

                <div v-if="!isLogin" class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword" 
                    v-model="formData.confirmPassword"
                    placeholder="••••••••"
                    required
                  >
                </div>

                <div v-if="isLogin" class="mb-3 text-end">
                  <a href="#" class="text-decoration-none small forgot-link" @click.prevent="showForgotPasswordModal">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" class="btn btn-primary w-100 py-2 mb-3">
                  {{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
                </button>
              </form>

              <div class="text-center">
                <span class="text-muted small">
                  {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
                </span>
                <a href="#" @click.prevent="toggleMode" class="ms-1 text-decoration-none toggle-link">
                  {{ isLogin ? 'Crear una' : 'Iniciar sesión' }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <transition name="fade">
      <div v-if="isForgotPassword" class="modal-backdrop" @click="closeForgotPasswordModal">
        <div class="modal-dialog modal-dialog-centered" @click.stop>
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h4 class="card-title fw-bold">Recuperar Contraseña</h4>
                <p class="text-muted small">Ingresa tu correo electrónico para recibir un enlace de restablecimiento.</p>
              </div>
              <form @submit.prevent="handleForgotPassword">
                <div class="mb-3">
                  <label for="forgotEmail" class="form-label">Correo electrónico</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="forgotEmail" 
                    v-model="forgotEmail"
                    placeholder="tu@email.com"
                    required
                  >
                </div>
                <div class="d-flex justify-content-between gap-2">
                  <button type="button" class="btn btn-secondary flex-fill" @click="closeForgotPasswordModal">Cancelar</button>
                  <button type="submit" class="btn btn-primary flex-fill">Enviar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isLogin: true,
      isForgotPassword: false,
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      forgotEmail: ''
    }
  },
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.formData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
    },
    showForgotPasswordModal() {
      this.isForgotPassword = true;
      this.$nextTick(() => {
        const emailInput = document.getElementById('forgotEmail');
        if (emailInput) emailInput.focus();
      });
    },
    closeForgotPasswordModal() {
      this.isForgotPassword = false;
      this.forgotEmail = '';
    },
    handleSubmit() {
      if (this.isLogin) {
        console.log('Login:', { 
          email: this.formData.email, 
          password: this.formData.password 
        });
        this.$router.push('/formularioInicio');
      } else {
        if (this.formData.password !== this.formData.confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        console.log('Register:', this.formData);
        alert('Cuenta creada exitosamente');
        this.isLogin = true;
        this.formData = {
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        };
      }
    },
    handleForgotPassword() {
      if (this.forgotEmail) {
        console.log(`Simulating password reset email sent to: ${this.forgotEmail}`);
        alert(`Se ha enviado un enlace de restablecimiento a ${this.forgotEmail}`);
        this.closeForgotPasswordModal();
      } else {
        alert('Por favor, ingresa un correo electrónico válido.');
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #b6e4e2 0%, #4b9ca2 100%);
  min-height: 100vh;
}

.card {
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #7fffd4, #40e0d0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
}

.form-control {
  border-radius: 10px;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #7fffd4;
  box-shadow: 0 0 0 0.2rem rgba(127, 255, 212, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #7fffd4, #40e0d0);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #40e0d0, #48d1cc);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(127, 255, 212, 0.4);
}

.btn-secondary {
  border-radius: 10px;
}

.forgot-link {
  color: #36706b;
  font-weight: 500;
}

.forgot-link:hover {
  color: #7fffd4;
}

.toggle-link {
  color: #36706b;
  font-weight: 600;
}

.toggle-link:hover {
  color: #7fffd4;
}

.form-label {
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.logo-circle i {
  font-size: 3rem;
  color: white;
}

.forgot-link:hover {
  text-decoration: underline !important;
}

.toggle-link {
  font-weight: 600;
}

.toggle-link:hover {
  text-decoration: underline !important;
}
</style>