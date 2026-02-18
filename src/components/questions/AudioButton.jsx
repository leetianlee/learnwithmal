import { useState } from 'react'
import { useSpeech } from '../../hooks/useSpeech'

export default function AudioButton({ text, className = '', size = 'md' }) {
  const { speak, isSupported } = useSpeech()
  const [isPlaying, setIsPlaying] = useState(false)

  if (!isSupported) return null

  const handleClick = () => {
    setIsPlaying(true)
    speak(text)
    // Reset after typical TTS duration
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const sizes = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-lg',
    lg: 'w-14 h-14 text-2xl',
  }

  return (
    <button
      onClick={handleClick}
      className={`${sizes[size]} rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all ${isPlaying ? 'animate-pulse-gentle' : ''} ${className}`}
      aria-label="Listen to question"
    >
      {isPlaying ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  )
}
