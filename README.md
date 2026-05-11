<div align="center">

<img src="https://raw.githubusercontent.com/Santiago-Pineda-M/THtrackerApp/develop/public/favicon.svg" alt="THtracker Logo" width="80" height="80" onerror="this.style.display='none'"/>

# 🗂️ THtracker App

### Plataforma de Productividad & Finanzas — PWA / Web

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com)

[![Deploy Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://thtracker-develop.netlify.app/activities)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**[🚀 Ver Demo en Vivo](https://thtracker-develop.netlify.app/activities)** · **[📡 Backend API](https://github.com/Santiago-Pineda-M/THtracker-api)** · **[🐛 Reportar Bug](https://github.com/Santiago-Pineda-M/THtrackerApp/issues)**

</div>

---

## 📖 Sobre el Proyecto

**THtracker** es una aplicación web progresiva (PWA) full-featured para gestión de productividad personal y seguimiento financiero. Construida sobre principios de **Clean Architecture** y el patrón **Ploc (Presentation Logic Component)**, garantiza una codebase escalable, testeable y mantenible.

> 💡 Este proyecto es el frontend del ecosistema THtracker. Consume la [THtracker API](https://github.com/Santiago-Pineda-M/THtracker-api) construida en .NET con Clean Architecture.

---

## ✨ Características Principales

| Feature                       | Descripción                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| 📋 **Gestión de Tareas**      | Ciclo de vida completo de tareas diarias                       |
| 📊 **Log de Actividades**     | Seguimiento detallado de actividad por día                     |
| 💰 **Seguimiento Financiero** | Control de ingresos y gastos personales                        |
| 📱 **PWA / Offline**          | Instalable en cualquier dispositivo, funciona sin internet     |
| 🏗️ **Clean Architecture**     | Separación clara de capas: Domain, Application, Infrastructure |
| 🔄 **Patrón Ploc**            | Estado predecible y reactivo sin boilerplate                   |
| 🌙 **UI Responsiva**          | Diseño adaptable mobile-first                                  |

---

## 🛠️ Stack Tecnológico

```
Frontend
├── ⚡ Vite             — Build tool ultrarrápido
├── ⚛️  React 18         — UI components
├── 🔷 TypeScript       — Type safety
├── 🎨 Tailwind CSS     — Utility-first styling
├── 🔄 Ploc Pattern     — State management
└── 📦 PWA (Vite PWA)   — Progressive Web App

Calidad de Código
├── 🔍 ESLint           — Linting
├── 💅 Prettier         — Formateo automático
├── 🪝 Husky + lint-staged — Pre-commit hooks
├── 📝 Commitlint       — Conventional commits
└── 🧪 Vitest           — Unit testing
```

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue **Clean Architecture** adaptada al frontend, con **Atomic Design** para la UI y el patrón **Ploc** para el manejo de estado de presentación.

```
src/
│
├── Domain/                     # 🔵 Núcleo — sin dependencias externas
│   ├── Entities/               # Entidades del negocio
│   ├── Repositories/           # Contratos (interfaces) de repositorios
│   ├── Services/               # Contratos de servicios de dominio
│   ├── ValueObjects/           # Objetos de valor inmutables
│   ├── Events/                 # Eventos de dominio
│   ├── Errors/                 # Errores tipados del dominio
│   └── [Activity|Auth|Task...] # Módulos por entidad
│
├── Application/                # 🟡 Casos de uso y orquestación
│   ├── UseCases/               # Lógica de negocio por feature
│   │   └── [Activity|Task...]
│   └── Services/               # Servicios de aplicación
│       └── [Auth|User|Date...]
│
├── Controllers/                # 🟢 Ploc — Presentation Logic Components
│   └── [Activity|Auth|Task...] # Un Ploc por feature: estado + acciones
│
└── Infrastructure/             # 🟠 Implementaciones y detalles externos
    ├── Adapters/
    │   ├── http/               # Cliente HTTP (fetch/axios wrapper)
    │   └── storage/            # LocalStorage / SessionStorage
    ├── Repositories/           # Implementación de contratos del Domain
    ├── Context/                # React Context providers
    ├── DI/                     # Inyección de dependencias
    │   ├── core/               # Configuración base del contenedor
    │   └── modules/            # Módulos de DI por feature
    ├── Hooks/                  # Custom hooks de React
    ├── PWA/                    # Service Worker y configuración offline
    └── UI/                     # Interfaz — Atomic Design
        ├── components/
        │   ├── atoms/          # Button, Input, Icon, Badge, Spinner...
        │   ├── molecules/      # Form, Modal, DateTimePicker, StatCard...
        │   └── organisms/      # Sidebar, y ejemplos de componentes
        ├── layouts/            # AuthLayout, MainLayout
        ├── pages/              # Vistas completas por feature
        │   ├── activities/     # Calendario, Monitor, Recorder, Details
        │   ├── taskLists/      # Board, FilterBar, TaskList
        │   ├── auth/           # Login, Register
        │   ├── dashboard/
        │   └── userProfile/
        ├── globalStyles/       # Estilos globales / tokens CSS
        └── router/             # Rutas de la aplicación
```

### Flujo de datos

```
UI (pages/components)
    └──▶ Controllers (Ploc)      ← estado reactivo + acciones expuestas
              └──▶ Application (UseCases)
                        └──▶ Domain (Entities / Repositories contracts)
                                  └──▶ Infrastructure (Repositories impl. / Adapters HTTP)
```

> Las dependencias siempre apuntan **hacia adentro**. Los Ploc en `Controllers/` consumen casos de uso de `Application/` y exponen estado a la UI, manteniendo los componentes libres de lógica de negocio.

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js `>= 18.x`
- npm `>= 9.x` o pnpm

### Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/Santiago-Pineda-M/THtrackerApp.git
cd THtrackerApp

# 2. Instala dependencias
npm install

# 3. Configura variables de entorno
cp .example.env .env
# Edita .env con tus valores (ver sección de Variables de Entorno)

# 4. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Variables de Entorno

```env
# .env (basado en .example.env)
VITE_API_URL=http://localhost:5000   # URL de la THtracker API
VITE_APP_ENV=development
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm run test         # Ejecutar tests
npm run lint         # Lint del código
npm run format       # Formatear con Prettier
```

---

## 🧪 Tests

```bash
# Ejecutar todos los tests
npm run test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

---

## 📦 Deploy

El proyecto está configurado para deploy automático en **Netlify** via CI/CD:

```bash
# Build de producción
npm run build
# Genera la carpeta /dist lista para desplegar
```

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Santiago-Pineda-M/THtrackerApp)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee [CONTRIBUTING.md](CONTRIBUTING.md) para comenzar.

```bash
# Flujo recomendado
git checkout -b feat/nueva-funcionalidad
git commit -m "feat: agrega nueva funcionalidad"
git push origin feat/nueva-funcionalidad
# Abre un Pull Request
```

Este proyecto usa **Conventional Commits**. Ejemplos:

- `feat:` — nueva funcionalidad
- `fix:` — corrección de bug
- `docs:` — cambios en documentación
- `refactor:` — refactorización sin cambio funcional

---

## 📡 Ecosistema THtracker

| Repositorio                                                             | Descripción                             | Estado    |
| ----------------------------------------------------------------------- | --------------------------------------- | --------- |
| **THtrackerApp** (este repo)                                            | Frontend PWA — React + TypeScript       | ✅ Activo |
| **[THtracker-api](https://github.com/Santiago-Pineda-M/THtracker-api)** | Backend API — .NET + Clean Architecture | ✅ Activo |

---

## 👨‍💻 Autor

**Santiago Pineda** — Desarrollador Full Stack

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/jhonyer-santiago-pineda-marin-dev)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github)](https://github.com/Santiago-Pineda-M)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail)](mailto:santiago01morfe@gmail.com)

---

<div align="center">

_Si este proyecto te fue útil, considera darle una ⭐_

</div>
