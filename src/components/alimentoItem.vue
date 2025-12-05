<template>
  <div 
    class="card alimento-item mb-2"
    :class="{ 'selected': selected }"
  >
    <div class="card-body py-2">
      <div class="d-flex align-items-center">
        <div class="form-check me-3">
          <input 
            class="form-check-input" 
            type="checkbox" 
            :id="`alimento-${alimento.id}`"
            :checked="selected"
            @change="$emit('toggle')"
          >
        </div>
        
        <div class="flex-grow-1">
          <h6 class="mb-1">{{ alimento.alimento }}</h6>
          <div class="alimento-detalles">
            <span class="badge bg-light text-dark me-2">
              <i class="bi bi-rulers"></i> 
              {{ alimento.cantidad_sugerida || '-' }} {{ alimento.unidad || '' }}
            </span>
            <span class="badge bg-light text-dark me-2">
              <i class="bi bi-lightning"></i> 
              {{ alimento.energia_kcal || '-' }} kcal
            </span>
            <span class="badge bg-light text-dark">
              <i class="bi bi-egg"></i> 
              {{ alimento.proteina || '-' }}g proteína
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
</template>

<script setup>
defineProps({
  alimento: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
.alimento-item {
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  cursor: pointer;
}

.alimento-item:hover {
  border-left-color: #00A79D;
  background-color: rgba(0, 167, 157, 0.05);
}

.alimento-item.selected {
  background-color: rgba(0, 167, 157, 0.1);
  border-left-color: #00A79D;
}

.alimento-detalles .badge {
  font-weight: normal;
  font-size: 0.85rem;
}

.form-check-input:checked {
  background-color: #00A79D;
  border-color: #00A79D;
}

.form-check-input:focus {
  border-color: #00A79D;
  box-shadow: 0 0 0 0.25rem rgba(0, 167, 157, 0.25);
}
</style>