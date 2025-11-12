<template>
    <div>
        <NavbarComponent />
        <div class="container text-center mt-5">
            <!-- Título -->
            <div class="welcome-banner text-center mb-4">
                <h2>Glucosa Actual</h2>
            </div>

            <!-- Gráfico -->
            <canvas id="glucosaChart" height="60"></canvas>
            <p class="fw-bold mt-2">{{ glucosaActual }} mg/dL</p>

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
import NavbarComponent from '@/common/Header.vue';
import { onMounted, ref } from "vue";
import {
    Chart,
    BarController,  // ⬅️ Faltaba importar esto
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Title,
} from "chart.js";
import router from '../router';

// Registrar todos los componentes incluyendo BarController
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title);

const glucosaActual = ref((Math.random() * (180 - 70) + 70).toFixed(1));

const funciones = [
    { titulo: "Glucosa Actual", icon: "/src/assets/glucose.png", route : "/paginaInicio" },
    { titulo: "Reconocimiento de Alimentos", icon: "/src/assets/comida.png", route : "/paginaInicio" },
    { titulo: "Patrones glucémicos", icon: "/src/assets/analisis_patrones.png", route : "/paginaInicio" },
    { titulo: "Optimización dosis de insulina", icon: "/src/assets/insulina.png", route : "/paginaInicio" },
    { titulo: "CHATBOT", icon: "/src/assets/chatbot.png", route : "/chatbot" },
];

onMounted(() => {
    const ctx = document.getElementById("glucosaChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [""],
            datasets: [
                {
                    data: [glucosaActual.value],
                    backgroundColor: (ctx) => {
                        const value = ctx.raw;
                        if (value < 70) return "#ff0000";
                        if (value < 120) return "#00cc00";
                        if (value < 180) return "#ffcc00";
                        return "#ff6600";
                    },
                    borderRadius: 10,
                    barThickness: 80,
                },
            ],
        },
        options: {
            indexAxis: "y",
            scales: {
                x: { min: 0, max: 250, grid: { display: false } },
                y: { grid: { display: false } },
            },
            plugins: { legend: { display: false } },
        },
    });
});
</script>

<style scoped>
.container {
    max-width: 1000px;
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