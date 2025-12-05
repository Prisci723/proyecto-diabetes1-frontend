<template>

    <div>
    <Header @toggle-menu="handleToggleMenu" />
        <div class="container text-center espacio-header">
            <!-- Título -->
            <div class="welcome-banner text-center mb-4">
                <h2>Glucosa Actual</h2>
            </div>

            <!-- Gráfico -->
             <div class=""> Esta es una aplicación para ayudar a pacientes con diabetes tipo 1 con el seguimiento de la enfermedad
            
             </div>

            <!-- Botones -->
            <div class="d-flex justify-content-center flex-wrap gap-3 mt-4">
                <div
                    v-for="(item, index) in funciones"
                    :key="index"
                    class="card p-2 shadow-sm"
                    style="width: 180px; border: 2px solid var(--bs-teal); border-radius: 10px;"
                    @click="router.push(item.route)"
                >
                    <img :src="item.icon" alt="" width="80" class="mx-auto mt-2" />
                    <p class="mt-2 mb-0 small fw-semibold">{{ item.titulo }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import Header from '@/common/Header.vue';

const router = useRouter();
const sidebarRef = ref(null);

// Methods
const handleToggleMenu = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggle()
  }
}

const glucosaActual = ref((Math.random() * (180 - 70) + 70).toFixed(1));

const funciones = [
    { titulo: "Conteo de carbohidratos", icon: "/src/assets/comida.png", route : "/food-registration" },
    { titulo: "Optimización dosis de insulina", icon: "/src/assets/insulina.png", route : "/insuline-bolus" },
    { titulo: "Predicción de glucosa", icon: "/src/assets/glucose.png", route : "/glucose-prediction" },
    { titulo: "Patrones glucémicos", icon: "/src/assets/analisis_patrones.png", route : "/glucose-pattern" },
    { titulo: "CHATBOT", icon: "/src/assets/chatbot.png", route : "/chatbot" },
];
</script>

<style scoped>
.container {
    max-width: 1000px;
}
.espacio-header {
    margin-top: 80px;  
}

.card{
    height: 180px;
}
.card img {
    transition: transform 0.2s;
}
.card:hover img {
    transform: scale(1.1);
}
.welcome-banner {
  background-color: #00A79D;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}
</style>