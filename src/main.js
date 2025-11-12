import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(router)
const pinia = createPinia()

app.use(pinia)  // ← ¡ESTO ES CRUCIAL!
app.mount('#app')


