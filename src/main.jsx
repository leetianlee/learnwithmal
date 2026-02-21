import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { firebaseSync } from './utils/storage'

const root = createRoot(document.getElementById('root'))

// Render immediately (using localStorage data)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Then sync with Firebase in background — if cloud has newer data, re-render
firebaseSync().then((source) => {
  if (source === 'cloud') {
    // Cloud had newer data that's now in localStorage — re-render to pick it up
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }
})
