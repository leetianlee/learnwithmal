import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { firebaseSync } from './utils/storage'

const root = createRoot(document.getElementById('root'))

// Show a loading message while syncing
document.getElementById('root').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#F5F3F0;font-family:system-ui"><p style="color:#4AABB3;font-size:1.2rem;font-weight:600">Loading your progress...</p></div>'

// Sync with Firebase FIRST, then render.
// On new devices this pulls cloud data into localStorage before React reads it.
const syncWithTimeout = Promise.race([
  firebaseSync(),
  new Promise(resolve => setTimeout(() => resolve('timeout'), 5000))
])

function renderApp() {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

syncWithTimeout.then((source) => {
  console.log('[main] sync result:', source)
  renderApp()
}).catch((err) => {
  console.warn('[main] sync failed, rendering with localStorage:', err)
  renderApp()
})
