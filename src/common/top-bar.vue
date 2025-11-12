<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-teal shadow-sm py-2">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Botón menú -->
      <button class="btn btn-outline-light border-0 me-3" @click="toggleMenu">
        <i class="bi bi-list" style="font-size: 1.5rem;"></i>
      </button>

      <!-- Título -->
      <span class="navbar-brand mx-auto fw-semibold fs-5">
        Sistema de Registro Médico
      </span>

      <!-- Botón perfil -->
      <button class="btn btn-outline-light rounded-pill d-flex align-items-center gap-2">
        <i class="bi bi-person-circle"></i>
        <span>Mi perfil</span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "TopBar",
  methods: {
    toggleMenu() {
      alert("Menú lateral próximamente 😄");
    },
  },
};
</script>

<style scoped>
.bg-teal {
  background-color: #009688;
}
.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
</style>
