import { db } from '../firebase'
import { ref, set, get } from 'firebase/database'

const STORAGE_KEY = 'learnwithmal'
const FIREBASE_USER = 'malcolm'

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
 * Accepts optional debug logger for on-screen diagnostics.
 */
export async function firebaseSync(log = () => {}) {
  const keys = ['progress', 'sessions', 'settings', 'wrongAnswers', 'hintUsages']

  try {
    log('[sync] reading cloud sessions...')
    const cloudSessions = await firebaseLoad('sessions')
    const localSessions = localLoad('sessions')

    const cloudTotal = cloudSessions?.totalSessions || 0
    const localTotal = localSessions?.totalSessions || 0

    log('[sync] cloud=' + cloudTotal + ' local=' + localTotal)

    if (cloudTotal > localTotal) {
      log('[sync] cloud wins — pulling all keys...')
      for (const key of keys) {
        const cloudVal = await firebaseLoad(key)
        if (cloudVal != null) {
          localSave(key, cloudVal)
          log('[sync] pulled: ' + key)
        }
      }
      return 'cloud'
    } else if (localTotal > 0) {
      log('[sync] local wins — pushing to cloud...')
      for (const key of keys) {
        const localVal = localLoad(key)
        if (localVal != null) {
          firebaseSave(key, localVal)
        }
      }
      return 'local'
    } else if (cloudTotal > 0) {
      log('[sync] fresh device + cloud has data — pulling...')
      for (const key of keys) {
        const cloudVal = await firebaseLoad(key)
        if (cloudVal != null) {
          localSave(key, cloudVal)
          log('[sync] pulled: ' + key)
        }
      }
      return 'cloud'
    } else {
      log('[sync] both empty — nothing to sync')
    }
  } catch (e) {
    log('[sync] ERROR: ' + (e?.message || e))
  }
  return 'none'
}
