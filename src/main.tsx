import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Infrastructure/UI/globalStyles/reset.css'
import './Infrastructure/UI/globalStyles/layout.css'
import './Infrastructure/UI/globalStyles/variables.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
