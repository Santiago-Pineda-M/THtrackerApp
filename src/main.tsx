import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DependenciesProvider } from './Infrastructure/Context/DependenciesProvider.tsx'
import './Infrastructure/UI/globalStyles/reset.scss'
import './Infrastructure/UI/globalStyles/global.scss'
import App from './App.tsx'
import {
  dependenciesLocator,
  type Dependencies,
} from './Infrastructure/DI/DependenciesLocator'

// Declaración para extender el objeto window
declare global {
  interface Window {
    dependencies: Dependencies
  }
}

// Exponer las dependencias globalmente para pruebas en consola (solo desarrollo)
if (import.meta.env.DEV) {
  window.dependencies = dependenciesLocator
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DependenciesProvider>
      <App />
    </DependenciesProvider>
  </StrictMode>
)
