<template>
  <div 
    class="card categoria-card h-100 shadow-sm"
    :class="{ 'disabled': disabled, 'selected': selected }"
    @click="handleClick"
  >
    <div class="card-body text-center">
      <div v-if="icon" class="categoria-icon mb-3">
        <i :class="`bi bi-${icon} display-4 text-primary`"></i>
      </div>
      <h5 class="card-title mb-0">{{ nombre }}</h5>
      <p v-if="descripcion" class="card-text text-muted small mt-2">
        {{ descripcion }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nombre: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  descripcion: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.categoria-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
}

.categoria-card:hover:not(.disabled) {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 167, 157, 0.3) !important;
  border-color: #00A79D;
}

.categoria-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.categoria-card.selected {
  border-color: #00A79D;
  background-color: rgba(0, 167, 157, 0.05);
}

.categoria-icon {
  transition: transform 0.3s ease;
}

.categoria-card:hover:not(.disabled) .categoria-icon {
  transform: scale(1.1);
}
</style>    