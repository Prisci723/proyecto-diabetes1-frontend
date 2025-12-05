import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import FomularioInicio from '../components/FomularioInicio.vue'
import FomularioInicio2 from '../components/FomularioInicio2.vue'
import FomularioInicio3 from '../components/FomularioInicio3.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path : '/formularioInicio',
    name: 'FormularioInicio',
    component: FomularioInicio
  },
    {
    path : '/formularioInicio2',
    name: 'FormularioInicio2',
    component: FomularioInicio2
  },
  {
    path : '/formularioInicio3',
    name: 'FormularioInicio3',
    component: FomularioInicio3
  },
  {
    path : '/paginaInicio',
    name: 'PaginaInicio',
    component: () => import('../components/PaginaInicio.vue')
  },
  {
    path : '/chatbot',
    name: 'Chatbot',
    component: () => import('../views/chatbot.vue')
  },
  {
    path : '/glucose-pattern',
    name: 'GlucosPattern',
    component: () => import('../views/glucose-pattern.vue')
  },
  {
    path : '/insuline-bolus',
    name: 'InsulineBolus',
    component: () => import('../views/insuline-bolus.vue')
  },
  {
    path : '/glucose-prediction',
    name: 'GlucosePrediction',
    component: () => import('../views/glucose-prediction.vue')
  },
  {
    path : '/food-registration',
    name: 'FoodRegistration',
    component: () => import('../views/food-registration.vue')
  },
  {
    path : '/register-data',
    name: 'RegisterData',
    component: () => import('../components/PatientManagement.vue')
  },
  {
    path : '/header',
    name: 'Header',
    component: () => import('../common/Header.vue')
  }
//   {
//     path: '/home',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: Dashboard
//   },
//   {
//     path: '/profile',
//     name: 'Profile',
//     component: Profile
//   },
  // Ruta para páginas no encontradas
//   {
//     path: '/:pathMatch(.*)*',
//     name: 'NotFound',
//     component: () => import('../views/NotFound.vue')
//   }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router