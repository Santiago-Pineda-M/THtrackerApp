import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DependenciesProvider } from './Infrastructure/Context/DependenciesProvider.tsx'
import './Infrastructure/UI/globalStyles/reset.css'
import './Infrastructure/UI/globalStyles/variables.css'
import './Infrastructure/UI/globalStyles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DependenciesProvider>
      <App />
    </DependenciesProvider>
  </StrictMode>,
)
