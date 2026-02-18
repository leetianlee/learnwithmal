const STORAGE_KEY = 'learnwithmal'

export const loadData = (key) => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}_${key}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export const saveData = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
}

export const clearData = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${key}`)
  } catch {
    // ignore
  }
}
