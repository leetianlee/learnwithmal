/**
 * Sound effects using Web Audio API — no audio files needed.
 * Gentle tones suitable for ASD learners.
 */

let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // Resume if suspended (browsers require user gesture)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playTone(frequency, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // Gentle fade in and out to avoid clicks
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch (e) {
    // Silently fail — sound effects are non-critical
  }
}

/** Gentle rising chime for correct answers */
export function playCorrectSound() {
  playTone(523, 0.15, 'sine', 0.12)  // C5
  setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 100)  // E5
  setTimeout(() => playTone(784, 0.25, 'sine', 0.10), 200)  // G5
}

/** Soft low tone for incorrect answers */
export function playIncorrectSound() {
  playTone(330, 0.3, 'sine', 0.10)  // E4
  setTimeout(() => playTone(294, 0.35, 'sine', 0.08), 150)  // D4
}

/** Celebration melody for session complete */
export function playCelebrationSound() {
  playTone(523, 0.12, 'sine', 0.10)  // C5
  setTimeout(() => playTone(587, 0.12, 'sine', 0.10), 120)  // D5
  setTimeout(() => playTone(659, 0.12, 'sine', 0.10), 240)  // E5
  setTimeout(() => playTone(784, 0.30, 'sine', 0.12), 360)  // G5
  setTimeout(() => playTone(1047, 0.40, 'sine', 0.10), 520) // C6
}
