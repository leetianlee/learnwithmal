import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useSettings } from '../../context/SettingsContext'
import { MODULES } from '../../data/moduleMetadata'
import Button from '../common/Button'
import Card from '../common/Card'
import Modal from '../common/Modal'

function PinEntry({ onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const { settings } = useSettings()

  const handleSubmit = () => {
    if (pin === settings.parentPin) {
      onSuccess()
    } else {
      setError(true)
      setPin('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Parent Dashboard</h1>
      <p className="text-[var(--color-disabled)] mb-6">Enter PIN to continue</p>
      <input
        type="password"
        value={pin}
        onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(false) }}
        maxLength={4}
        className="w-40 text-center text-3xl tracking-widest border-2 border-[var(--color-disabled)] rounded-xl py-3 mb-4 focus:border-[var(--color-primary)] focus:outline-none"
        placeholder="••••"
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        autoFocus
      />
      {error && <p className="text-[var(--color-incorrect)] mb-4">Incorrect PIN</p>}
      <Button onClick={handleSubmit}>Enter</Button>
    </div>
  )
}

function MiniProgressBar({ percentage, color = 'var(--color-primary)' }) {
  return (
    <div className="w-full bg-[var(--color-bg)] rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, background: color }}
      />
    </div>
  )
}

export default function ParentDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()
  const { progress, sessions, wrongAnswers, hintUsages, resetModule, resetAll } = useProgress()
  const [confirmReset, setConfirmReset] = useState(null)
  const [confirmResetAll, setConfirmResetAll] = useState(false)

  if (!authenticated) {
    return <PinEntry onSuccess={() => setAuthenticated(true)} />
  }

  const allModules = [
    ...MODULES.math.map(m => ({ ...m, subject: 'math' })),
    ...MODULES.english.map(m => ({ ...m, subject: 'english' })),
    ...(MODULES.life || []).map(m => ({ ...m, subject: 'life' })),
  ]

  // Calculate overall stats
  const totalAttempts = allModules.reduce((sum, m) => {
    const p = progress[m.subject]?.[m.id]
    return sum + (p?.totalAttempts || 0)
  }, 0)

  const totalCorrect = allModules.reduce((sum, m) => {
    const p = progress[m.subject]?.[m.id]
    return sum + (p?.totalCorrect || 0)
  }, 0)

  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  const getSubjectStats = (subject) => {
    const mods = allModules.filter(m => m.subject === subject)
    const attempts = mods.reduce((s, m) => s + (progress[m.subject]?.[m.id]?.totalAttempts || 0), 0)
    const correct = mods.reduce((s, m) => s + (progress[m.subject]?.[m.id]?.totalCorrect || 0), 0)
    return { attempts, correct, accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0 }
  }

  const mathStats = getSubjectStats('math')
  const englishStats = getSubjectStats('english')
  const lifeStats = getSubjectStats('life')

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
      </div>

      {/* Parent's Guide link */}
      <button
        onClick={() => navigate('/parent/guide')}
        className="w-full rounded-2xl bg-[var(--color-primary-light)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-primary)] font-bold text-sm py-3 px-4 mb-4 transition-all flex items-center justify-center gap-2"
      >
        📖 Parent's Guide — How to use this app
      </button>

      {/* Overview Stats */}
      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-4">Overview</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[var(--color-primary-light)] rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-[var(--color-primary)]">{sessions.totalSessions}</p>
            <p className="text-xs text-[var(--color-text-light)] font-semibold mt-1">Total Sessions</p>
          </div>
          <div className="bg-[var(--color-primary-light)] rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-[var(--color-primary)]">{sessions.streak}</p>
            <p className="text-xs text-[var(--color-text-light)] font-semibold mt-1">Day Streak</p>
          </div>
          <div className="bg-[var(--color-correct-light)] rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-[var(--color-correct)]">{overallAccuracy}%</p>
            <p className="text-xs text-[var(--color-text-light)] font-semibold mt-1">Overall Accuracy</p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-[var(--color-text)]">
              {sessions.log.length > 0 ? new Set(sessions.log.map(s => s.date)).size : 0}
            </p>
            <p className="text-xs text-[var(--color-text-light)] font-semibold mt-1">Days Active</p>
          </div>
        </div>

        {/* Subject accuracy breakdown */}
        <div className="space-y-3 pt-3 border-t border-[var(--color-bg)]">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">📐 Math</span>
              <span className="text-[var(--color-text-light)]">{mathStats.accuracy}% ({mathStats.correct}/{mathStats.attempts})</span>
            </div>
            <MiniProgressBar percentage={mathStats.accuracy} color="var(--color-primary)" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">📖 English</span>
              <span className="text-[var(--color-text-light)]">{englishStats.accuracy}% ({englishStats.correct}/{englishStats.attempts})</span>
            </div>
            <MiniProgressBar percentage={englishStats.accuracy} color="#9B59B6" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">🏨 Life Skills</span>
              <span className="text-[var(--color-text-light)]">{lifeStats.accuracy}% ({lifeStats.correct}/{lifeStats.attempts})</span>
            </div>
            <MiniProgressBar percentage={lifeStats.accuracy} color="#E8A838" />
          </div>
        </div>
      </Card>

      {/* Module Progress */}
      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-3">Module Progress</h2>
        <div className="space-y-3">
          {allModules.map(mod => {
            const p = progress[mod.subject]?.[mod.id]
            if (!p) return null
            const mastery = Math.round((p.masteryScore || 0) * 100)
            return (
              <div key={`${mod.subject}-${mod.id}`} className="bg-[var(--color-bg)] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{mod.icon}</span>
                    <span className="font-bold text-sm">{mod.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1,2,3].map(i => (
                        <span key={i} className={`text-xs ${i <= p.stars ? 'text-yellow-400' : 'text-[var(--color-disabled)]'}`}>
                          {i <= p.stars ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setConfirmReset({ subject: mod.subject, moduleId: mod.id, name: mod.name })}
                      className="text-xs text-[var(--color-disabled)] hover:text-[var(--color-incorrect)] ml-1 px-2 py-1 rounded-lg hover:bg-[var(--color-incorrect-light)] transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-light)]">
                  <span className="bg-white px-2 py-0.5 rounded-full font-semibold">Level {p.currentLevel}</span>
                  <span>{p.totalAttempts} attempts</span>
                  <span className="ml-auto font-bold text-[var(--color-primary)]">{mastery}%</span>
                </div>
                <div className="mt-2">
                  <MiniProgressBar percentage={mastery} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Needs Practice — most frequently missed questions */}
      {wrongAnswers.length > 0 && (
        <Card className="mb-4">
          <h2 className="font-bold text-lg mb-3">Needs Practice</h2>
          <p className="text-xs text-[var(--color-text-light)] mb-3">
            Questions Malcolm gets wrong most often (last 100 wrong answers)
          </p>
          <div className="space-y-2">
            {(() => {
              // Count how many times each question was missed
              const counts = {}
              for (const w of wrongAnswers) {
                const key = w.questionId
                if (!counts[key]) {
                  counts[key] = { ...w, count: 0 }
                }
                counts[key].count++
                counts[key].selectedAnswer = w.selectedAnswer // most recent wrong answer
                counts[key].timestamp = w.timestamp
              }
              // Sort by frequency, show top 8
              return Object.values(counts)
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map((item) => {
                  const mod = allModules.find(m => m.id === item.moduleId && m.subject === item.subject)
                  return (
                    <div key={item.questionId} className="bg-[var(--color-incorrect-light)] rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-[var(--color-text)] leading-snug flex-1">
                          {item.questionText}
                        </p>
                        <span className="bg-[var(--color-incorrect)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {item.count}x wrong
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-light)]">
                        <span>{mod?.icon} {mod?.name || item.moduleId}</span>
                        <span className="ml-auto">
                          Answer: <strong className="text-[var(--color-correct)]">{item.correctAnswer}</strong>
                        </span>
                      </div>
                    </div>
                  )
                })
            })()}
          </div>
        </Card>
      )}

      {/* Waited for Hints — questions where Malcolm needed the hint */}
      {hintUsages.length > 0 && (
        <Card className="mb-4">
          <h2 className="font-bold text-lg mb-3">Waited for Hints</h2>
          <p className="text-xs text-[var(--color-text-light)] mb-3">
            Questions where Malcolm waited for the hint before answering (last 100)
          </p>
          <div className="space-y-2">
            {(() => {
              // Count how many times each question needed a hint
              const counts = {}
              for (const h of hintUsages) {
                const key = h.questionId
                if (!counts[key]) {
                  counts[key] = { ...h, count: 0, correctCount: 0 }
                }
                counts[key].count++
                if (h.answeredCorrect) counts[key].correctCount++
                counts[key].timestamp = h.timestamp
              }
              // Sort by frequency, show top 8
              return Object.values(counts)
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map((item) => {
                  const mod = allModules.find(m => m.id === item.moduleId && m.subject === item.subject)
                  const gotItRight = item.correctCount > 0
                  return (
                    <div key={item.questionId} className={`rounded-xl p-3 ${gotItRight ? 'bg-[var(--color-primary-light)]' : 'bg-[var(--color-incorrect-light)]'}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-[var(--color-text)] leading-snug flex-1">
                          {item.questionText}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          gotItRight
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-incorrect)] text-white'
                        }`}>
                          {item.count}x hint
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-light)]">
                        <span>{mod?.icon} {mod?.name || item.moduleId}</span>
                        <span className="ml-auto">
                          {gotItRight
                            ? <span className="text-[var(--color-correct)] font-semibold">Got it right {item.correctCount}/{item.count}</span>
                            : <span className="text-[var(--color-incorrect)] font-semibold">Still struggling</span>
                          }
                        </span>
                      </div>
                    </div>
                  )
                })
            })()}
          </div>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-3">Recent Sessions</h2>
        {sessions.log.length === 0 ? (
          <p className="text-[var(--color-disabled)] text-sm">No sessions yet</p>
        ) : (
          <div className="space-y-2">
            {sessions.log.slice(-10).reverse().map((s, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-[var(--color-bg)] last:border-0">
                <span className="text-[var(--color-text-light)]">{s.date}</span>
                <span className="capitalize font-semibold">{s.subject} — {s.module}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Reset All */}
      <Card className="mb-6">
        <button
          onClick={() => setConfirmResetAll(true)}
          className="w-full py-3 rounded-xl font-semibold text-[var(--color-incorrect)] bg-[var(--color-incorrect-light)] hover:bg-[var(--color-incorrect)] hover:text-white transition-colors"
        >
          Reset All Progress
        </button>
      </Card>

      {/* Module Reset Modal */}
      <Modal isOpen={!!confirmReset} onClose={() => setConfirmReset(null)} title="Reset Module?">
        <p className="mb-4">
          This will reset all progress for <strong>{confirmReset?.name}</strong>. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setConfirmReset(null)} className="flex-1">Cancel</Button>
          <button
            onClick={() => { resetModule(confirmReset.subject, confirmReset.moduleId); setConfirmReset(null) }}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[var(--color-incorrect)] hover:opacity-90 transition-opacity"
          >
            Reset
          </button>
        </div>
      </Modal>

      {/* Reset All Modal */}
      <Modal isOpen={confirmResetAll} onClose={() => setConfirmResetAll(false)} title="Reset All Progress?">
        <p className="mb-4 text-[var(--color-text-light)]">
          This will erase <strong className="text-[var(--color-text)]">all</strong> of Malcolm's progress — levels, stars, mastery scores, and session history. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setConfirmResetAll(false)} className="flex-1">Cancel</Button>
          <button
            onClick={() => { resetAll(); setConfirmResetAll(false) }}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[var(--color-incorrect)] hover:opacity-90 transition-opacity"
          >
            Reset Everything
          </button>
        </div>
      </Modal>
    </div>
  )
}
