import { useCallback } from 'react'
import { useSettings } from '../context/SettingsContext'
import { TTS } from '../data/constants'

/** Clean text for TTS — replace symbols that sound bad when spoken */
function cleanForSpeech(text) {
  return text
    .replace(/_{2,}/g, 'blank')       // ___ → "blank"
    .replace(/\s*—\s*/g, ', ')         // em dash → pause
    .replace(/['']/g, "'")             // curly quotes → straight
    .replace(/[""]/g, '"')             // curly double quotes
    .replace(/\.\s*\./g, '.')          // double periods
}

export function useSpeech() {
  const { settings } = useSettings()

  const speak = useCallback((text) => {
    if (!settings.audioEnabled || !window.speechSynthesis) return

    window.speechSynthesis.cancel()
    const cleaned = cleanForSpeech(text)
    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.rate = TTS.RATE
    utterance.lang = TTS.LANG
    window.speechSynthesis.speak(utterance)
  }, [settings.audioEnabled])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  return { speak, stop, isSupported: typeof window !== 'undefined' && !!window.speechSynthesis }
}
