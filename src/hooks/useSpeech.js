import { useCallback } from 'react'
import { useSettings } from '../context/SettingsContext'
import { TTS } from '../data/constants'

export function useSpeech() {
  const { settings } = useSettings()
  
  const speak = useCallback((text) => {
    if (!settings.audioEnabled || !window.speechSynthesis) return
    
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = TTS.RATE
    utterance.lang = TTS.LANG
    window.speechSynthesis.speak(utterance)
  }, [settings.audioEnabled])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop, isSupported: typeof window !== 'undefined' && !!window.speechSynthesis }
}
