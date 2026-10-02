import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import PrivacyPage from './pages/PrivacyPage.jsx'

// Entry for /privacy/ (a separate static page; see privacy/index.html and the
// build inputs in vite.config.js).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivacyPage />
  </StrictMode>,
)
