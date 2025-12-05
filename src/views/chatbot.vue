<template>
      <Header @toggle-mobile-menu="toggleSidebar" />
  <div class="container-fluid chatbot-container">

    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 col-xl-8">
        <div class="card chat-card shadow-lg">

          <!-- Header -->
          <div class="card-header chat-header">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h4 class="mb-0">
                  <i class="bi bi-heart-pulse-fill me-2"></i>
                  Asistente de Diabetes
                </h4>
                <small class="text-white-50">Powered by IA</small>
              </div>
              <button
                @click="resetConversation"
                class="btn btn-outline-light btn-sm"
                title="Nueva conversación"
              >
                <i class="bi bi-arrow-clockwise"></i> Nueva Conversación
              </button>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="card-body messages-area" ref="messagesArea">
            <!-- Welcome Message -->
            <div v-if="messages.length === 0" class="welcome-section text-center">
              <div class="welcome-icon">
                <i class="bi bi-chat-heart"></i>
              </div>
              <h5 class="mt-3">¡Hola! Bienvenido</h5>
              <p class="text-muted">
                Soy tu asistente virtual especializado en diabetes.
                Puedo ayudarte con información sobre:
              </p>
              <div class="row mt-4">
                <div class="col-md-6 mb-3">
                  <div class="info-card">
                    <i class="bi bi-clipboard2-pulse"></i>
                    <p>Monitoreo de glucosa</p>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="info-card">
                    <i class="bi bi-egg-fried"></i>
                    <p>Alimentación saludable</p>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="info-card">
                    <i class="bi bi-activity"></i>
                    <p>Ejercicio físico</p>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="info-card">
                    <i class="bi bi-capsule"></i>
                    <p>Medicamentos y tratamiento</p>
                  </div>
                </div>
              </div>
              <div class="alert alert-warning mt-3" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Importante:</strong> No soy un médico. Siempre consulta con profesionales de salud.
              </div>
            </div>

            <!-- Messages -->
            <!-- Messages -->
            <div v-for="(msg, index) in messages" :key="index" class="message-wrapper">
              <div :class="['message', msg.role === 'user' ? 'user-message' : 'assistant-message']">
                <div class="message-avatar">
                  <i :class="msg.role === 'user' ? 'bi bi-person-fill' : 'bi bi-robot'"></i>
                </div>
                <div class="message-content">
                  <div class="message-bubble">
                    <!-- Aquí el cambio clave -->
                    <div 
                      class="mb-0 message-text" 
                      v-html="msg.role === 'assistant' ? parseMarkdown(msg.content) : msg.content"
                    ></div>
                  </div>
                  <small class="message-time text-muted">
                    {{ msg.timestamp }}
                  </small>
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="message-wrapper">
              <div class="message assistant-message">
                <div class="message-avatar">
                  <i class="bi bi-robot"></i>
                </div>
                <div class="message-content">
                  <div class="message-bubble">
                    <div class="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="card-footer chat-footer">
            <div class="input-group">
              <textarea
                v-model="userInput"
                @keydown.enter.exact.prevent="sendMessage"
                class="form-control"
                placeholder="Escribe tu pregunta aquí..."
                rows="1"
                :disabled="isTyping"
              ></textarea>
              <button
                @click="sendMessage"
                class="btn btn-primary"
                :disabled="!userInput.trim() || isTyping"
              >
                <i class="bi bi-send-fill"></i>
              </button>
            </div>

            <!-- Status -->
            <div class="status-bar mt-2">
              <small>
                <span :class="['badge', isConnected ? 'bg-success' : 'bg-danger']">
                  <i :class="isConnected ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                  {{ isConnected ? 'Conectado' : 'Desconectado' }}
                </span>
                <span v-if="pdfLoaded" class="badge bg-info ms-2">
                  <i class="bi bi-file-earmark-pdf-fill"></i> PDF Cargado
                </span>
              </small>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import Header from '@/common/Header.vue';
import Sidebar from '@/common/Sidebar.vue';

// === Refs reactivos ===
const messages = ref([]);
const userInput = ref('');
const isTyping = ref(false);
const conversationId = ref(null);
const isConnected = ref(false);
const pdfLoaded = ref(false);
const messagesArea = ref(null);
const sidebarRef = ref(null);

// URL de la API
const apiUrl = 'http://localhost:8000';

// Configurar axios para manejar errores globalmente
axios.defaults.timeout = 500000; // 100 segundos timeout

// === Configuración de Marked ===
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
});

// === Funciones ===
const toggleSidebar = () => {
  sidebarRef.value?.openMobileMenu();
};

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight;
  }
};

const checkHealth = async () => {
  try {
    const response = await axios.get(`${apiUrl}/health`);
    console.log('Respuesta de health:', response.data);
    isConnected.value = response.data.status === 'online';
    pdfLoaded.value = response.data.pdf_loaded || false;
    
    console.log('Estado del servidor:', response.data);
  } catch (error) {
    isConnected.value = false;
    pdfLoaded.value = false;
    console.error('Error al conectar con el servidor:', error.message);
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || !isConnected.value) return;

  const message = userInput.value.trim();
  userInput.value = '';

  // Agregar mensaje del usuario
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: getCurrentTime()
  });

  isTyping.value = true;
  scrollToBottom();

  try {
    const response = await axios.post(`${apiUrl}/chat`, {
      message,
      conversation_id: conversationId.value
    });

    console.log('Mensaje enviado:', message);

    // Guardar el ID de conversación
    conversationId.value = response.data.conversation_id;

    // Agregar respuesta del asistente
    messages.value.push({
      role: 'assistant',
      content: response.data.response,
      timestamp: getCurrentTime()
    });

    console.log('Respuesta recibida:', response.data);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    
    let errorMessage = 'Lo siento, ocurrió un error al procesar tu mensaje.';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'La solicitud tardó demasiado. Por favor intenta de nuevo.';
    } else if (error.response) {
      errorMessage = `Error del servidor: ${error.response.data.detail || error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica que esté corriendo en http://localhost:8000';
      isConnected.value = false;
    }

    messages.value.push({
      role: 'assistant',
      content: errorMessage,
      timestamp: getCurrentTime()
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const resetConversation = async () => {
  if (conversationId.value) {
    try {
      await axios.post(`${apiUrl}/reset/${conversationId.value}`);
      console.log('Conversación reiniciada');
    } catch (error) {
      console.error('Error al resetear conversación:', error);
    }
  }

  messages.value = [];
  conversationId.value = null;
  userInput.value = '';
};

const parseMarkdown = (text) => {
  if (!text) return '';
  try {
    return marked.parse(text);
  } catch (error) {
    console.error('Error al parsear markdown:', error);
    return text;
  }
};

// === Ciclo de vida ===
onMounted(async () => {
  await checkHealth();
  
  // Verificar conexión cada 30 segundos
  setInterval(checkHealth, 30000);
});
</script>

<style scoped>
/* Variables de color */
:root {
  --primary-color: #87e9e3;
  --primary-dark: #086f69;
  --primary-light: #01e3d4;
}

.chatbot-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #b6f1ed 0%, #7bddd6 100%);
  padding: 20px;
  margin-top: 60px;
}

.chat-card {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 20px;
  border: none;
}

.chat-header h4 {
  font-weight: 600;
}

.messages-area {
  height: 60vh;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

/* Welcome Section */
.welcome-section {
  padding: 40px 20px;
}

.welcome-icon {
  font-size: 64px;
  color: #87e9e3;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,167,157,0.2);
}

.info-card i {
  font-size: 32px;
  color: #87e9e3;
  margin-bottom: 10px;
}

.info-card p {
  margin: 0;
  font-weight: 500;
  color: #495057;
}

/* Messages */
.message-wrapper {
  margin-bottom: 20px;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  display: flex;
  gap: 12px;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: var(--primary-color);
  color: white;
}

.assistant-message .message-avatar {
  background: #6c757d;
  color: white;
}

.message-content {
  max-width: 70%;
}

.user-message .message-content {
  text-align: right;
}

.message-bubble {
  padding: 12px 18px;
  border-radius: 18px;
  display: inline-block;
  max-width: 100%;
  word-wrap: break-word;
}

.user-message .message-bubble {
  background: #379793;
  color: rgb(255, 255, 255);
  border-bottom-right-radius: 4px;
}

.assistant-message .message-bubble {
  background: white;
  color: #212529;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.message-time {
  display: block;
  margin-top: 4px;
  font-size: 11px;
}

.user-message .message-time {
  text-align: right;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #01e3d4;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Footer */
.chat-footer {
  background: white;
  padding: 20px;
  border-top: 1px solid #dee2e6;
}

.chat-footer textarea {
  resize: none;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
}

.chat-footer textarea:focus {
  border-color: #01e3d4;
  box-shadow: 0 0 0 0.2rem rgba(0, 167, 157, 0.25);
}

.chat-footer .btn-primary {
  background: #01e3d4;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  transition: all 0.3s;
}

.chat-footer .btn-primary:hover:not(:disabled) {
  background: #08beb2;
  transform: scale(1.05);
}

.chat-footer .btn-primary:disabled {
  background: #ccc;
}

.status-bar {
  font-size: 12px;
}

/* Scrollbar */
.messages-area::-webkit-scrollbar {
  width: 8px;
}

.messages-area::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #01e3d4;
  border-radius: 4px;
}

.messages-area::-webkit-scrollbar-thumb:hover {
  background: #01e3d4;
}

/* Responsive */
@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }
  
  .welcome-section {
    padding: 20px 10px;
  }
  
  .info-card {
    padding: 15px;
  }
}
.text-black{
    color: black;
}
</style>