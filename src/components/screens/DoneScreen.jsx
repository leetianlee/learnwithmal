import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useSettings } from '../../context/SettingsContext'
import { playCelebrationSound } from '../../utils/soundEffects'
import Button from '../common/Button'
import MalcolmAvatar from '../visuals/MalcolmAvatar'

function getCongratulatoryMessage(percentage) {
  if (percentage === 100) {
    return { text: 'Perfect!', emoji: '🌟', color: 'text-[#FF6B6B]' }
  } else if (percentage >= 80) {
    return { text: 'Awesome!', emoji: '🎉', color: 'text-[var(--color-correct)]' }
  } else if (percentage >= 60) {
    return { text: 'Good work!', emoji: '👏', color: 'text-[var(--color-primary)]' }
  } else {
    return { text: 'Keep practicing!', emoji: '💪', color: 'text-[var(--color-text)]' }
  }
}

function ScoreRing({ percentage }) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const color = percentage >= 80 ? 'var(--color-correct)' : percentage >= 60 ? 'var(--color-primary)' : 'var(--color-incorrect)'

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128" className="absolute transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-[var(--color-bg)]"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-3xl font-extrabold" style={{ color }}>{percentage}%</div>
      </div>
    </div>
  )
}

export default function DoneScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getModuleProgress } = useProgress()
  const { settings } = useSettings()
  const [showReview, setShowReview] = useState(false)

  const { subject, moduleId, totalCorrect, total, moduleName, wrongAnswers = [] } = location.state || {}

  // Play celebration sound on mount
  useEffect(() => {
    if (settings.soundEffectsEnabled && subject) {
      setTimeout(() => playCelebrationSound(), 500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!subject || !moduleId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    )
  }

  const progress = getModuleProgress(subject, moduleId)
  const percentage = total > 0 ? Math.round((totalCorrect / total) * 100) : 0
  const congrats = getCongratulatoryMessage(percentage)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      {/* Avatar */}
      <div className="mb-4 animate-bounce-in">
        <MalcolmAvatar size={100} pose="happy" />
      </div>

      {/* Main heading */}
      <h1 className="text-3xl font-extrabold mb-1 text-center animate-scale-in">
        <span className="mr-2">{congrats.emoji}</span>
        <span className={congrats.color}>{congrats.text}</span>
      </h1>

      {/* Subheading */}
      <p className="text-base text-[var(--color-text-light)] mb-6 text-center font-semibold">
        You finished {moduleName} practice!
      </p>

      {/* Score Card */}
      <div className="w-full bg-white rounded-2xl shadow-card p-6 mb-6 text-center animate-slide-up">
        <div className="flex justify-center mb-4">
          <ScoreRing percentage={percentage} />
        </div>

        <p className="text-sm text-[var(--color-text-light)] mb-1 font-medium">Correct answers</p>
        <p className="text-2xl font-extrabold text-[var(--color-primary)] mb-4">
          {totalCorrect} out of {total}
        </p>

        {/* Star Rating */}
        <div className="flex justify-center gap-1.5 mb-4">
          {[1, 2, 3].map(i => (
            <span key={i} className={`text-2xl ${i <= progress.stars ? 'text-yellow-400' : 'text-[var(--color-disabled)] opacity-40'}`}>
              {i <= progress.stars ? '★' : '☆'}
            </span>
          ))}
        </div>

        {/* Level and Mastery */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-[var(--color-bg)]">
          <span className="bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold px-3 py-1 rounded-full">
            Level {progress.currentLevel}
          </span>
          <span className="bg-[var(--color-bg)] text-[var(--color-text-light)] text-xs font-bold px-3 py-1 rounded-full">
            {Math.round(progress.masteryScore * 100)}% mastery
          </span>
        </div>
      </div>

      {/* Encouragement */}
      <p className="text-sm text-[var(--color-text-light)] mb-6 text-center font-medium">
        {percentage === 100
          ? 'You got every question right! That is incredible!'
          : percentage >= 80
          ? 'You are doing great! Keep it up!'
          : percentage >= 60
          ? 'Good progress! Keep practicing to get even better!'
          : 'Every practice helps you improve! Try again soon!'}
      </p>

      {/* Review Mistakes */}
      {wrongAnswers.length > 0 && (
        <div className="w-full mb-6">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full text-center text-sm font-bold text-[var(--color-primary)] py-2 hover:underline"
          >
            {showReview ? 'Hide Mistakes' : `Review Mistakes (${wrongAnswers.length})`}
          </button>
          {showReview && (
            <div className="space-y-3 mt-3 animate-slide-up">
              {wrongAnswers.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-card p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-2">{item.questionText}</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-[var(--color-incorrect)] font-medium">
                      Your answer: <span className="font-bold">{item.selectedAnswer}</span>
                    </p>
                    <p className="text-xs text-[var(--color-correct)] font-medium">
                      Correct answer: <span className="font-bold">{item.correctAnswer}</span>
                    </p>
                    {item.explanation && (
                      <p className="text-xs text-[var(--color-text)] mt-1.5 bg-[var(--color-bg)] rounded-lg px-3 py-2 leading-relaxed">
                        💡 {item.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 w-full">
        <Button onClick={() => navigate(`/practice/${subject}/${moduleId}`)} className="w-full">
          Practice Again
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/modules/${subject}`)} className="w-full">
          Choose Another Module
        </Button>
        <button
          onClick={() => navigate('/')}
          className="w-full text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors font-semibold py-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
