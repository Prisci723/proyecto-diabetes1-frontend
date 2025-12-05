// src/services/api.js
import axios from 'axios';

// Configuración base de Axios
const apiClient = axios.create({
  baseURL: 'https://9b9v7hgp-8000.brs.devtunnels.ms',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar tokens de autenticación si es necesario
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo global de errores
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de respuesta:', error.response.status);
      
      switch (error.response.status) {
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error('Error:', error.response.data.detail || 'Error desconocido');
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const usersAPI = {
  register: (userData) => apiClient.post('/users/register', userData),
  login: (credentials) => apiClient.post('/users/login', credentials),
  updateFormularioInicio: (userId, completed) => 
    apiClient.patch(`/users/${userId}/formulario-inicio`, null, { params: { completed } }),
};

export const patientsAPI = {
  create: (patientData) => apiClient.post('/patients/', patientData),
  get: (patientId) => apiClient.get(`/patients/${patientId}`),
};

export const glucoseAPI = {
  addReading: (reading) => apiClient.post('/glucose/reading/', reading),
  addBulkReadings: (bulkData) => apiClient.post('/glucose/bulk/', bulkData),
};

export const analysisAPI = {
  getDailyMetrics: (patientId, date = null) => 
    apiClient.get(`/analysis/${patientId}/metrics/daily`, { params: { date } }),
  
  getPatientAnalysis: (patientId, days = 7) => 
    apiClient.get(`/analysis/${patientId}`, { params: { days } }),
  
  getPatientHistory: (patientId, days = 30) => 
    apiClient.get(`/analysis/${patientId}/history`, { params: { days } }),
  
  getClustersInfo: () => 
    apiClient.get('/analysis/clusters/info'),
};

export default apiClient;