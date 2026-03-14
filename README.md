# THtracker 🚀

**THtracker** es una aplicación multiplataforma (PWA) diseñada para el registro eficiente de tareas, actividades diarias y seguimiento de productividad, integrando diversas utilidades adicionales en un solo lugar.

## ✨ Características Principales

- **Registro de Tareas:** Gestión completa del ciclo de vida de tus tareas diarias.
- **Log de Actividades:** Seguimiento detallado de lo que realizas a lo largo del día.
- **Utilidades Integradas:** Herramientas adicionales para mejorar tu flujo de trabajo.
- **Modo PWA:** Instalable en cualquier dispositivo y con soporte para funcionamiento offline.
- **Arquitectura Robusta:** Construido bajo los principios de _Clean Architecture_ y el patrón _Ploc (Presentation Logic Component)_.

## 🛠️ Stack Tecnológico

- **Frontend:** React + TypeScript + Vite.
- **Estado:** Patrón Ploc para una gestión de estado desacoplada de la UI.
- **Estilos:** CSS Moderno.
- **PWA:** Vite PWA Plugin para capacidades nativas.
- **Testing:** Vitest para asegurar la calidad de la lógica de negocio.

## 🏗️ Arquitectura

El proyecto sigue una estructura de **Clean Architecture** dividida en capas:

1.  **Domain:** Entidades e interfaces núcleo del negocio.
2.  **Application:** Casos de uso específicos de la aplicación.
3.  **Controllers (Plocs):** Lógica de presentación y gestión del estado de la UI.
4.  **Infrastructure:** Adaptadores para servicios externos (API, Storage) y la capa de UI (React).

## 🚀 Inicio Rápido

1.  Clona el repositorio.
2.  Copia el archivo `.example.env` a `.env` y configura tus variables.
3.  Instala las dependencias:
    ```bash
    npm install
    ```
4.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 🧪 Testing

Para ejecutar los tests unitarios:

```bash
npm test
```

---

Diseñado con ❤️ para la productividad.
