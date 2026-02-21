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

function firebasePath(key) {
  return `users/${FIREBASE_USER}/${key}`
}

function firebaseSave(key, value) {
  try {
    set(ref(db, firebasePath(key)), value).catch(() => {
      // Silently fail — offline is fine, localStorage still works
    })
  } catch {
    // Firebase not configured yet — ignore
  }
}

async function firebaseLoad(key) {
  try {
    const snapshot = await get(ref(db, firebasePath(key)))
    return snapshot.exists() ? snapshot.val() : null
  } catch {
    return null
  }
}

// ── Public API (same interface as before) ──

/**
 * Load data: returns localStorage immediately.
 * On first app load, firebaseSync() merges cloud data in.
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

    if (cloudTotal > localTotal) {
      // Cloud has more progress → pull everything to local
      for (const key of keys) {
        const cloudVal = await firebaseLoad(key)
        if (cloudVal != null) {
          localSave(key, cloudVal)
        }
      }
      return 'cloud' // signal that we loaded from cloud
    } else if (localTotal > 0) {
      // Local has more (or equal) progress → push to cloud
      for (const key of keys) {
        const localVal = localLoad(key)
        if (localVal != null) {
          firebaseSave(key, localVal)
        }
      }
      return 'local'
    }
  } catch {
    // Firebase not available — that's fine, localStorage still works
  }
  return 'none'
}
