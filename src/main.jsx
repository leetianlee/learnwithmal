import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { firebaseSync } from './utils/storage'

const root = createRoot(document.getElementById('root'))

// Sync with Firebase FIRST, then render.
// On new devices this pulls cloud data into localStorage before React reads it.
// Timeout ensures we don't block forever if Firebase is slow/offline.
const syncWithTimeout = Promise.race([
  firebaseSync(),
  new Promise(resolve => setTimeout(() => resolve('timeout'), 3000))
])

syncWithTimeout.then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}).catch(() => {
  // Firebase failed — render anyway using localStorage
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
