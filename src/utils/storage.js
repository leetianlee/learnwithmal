import { db } from '../firebase'
import { ref, set, get } from 'firebase/database'

const STORAGE_KEY = 'learnwithmal'
const FIREBASE_USER = 'malcolm' // single-family app, one user

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

// ── Firebase (cross-device sync) ──
// Firebase stores data as JSON but converts arrays to objects with numeric keys.
// We store as a JSON string to preserve arrays exactly.

function firebasePath(key) {
  return `users/${FIREBASE_USER}/${key}`
}

function firebaseSave(key, value) {
  try {
    // Store as JSON string to avoid Firebase array-to-object conversion
    set(ref(db, firebasePath(key)), JSON.stringify(value)).catch(() => {
      // Silently fail — offline is fine, localStorage still works
    })
  } catch {
    // Firebase not configured yet — ignore
  }
}

async function firebaseLoad(key) {
  try {
    const snapshot = await get(ref(db, firebasePath(key)))
    if (!snapshot.exists()) return null
    const val = snapshot.val()
    // Data is stored as JSON string — parse it back
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return val }
    }
    // Legacy: if data was stored as object (before this fix), return as-is
    return val
  } catch {
    return null
  }
}

// ── Public API (same interface as before) ──

/**
 * Load data: returns localStorage immediately.
 * On first app load, firebaseSync() pulls cloud data into localStorage.
 */
export const loadData = (key) => {
  return localLoad(key)
}

/**
 * Save data: writes to both localStorage and Firebase.
 */
export const saveData = (key, value) => {
  localSave(key, value)
  firebaseSave(key, value)
}

export const clearData = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${key}`)
  } catch {
    // ignore
  }
  firebaseSave(key, null)
}

/**
 * One-time sync on app startup.
 * If Firebase has data but localStorage doesn't (new device),
 * pull everything from Firebase into localStorage.
 * If both have data, keep whichever has more progress (more totalSessions).
 */
export async function firebaseSync() {
  const keys = ['progress', 'sessions', 'settings', 'wrongAnswers', 'hintUsages']

  try {
    const cloudSessions = await firebaseLoad('sessions')
    const localSessions = localLoad('sessions')

    const cloudTotal = cloudSessions?.totalSessions || 0
    const localTotal = localSessions?.totalSessions || 0

    console.log('[sync] cloud sessions:', cloudTotal, 'local sessions:', localTotal)

    if (cloudTotal > localTotal) {
      // Cloud has more progress → pull everything to local
      console.log('[sync] pulling from cloud')
      for (const key of keys) {
        const cloudVal = await firebaseLoad(key)
        if (cloudVal != null) {
          localSave(key, cloudVal)
        }
      }
      return 'cloud'
    } else if (localTotal > 0) {
      // Local has more (or equal) progress → push to cloud
      console.log('[sync] pushing to cloud')
      for (const key of keys) {
        const localVal = localLoad(key)
        if (localVal != null) {
          firebaseSave(key, localVal)
        }
      }
      return 'local'
    } else if (cloudTotal > 0) {
      // Edge case: both are 0 locally but cloud has data
      console.log('[sync] pulling from cloud (fresh device)')
      for (const key of keys) {
        const cloudVal = await firebaseLoad(key)
        if (cloudVal != null) {
          localSave(key, cloudVal)
        }
      }
      return 'cloud'
    }
  } catch (e) {
    console.warn('[sync] Firebase sync failed:', e)
  }
  return 'none'
}
