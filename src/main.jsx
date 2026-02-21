import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { firebaseSync } from './utils/storage'

const root = createRoot(document.getElementById('root'))

// Temporary debug overlay — will remove once sync is working
const debugEl = document.createElement('div')
debugEl.id = 'sync-debug'
debugEl.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#222;color:#0f0;font-family:monospace;font-size:12px;padding:8px;z-index:99999;max-height:40vh;overflow:auto;'
debugEl.textContent = '[sync] starting...'
document.body.appendChild(debugEl)

function debugLog(msg) {
  console.log(msg)
  debugEl.textContent += '\n' + msg
}

// Show loading
document.getElementById('root').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#F5F3F0;font-family:system-ui"><p style="color:#4AABB3;font-size:1.2rem;font-weight:600">Loading your progress...</p></div>'

debugLog('[sync] calling firebaseSync()...')

const syncWithTimeout = Promise.race([
  firebaseSync(debugLog),
  new Promise(resolve => setTimeout(() => { debugLog('[sync] TIMEOUT after 5s'); resolve('timeout') }, 5000))
])

function renderApp() {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

syncWithTimeout.then((source) => {
  debugLog('[main] sync result: ' + source)
  renderApp()
}).catch((err) => {
  debugLog('[main] sync FAILED: ' + (err?.message || err))
  renderApp()
})
