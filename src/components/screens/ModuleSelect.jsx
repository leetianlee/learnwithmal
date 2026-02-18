import { useNavigate, useParams } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useSettings } from '../../context/SettingsContext'
import { MODULES } from '../../data/moduleMetadata'

function StarRating({ stars }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {[1, 2, 3].map(i => (
        <span key={i} className={`text-xl ${i <= stars ? 'text-yellow-400' : 'text-[var(--color-disabled)] opacity-40'}`}>
          {i <= stars ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-[var(--color-bg)] rounded-full h-1.5 overflow-hidden mt-2">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${percentage}%`,
          background: 'linear-gradient(90deg, var(--color-primary), #5DC4CC)'
        }}
      />
    </div>
  )
}

const MODULE_ACCENT_COLORS = {
  money: '#E8F6F7',
  time: '#F0E6F6',
  adding: '#E8F5EB',
  subtracting: '#FDF3E4',
  pronouns: '#E8F6F7',
  greetings: '#F0E6F6',
  askingForHelp: '#FDF3E4',
  readingComprehension: '#E8F5EB',
}

const SUBJECT_INFO = {
  math: { emoji: '🧮', label: 'Math' },
  english: { emoji: '📚', label: 'English' },
}

export default function ModuleSelect() {
  const { subject } = useParams()
  const navigate = useNavigate()
  const { getModuleProgress } = useProgress()
  const { settings } = useSettings()
  const modules = MODULES[subject] || []
  const subjectInfo = SUBJECT_INFO[subject] || { emoji: '📖', label: subject }

  // Find the suggested module: lowest mastery, then least recently practiced
  const suggestedId = settings.suggestedModuleEnabled ? (() => {
    let best = null
    let bestMastery = Infinity
    let bestTime = Infinity
    for (const mod of modules) {
      const p = getModuleProgress(subject, mod.id)
      const mastery = p.masteryScore || 0
      const lastTime = p.lastPracticed ? new Date(p.lastPracticed).getTime() : 0
      if (mastery < bestMastery || (mastery === bestMastery && lastTime < bestTime)) {
        best = mod.id
        bestMastery = mastery
        bestTime = lastTime
      }
    }
    return best
  })() : null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — full-width white bar */}
      <div className="bg-white shadow-card">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-[var(--color-bg)] hover:bg-[var(--color-bg-hover)] active:scale-95 transition-all flex items-center justify-center text-sm font-bold text-[var(--color-text-light)] flex-shrink-0"
            aria-label="Go back"
          >
            ←
          </button>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)]">
            <span className="mr-2">{subjectInfo.emoji}</span>
            {subjectInfo.label}
          </h1>
        </div>
      </div>

      {/* Module Grid */}
      <div className="max-w-2xl mx-auto w-full p-5">
        <div className="grid grid-cols-2 gap-4">
          {modules.map(mod => {
            const progress = getModuleProgress(subject, mod.id)
            const masteryPercentage = Math.round((progress.masteryScore || 0) * 100)
            const accentColor = MODULE_ACCENT_COLORS[mod.id] || '#E8F6F7'

            const isSuggested = mod.id === suggestedId

            return (
              <button
                key={mod.id}
                className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover active:scale-[0.97] transition-all p-4 flex flex-col items-center text-center min-h-[190px] justify-between relative ${isSuggested ? 'ring-2 ring-[var(--color-primary)]' : ''}`}
                onClick={() => navigate(`/practice/${subject}/${mod.id}`)}
              >
                {/* Suggested badge */}
                {isSuggested && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Suggested
                  </span>
                )}

                {/* Icon with colored background */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl mb-2"
                  style={{ background: accentColor }}
                >
                  {mod.icon}
                </div>

                {/* Module Name */}
                <h3 className="font-extrabold text-base text-[var(--color-text)] mb-2">{mod.name}</h3>

                {/* Star Rating */}
                <StarRating stars={progress.stars} />

                {/* Level */}
                <p className="text-xs text-[var(--color-text-light)] mt-2 font-semibold">
                  Level {progress.currentLevel} <span className="opacity-50">/ {mod.maxLevel}</span>
                </p>

                {/* Progress Bar */}
                <ProgressBar percentage={masteryPercentage} />

                {/* Mastery Percentage */}
                <p className="text-xs text-[var(--color-primary)] mt-1.5 font-bold">
                  {masteryPercentage}%
                </p>
              </button>
            )
          })}
        </div>

        {/* Help text */}
        {modules.length > 0 && (
          <div className="text-center mt-6 space-y-1">
            <p className="text-[var(--color-text-light)] text-xs font-medium">
              Tap a module to start practicing
            </p>
            <p className="text-[var(--color-text-light)] text-[11px] opacity-70">
              Levels go up when Malcolm gets answers right, and down if he needs more practice
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
