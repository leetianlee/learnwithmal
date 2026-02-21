import { db } from '../firebase'
import { ref, set, get, onValue } from 'firebase/database'

const STORAGE_KEY = 'learnwithmal'
const FIREBASE_USER = 'malcolm'

// Flag to prevent write loops: when we receive a Firebase update,
// we save to localStorage but don't want that to re-trigger a Firebase write.
let _ignoreNextSave = false

// Callback to re-render the app when Firebase pushes new data
let _onCloudUpdate = null

export function setOnCloudUpdate(callback) {
  _onCloudUpdate = callback
}

// ── localStorage (instant, offline) ──

function localLoad(key) {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}_${key}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function localSave(key, value) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
}

// ── Firebase ──
// Store as JSON string to preserve arrays (Firebase converts arrays to objects)

function firebasePath(key) {
  return `users/${FIREBASE_USER}/${key}`
}

function firebaseSave(key, value) {
  try {
    set(ref(db, firebasePath(key)), JSON.stringify(value)).catch(() => {})
  } catch {
    // ignore
  }
}

async function firebaseLoad(key) {
  try {
    const snapshot = await get(ref(db, firebasePath(key)))
    if (!snapshot.exists()) return null
    const val = snapshot.val()
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return val }
    }
    return val
  } catch {
    return null
  }
}

// ── Public API ──

export const loadData = (key) => {
  return localLoad(key)
}

export const saveData = (key, value) => {
  localSave(key, value)
  if (!_ignoreNextSave) {
    firebaseSave(key, value)
  }
}

export const clearData = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${key}`)
  } catch {
    // ignore
  }
  if (!_ignoreNextSave) {
    firebaseSave(key, null)
  }
}

/**
 * One-time sync on app startup.
 * Pulls cloud data if it has more sessions, otherwise pushes local data.
 * Then starts a real-time listener for live updates from other devices.
 */
export async function firebaseSync() {
  const keys = ['progress', 'sessions', 'settings', 'wrongAnswers', 'hintUsages']

  try {
    const cloudSessions = await firebaseLoad('sessions')
    const localSessions = localLoad('sessions')

    const cloudTotal = cloudSessions?.totalSessions || 0
    const localTotal = localSessions?.totalSessions || 0

    if (cloudTotal > localTotal || (cloudTotal > 0 && localTotal === 0)) {
      // Cloud has more progress → pull everything to local
      for (const key of keys) {
        const cloudVal = await firebaseLoad(key)
        if (cloudVal != null) {
          localSave(key, cloudVal)
        }
      }
    } else if (localTotal > 0) {
      // Local has more (or equal) progress → push to cloud
      for (const key of keys) {
        const localVal = localLoad(key)
        if (localVal != null) {
          firebaseSave(key, localVal)
        }
      }
    }
  } catch {
    // Firebase not available — localStorage still works
  }

  // Start real-time listener for live cross-device sync
  startRealtimeSync(keys)

  return 'done'
}

/**
 * Real-time listener: when ANY device writes to Firebase,
 * all other open devices receive the update and apply it to localStorage.
 */
function startRealtimeSync(keys) {
  try {
    const userRef = ref(db, `users/${FIREBASE_USER}`)
    onValue(userRef, (snapshot) => {
      if (!snapshot.exists()) return
      const data = snapshot.val()

      // Apply each key from Firebase to localStorage
      _ignoreNextSave = true
      let changed = false
      for (const key of keys) {
        if (data[key] != null) {
          const val = typeof data[key] === 'string'
            ? (() => { try { return JSON.parse(data[key]) } catch { return data[key] } })()
            : data[key]

          // Only update if the cloud value is different from local
          const localVal = localLoad(key)
          if (JSON.stringify(val) !== JSON.stringify(localVal)) {
            localSave(key, val)
            changed = true
          }
        }
      }
      _ignoreNextSave = false

      // If data changed, trigger a re-render
      if (changed && _onCloudUpdate) {
        _onCloudUpdate()
      }
    }, { onlyOnce: false })
  } catch {
    // Firebase listener failed — that's fine, one-time sync already worked
  }
}
