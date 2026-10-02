import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/motion.css'
import App from './App.jsx'
import { primeMotionClass } from './motion/useMotion'

// Set the "hidden until animated" state before the first paint (no flash).
primeMotionClass()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Dev only: the scroll animations are wired once, to the elements present at
// startup. A hot update can swap those elements for new, still-hidden ones
// that nothing animates (e.g. text stuck invisible after editing copy), so
// reload the page after every update instead. No effect on the built site.
if (import.meta.hot) {
  import.meta.hot.on('vite:afterUpdate', () => window.location.reload())
}
