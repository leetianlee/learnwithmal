import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useSettings } from '../../context/SettingsContext'
import { getAllModules } from '../../data/moduleMetadata'
import MalcolmAvatar from '../visuals/MalcolmAvatar'

/**
 * Daily Plan Screen — auto-generates a balanced session of 3 modules.
 * Picks: 2 that need work (lowest mastery / least recently practiced)
 *        + 1 strong module (confidence boost).
 * Time is split equally across the modules based on session duration.
 */
export default function DailyPlanScreen() {
  const navigate = useNavigate()
  const { getModuleProgress, sessions } = useProgress()
  const { settings } = useSettings()
  const totalMinutes = settings.sessionMinutes || 30

  // Check which modules Malcolm has already completed today
  const today = new Date().toISOString().split('T')[0]
  const todayLog = sessions.log.filter(s => s.date === today)
  const todayDoneIds = new Set(todayLog.map(s => s.module))

  // Build a scored list of all modules
  const plan = useMemo(() => {
    const allMods = getAllModules()

    const scored = allMods.map(mod => {
      const p = getModuleProgress(mod.subject, mod.id)
      const mastery = p.masteryScore || 0
      const lastTime = p.lastPracticed ? new Date(p.lastPracticed).getTime() : 0
      return { ...mod, mastery, lastTime, progress: p }
    })

    // Sort by mastery ascending (weakest first), then by lastTime ascending (least recent first)
    const byNeed = [...scored].sort((a, b) => {
      if (a.mastery !== b.mastery) return a.mastery - b.mastery
      return a.lastTime - b.lastTime
    })

    // Sort by mastery descending (strongest first) for confidence pick
    const byStrength = [...scored].sort((a, b) => {
      if (b.mastery !== a.mastery) return b.mastery - a.mastery
      return b.lastTime - a.lastTime
    })

    // Pick 2 weakest + 1 strongest (avoiding duplicates)
    const picked = []
    const pickedIds = new Set()

    // 2 modules that need work
    for (const mod of byNeed) {
      if (picked.length >= 2) break
      if (!pickedIds.has(mod.id)) {
        picked.push({ ...mod, reason: 'needs-practice' })
        pickedIds.add(mod.id)
      }
    }

    // 1 strong module for confidence
    for (const mod of byStrength) {
      if (picked.length >= 3) break
      if (!pickedIds.has(mod.id)) {
        picked.push({ ...mod, reason: 'confidence' })
        pickedIds.add(mod.id)
      }
    }

    // If we still don't have 3 (e.g., only 2 modules total), fill from remaining
    if (picked.length < 3) {
      for (const mod of byNeed) {
        if (picked.length >= 3) break
        if (!pickedIds.has(mod.id)) {
          picked.push({ ...mod, reason: 'needs-practice' })
          pickedIds.add(mod.id)
        }
      }
    }

    // Allocate time: split evenly
    const perModule = Math.round(totalMinutes / Math.max(picked.length, 1))
    return picked.map(m => ({ ...m, minutes: perModule }))
  }, [getModuleProgress, totalMinutes])

  const allPlanDone = plan.length > 0 && plan.every(m => todayDoneIds.has(m.id))

  const REASON_LABELS = {
    'needs-practice': { text: 'Needs practice', color: 'var(--color-incorrect)', bg: 'var(--color-incorrect-light)' },
    'confidence': { text: 'Confidence boost', color: 'var(--color-correct)', bg: 'var(--color-correct-light)' },
  }

  const SUBJECT_COLORS = {
    math: '#E8F6F7',
    english: '#F0E6F6',
    life: '#FDE8D0',
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
            📋 Today's Plan
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full p-5 flex-1 flex flex-col">
        {/* Intro */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <MalcolmAvatar size={80} pose="happy" />
          </div>
          {allPlanDone ? (
            <>
              <h2 className="text-xl font-extrabold text-[var(--color-correct)] mb-1">All done for today!</h2>
              <p className="text-sm text-[var(--color-text-light)] font-medium">Great work, Malcolm. You finished your daily plan.</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-extrabold text-[var(--color-text)] mb-1">Here's your plan for today</h2>
              <p className="text-sm text-[var(--color-text-light)] font-medium">
                {plan.length} modules · about {totalMinutes} minutes total
              </p>
            </>
          )}
        </div>

        {/* Plan cards */}
        <div className="space-y-3 mb-6">
          {plan.map((mod, i) => {
            const isDone = todayDoneIds.has(mod.id)
            const reason = REASON_LABELS[mod.reason]
            const accentBg = SUBJECT_COLORS[mod.subject] || '#E8F6F7'

            return (
              <button
                key={mod.id}
                onClick={() => !isDone && navigate(`/practice/${mod.subject}/${mod.id}`)}
                disabled={isDone}
                className={`w-full rounded-2xl bg-white shadow-card p-4 flex items-center gap-4 transition-all ${
                  isDone
                    ? 'opacity-60'
                    : 'hover:shadow-card-hover active:scale-[0.98]'
                }`}
              >
                {/* Step number / check */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                  isDone
                    ? 'bg-[var(--color-correct)] text-white'
                    : 'bg-[var(--color-bg)] text-[var(--color-text-light)]'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>

                {/* Module icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: accentBg }}
                >
                  {mod.icon}
                </div>

                {/* Info */}
                <div className="text-left flex-1 min-w-0">
                  <div className={`text-base font-extrabold ${isDone ? 'line-through text-[var(--color-disabled)]' : 'text-[var(--color-text)]'}`}>
                    {mod.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-semibold text-[var(--color-text-light)]">
                      ~{mod.minutes} min
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color: reason.color, background: reason.bg }}
                    >
                      {reason.text}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-light)] opacity-60">
                      Level {mod.progress.currentLevel}
                    </span>
                  </div>
                </div>

                {/* Arrow or check */}
                <div className="flex-shrink-0 text-[var(--color-text-light)]">
                  {isDone ? '' : '→'}
                </div>
              </button>
            )
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto pb-4 space-y-3">
          {!allPlanDone && (
            <button
              onClick={() => {
                // Start the first incomplete module
                const next = plan.find(m => !todayDoneIds.has(m.id))
                if (next) navigate(`/practice/${next.subject}/${next.id}`)
              }}
              className="w-full bg-[var(--color-primary)] text-white font-extrabold text-lg py-4 rounded-2xl shadow-card hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all"
            >
              Start Next →
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors font-semibold py-2"
          >
            {allPlanDone ? '← Back to Home' : 'I\'ll choose myself →'}
          </button>
        </div>
      </div>
    </div>
  )
}
