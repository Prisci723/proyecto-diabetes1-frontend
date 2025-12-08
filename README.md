# 🩺 Sistema de Gestión de Diabetes Tipo 1 - Frontend

Sistema web integral para la gestión y monitoreo de pacientes con diabetes tipo 1, desarrollado con Vue 3 y Vite. Proporciona herramientas para el seguimiento de glucosa, gestión de insulina, registro de alimentos y asistencia mediante IA.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Despliegue con Docker](#despliegue-con-docker)
- [Módulos Principales](#módulos-principales)
- [Contribución](#contribución)

## ✨ Características

- 🔐 **Autenticación de usuarios** - Sistema de login seguro
- 📊 **Análisis de patrones de glucosa** - Visualización y análisis de lecturas
- 💉 **Calculadora de bolos de insulina** - Cálculo automático de dosis
- 🔮 **Predicción de glucosa** - Predicción basada en patrones históricos
- 🍎 **Registro de alimentos** - Catálogo de alimentos con información nutricional
- 🤖 **Chatbot asistente** - Asistente virtual para consultas sobre diabetes
- 👤 **Gestión de datos del paciente** - Formularios de registro y actualización
- 📈 **Visualización de datos** - Gráficos interactivos con Chart.js

## 🛠 Tecnologías

- **Framework:** Vue 3.5.22
- **Build Tool:** Vite 7.1.7
- **Router:** Vue Router 4.6.3
- **State Management:** Pinia 3.0.3
- **UI Framework:** Bootstrap 5.3.8
- **Gráficos:** Chart.js 4.5.1
- **HTTP Client:** Axios 1.13.2
- **Markdown:** Marked 17.0.0
- **Estilos:** Sass 1.93.2

## 📦 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Docker (opcional, para despliegue con contenedores)

## 🚀 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Prisci723/proyecto-diabetes1-frontend.git
cd proyecto-diabetes1-frontend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
VITE_API_URL=http://localhost:3000
```

## 💻 Uso

### Modo Desarrollo

```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Compilar para Producción

```bash
npm run build
```

### Vista Previa de Producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
proyecto-diabetes1-frontend/
├── public/                  # Archivos estáticos
│   └── images/             # Imágenes públicas
├── src/
│   ├── assets/             # Recursos (imágenes, estilos)
│   ├── common/             # Componentes comunes
│   │   ├── Header.vue      # Encabezado de la aplicación
│   │   ├── Sidebar.vue     # Barra lateral de navegación
│   │   └── top-bar.vue     # Barra superior
│   ├── components/         # Componentes de la aplicación
│   │   ├── Login.vue       # Componente de autenticación
│   │   ├── FomularioInicio*.vue  # Formularios de registro
│   │   ├── PaginaInicio.vue      # Página principal
│   │   ├── PatientManagement.vue # Gestión de pacientes
│   │   ├── GlucoseAnalysis.vue   # Análisis de glucosa
│   │   └── ...
│   ├── composables/        # Funciones reutilizables
│   │   └── useAsistenteDiabetes.js
│   ├── router/             # Configuración de rutas
│   │   └── index.js
│   ├── services/           # Servicios API
│   │   └── api.js
│   ├── stores/             # Gestión de estado (Pinia)
│   │   └── formulario.js
│   ├── views/              # Vistas principales
│   │   ├── chatbot.vue     # Asistente virtual
│   │   ├── food-registration.vue
│   │   ├── glucose-pattern.vue
│   │   ├── glucose-prediction.vue
│   │   └── insuline-bolus.vue
│   ├── App.vue             # Componente raíz
│   ├── main.js             # Punto de entrada
│   └── style.css           # Estilos globales
├── Dockerfile              # Configuración Docker
├── nginx.conf              # Configuración Nginx
├── package.json            # Dependencias y scripts
└── vite.config.js          # Configuración de Vite
```

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Vista previa de la compilación de producción |

## 🐳 Despliegue con Docker

El proyecto incluye un `Dockerfile` para facilitar el despliegue:

```bash
# Construir la imagen
docker build -t diabetes-frontend .

# Ejecutar el contenedor
docker run -p 8080:80 diabetes-frontend
```

La aplicación estará disponible en `http://localhost:8080`

## 🔧 Módulos Principales

### 1. **Autenticación**
- Login de usuarios
- Gestión de sesiones

### 2. **Registro de Pacientes**
- Formularios multi-paso para registro inicial
- Gestión de datos personales y médicos

### 3. **Monitoreo de Glucosa**
- Registro de lecturas
- Análisis de patrones
- Predicción de niveles futuros
- Visualización con gráficos interactivos

### 4. **Gestión de Insulina**
- Calculadora de bolos de insulina
- Registro de dosis administradas

### 5. **Registro Nutricional**
- Catálogo de alimentos
- Información de carbohidratos
- Gestión de comidas

### 6. **Asistente Virtual**
- Chatbot con IA para consultas
- Recomendaciones personalizadas

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu función (`git checkout -b feature/NuevaFuncion`)
3. Realiza commit de tus cambios (`git commit -m 'Añadir nueva función'`)
4. Haz push a la rama (`git push origin feature/NuevaFuncion`)
5. Abre un Pull Request

## 👥 Autores

- Priscila - [Prisci723](https://github.com/Prisci723)

## 📄 Licencia

Este proyecto es privado y forma parte del proyecto de especialidad del curso SHC134.

## 📞 Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**Universidad:** Ingeniería en Ciencias de la Computación  
**Semestre:** 8vo Semestre  
**Curso:** SHC134 - Taller De Especialidad
