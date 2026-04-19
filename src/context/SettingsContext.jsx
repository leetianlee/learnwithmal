import { createContext, useContext, useState, useEffect } from 'react'
import { loadData, saveData } from '../utils/storage'
import { DEFAULT_SETTINGS } from '../data/constants'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    return loadData('settings') || DEFAULT_SETTINGS
  })

  useEffect(() => {
    saveData('settings', settings)
  }, [settings])

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
