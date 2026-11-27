import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

// ─────────────────────────────────────────────────────────────
// Point d'entrée de l'application React
//
// AuthProvider doit envelopper App pour que useAuth()
// soit accessible dans tous les composants de l'arbre.
//
// Ordre des wrappers (de l'extérieur vers l'intérieur) :
//   StrictMode   → détecte les problèmes en développement
//   AuthProvider → fournit l'état de connexion à toute l'app
//   App          → contient le routeur et les pages
// ─────────────────────────────────────────────────────────────
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
