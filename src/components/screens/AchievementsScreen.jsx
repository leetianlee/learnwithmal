import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { computeAchievements, CATEGORY_LABELS, CATEGORY_ORDER } from '../../data/achievements'

function AchievementCard({ achievement }) {
  const { icon, title, description, earned, date } = achievement

  if (!earned) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg)] opacity-60">
        <span className="text-2xl grayscale" aria-hidden="true">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[var(--color-disabled)]">{title}</div>
          <div className="text-xs text-[var(--color-disabled)] mt-0.5">{description}</div>
        </div>
        <span className="text-xs font-bold text-[var(--color-disabled)] flex-shrink-0">Locked</span>
      </div>
    )
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })
    : ''

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-card border-l-4 border-[var(--color-primary)] animate-scale-in">
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-[var(--color-text)]">{title}</div>
        <div className="text-xs text-[var(--color-text-light)] mt-0.5">{description}</div>
      </div>
      {formattedDate && (
        <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-full flex-shrink-0">
          {formattedDate}
        </span>
      )}
    </div>
  )
}

export default function AchievementsScreen() {
  const navigate = useNavigate()
  const { progress, sessions } = useProgress()
  const achievements = computeAchievements(progress, sessions)

  const earnedCount = achievements.filter(a => a.earned).length
  const totalCount = achievements.length

  // Group by category
  const grouped = {}
  for (const a of achievements) {
    if (!grouped[a.category]) grouped[a.category] = []
    grouped[a.category].push(a)
  }

  return (
    <div className="min-h-screen flex flex-col p-5 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-sm font-bold text-[var(--color-text-light)] hover:bg-[var(--color-bg)] active:scale-95 transition-all flex-shrink-0"
          aria-label="Back to home"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-[var(--color-text)]">My Achievements</h1>
        </div>
        <div className="bg-[var(--color-primary-light)] px-3 py-1.5 rounded-full flex-shrink-0">
          <span className="text-sm font-extrabold text-[var(--color-primary)]">
            {earnedCount} / {totalCount}
          </span>
        </div>
      </div>

      {/* Summary */}
      {earnedCount === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6 text-center">
          <span className="text-4xl mb-3 block">🏆</span>
          <p className="text-base font-bold text-[var(--color-text)] mb-1">Start earning achievements!</p>
          <p className="text-sm text-[var(--color-text-light)]">
            Practice your modules to unlock badges and milestones.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--color-primary-light)] rounded-2xl p-4 mb-6 text-center">
          <span className="text-3xl mb-1 block">🏆</span>
          <p className="text-base font-extrabold text-[var(--color-primary)]">
            {earnedCount} achievement{earnedCount !== 1 ? 's' : ''} earned!
          </p>
          <p className="text-xs text-[var(--color-primary)] opacity-70 mt-0.5">
            Keep going to unlock more
          </p>
        </div>
      )}

      {/* Categories */}
      {CATEGORY_ORDER.map(cat => {
        const items = grouped[cat]
        if (!items || items.length === 0) return null
        const earnedInCat = items.filter(a => a.earned).length

        return (
          <div key={cat} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-[var(--color-text)]">
                {CATEGORY_LABELS[cat]}
              </h2>
              <span className="text-xs font-bold text-[var(--color-text-light)]">
                {earnedInCat} / {items.length}
              </span>
            </div>
            <div className="space-y-2">
              {/* Show earned first, then locked */}
              {items
                .sort((a, b) => (b.earned ? 1 : 0) - (a.earned ? 1 : 0))
                .map(a => (
                  <AchievementCard key={a.id} achievement={a} />
                ))
              }
            </div>
          </div>
        )
      })}

      {/* Back button at bottom */}
      <div className="mt-auto pt-4 pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-full rounded-2xl bg-white shadow-card hover:shadow-card-hover active:scale-[0.98] transition-all p-3 text-center text-sm font-bold text-[var(--color-text-light)]"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
