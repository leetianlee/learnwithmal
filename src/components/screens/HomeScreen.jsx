import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { getGreeting, calculateStreak } from '../../utils/dateUtils'
import { computeAchievements } from '../../data/achievements'
import { computeStickers } from '../../data/stickers'
import { MODULES } from '../../data/moduleMetadata'
import MalcolmAvatar from '../visuals/MalcolmAvatar'
import { Flame, Trophy, Gift, ClipboardList, Calculator, BookOpen, Building2, MessageSquare, Sparkles, CheckCircle, ArrowRight } from 'lucide-react'

/** Compute average level per subject and return a gentle encouragement message */
function getEncouragement(progress) {
  const subjectAvg = {}
  for (const [subject, modules] of Object.entries(MODULES)) {
    let totalLevel = 0
    for (const mod of modules) {
      const p = progress[subject]?.[mod.id]
      totalLevel += p ? p.currentLevel : 1
    }
    subjectAvg[subject] = totalLevel / modules.length
  }

  // Find strongest and weakest
  const entries = Object.entries(subjectAvg)
  entries.sort((a, b) => b[1] - a[1])
  const strongest = entries[0]
  const weakest = entries[entries.length - 1]

  // Don't show if everything is level 1 (brand new user)
  if (strongest[1] <= 1) return null

  // Don't show if gap is very small (balanced learner)
  const gap = strongest[1] - weakest[1]
  if (gap < 1.5) {
    return { icon: 'sparkles', text: 'You\'re doing great across all subjects!' }
  }

  const names = { math: 'Math', english: 'English', life: 'Life Skills' }
  const strongName = names[strongest[0]]
  const weakName = names[weakest[0]]

  // Warm, encouraging messages — never critical
  const messages = [
    `${strongName} is going really well! A little ${weakName} practice today would be awesome.`,
    `You're a ${strongName} star! How about some ${weakName} today too?`,
    `Great progress in ${strongName}! Try a bit of ${weakName} to keep everything growing.`,
  ]

  // Pick a consistent message per day (not random per render)
  const dayIndex = new Date().getDate() % messages.length
  return { icon: 'message', text: messages[dayIndex] }
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const { progress, sessions, todayCompleted } = useProgress()
  const greeting = getGreeting()
  const streak = calculateStreak(sessions.log)
  const mathDone = todayCompleted('math')
  const englishDone = todayCompleted('english')
  const lifeDone = todayCompleted('life')
  const allDone = mathDone && englishDone && lifeDone
  const earnedCount = computeAchievements(progress, sessions).filter(a => a.earned).length
  const stickerCount = computeStickers(progress, sessions).filter(s => s.earned).length
  const encouragement = getEncouragement(progress)

  return (
    <div className="min-h-screen flex flex-col p-5 max-w-2xl mx-auto w-full">
      {/* Header with Avatar */}
      <div className="text-center mb-8 pt-4">
        <div className="flex justify-center mb-5">
          <MalcolmAvatar size={110} pose="happy" />
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--color-text)]">{greeting}, Malcolm!</h1>
        <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          {streak > 0 && (
            <div className="inline-flex items-center gap-2 bg-[var(--color-incorrect-light)] px-4 py-1.5 rounded-full">
              <Flame size={18} className="text-[var(--color-incorrect)]" />
              <span className="text-sm font-bold text-[var(--color-incorrect)]">
                {streak} day{streak !== 1 ? 's' : ''} in a row!
              </span>
            </div>
          )}
          <button
            onClick={() => navigate('/achievements')}
            className="inline-flex items-center gap-1.5 bg-[var(--color-primary-light)] px-4 py-1.5 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all active:scale-95 group"
          >
            <Trophy size={18} className="text-[var(--color-primary)] group-hover:text-white" />
            <span className="text-sm font-bold text-[var(--color-primary)] group-hover:text-white">
              {earnedCount}
            </span>
          </button>
          <button
            onClick={() => navigate('/stickers')}
            className="inline-flex items-center gap-1.5 bg-[var(--color-incorrect-light)] px-4 py-1.5 rounded-full hover:bg-[var(--color-incorrect)] hover:text-white transition-all active:scale-95 group"
          >
            <Gift size={18} className="text-[var(--color-incorrect)] group-hover:text-white" />
            <span className="text-sm font-bold text-[var(--color-incorrect)] group-hover:text-white">
              {stickerCount}
            </span>
          </button>
        </div>
      </div>

      {/* Daily Checklist */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
        <h2 className="text-lg font-extrabold mb-4 text-[var(--color-text)]">Today's Practice</h2>
        <div className="space-y-3">
          {/* Math Checklist Item */}
          <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
            mathDone ? 'bg-[var(--color-correct-light)]' : 'bg-[var(--color-bg)]'
          }`}>
            <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
              mathDone
                ? 'bg-[var(--color-correct)] text-white'
                : 'bg-white text-[var(--color-disabled)] border-2 border-[var(--color-disabled)]'
            }`}>
              {mathDone ? '✓' : '1'}
            </span>
            <span className={`text-base font-bold transition-all flex-1 ${
              mathDone ? 'line-through text-[var(--color-disabled)]' : 'text-[var(--color-text)]'
            }`}>
              Math Practice
            </span>
            {mathDone && <span className="text-xs font-bold text-[var(--color-correct)] bg-white px-2 py-0.5 rounded-full">Done</span>}
          </div>

          {/* English Checklist Item */}
          <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
            englishDone ? 'bg-[var(--color-correct-light)]' : 'bg-[var(--color-bg)]'
          }`}>
            <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
              englishDone
                ? 'bg-[var(--color-correct)] text-white'
                : 'bg-white text-[var(--color-disabled)] border-2 border-[var(--color-disabled)]'
            }`}>
              {englishDone ? '✓' : '2'}
            </span>
            <span className={`text-base font-bold transition-all flex-1 ${
              englishDone ? 'line-through text-[var(--color-disabled)]' : 'text-[var(--color-text)]'
            }`}>
              English Practice
            </span>
            {englishDone && <span className="text-xs font-bold text-[var(--color-correct)] bg-white px-2 py-0.5 rounded-full">Done</span>}
          </div>

          {/* Life Skills Checklist Item */}
          <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
            lifeDone ? 'bg-[var(--color-correct-light)]' : 'bg-[var(--color-bg)]'
          }`}>
            <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
              lifeDone
                ? 'bg-[var(--color-correct)] text-white'
                : 'bg-white text-[var(--color-disabled)] border-2 border-[var(--color-disabled)]'
            }`}>
              {lifeDone ? '✓' : '3'}
            </span>
            <span className={`text-base font-bold transition-all flex-1 ${
              lifeDone ? 'line-through text-[var(--color-disabled)]' : 'text-[var(--color-text)]'
            }`}>
              Life Skills Practice
            </span>
            {lifeDone && <span className="text-xs font-bold text-[var(--color-correct)] bg-white px-2 py-0.5 rounded-full">Done</span>}
          </div>
        </div>

        {/* All Done message */}
        {allDone && (
          <div className="mt-4 p-3 bg-[var(--color-correct-light)] rounded-xl text-center animate-bounce-in">
            <p className="text-[var(--color-correct)] font-extrabold text-sm">
              Amazing work today! Keep it up!
            </p>
          </div>
        )}
      </div>

      {/* Gentle Encouragement */}
      {encouragement && !allDone && (
        <div className="bg-white rounded-2xl shadow-card p-4 mb-4 flex items-start gap-3 animate-fade-in">
          <span className="flex-shrink-0 mt-0.5">
            {encouragement.icon === 'sparkles'
              ? <Sparkles size={20} className="text-[var(--color-primary)]" />
              : <MessageSquare size={20} className="text-[var(--color-primary)]" />
            }
          </span>
          <p className="text-sm font-semibold text-[var(--color-text-light)] leading-relaxed">
            {encouragement.text}
          </p>
        </div>
      )}

      {/* Daily Plan Button */}
      {!allDone && (
        <button
          onClick={() => navigate('/daily-plan')}
          className="w-full rounded-2xl bg-[var(--color-primary)] text-white shadow-card hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all p-4 mb-4 flex items-center justify-center gap-3"
        >
          <ClipboardList size={24} className="flex-shrink-0" />
          <div className="text-left">
            <div className="text-lg font-extrabold">Start Today's Plan</div>
            <div className="text-xs opacity-80 font-medium">A balanced session picked for you</div>
          </div>
          <ArrowRight size={20} className="ml-auto" />
        </button>
      )}

      {/* Subject Cards — Matholia-inspired clean grid */}
      <div className="space-y-3 mb-6">
        {/* Math Card */}
        <button
          onClick={() => navigate('/modules/math')}
          className="w-full rounded-2xl bg-white shadow-card hover:shadow-card-hover active:scale-[0.98] transition-all p-4 flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-xl bg-[#E8F6F7] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Calculator size={28} className="text-[var(--color-primary)]" />
          </div>
          <div className="text-left flex-1">
            <div className="text-lg font-extrabold text-[var(--color-text)]">Math</div>
            <div className="text-xs text-[var(--color-text-light)] mt-0.5 font-medium">Money, Time, Adding, Subtracting</div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            mathDone
              ? 'bg-[var(--color-correct)] text-white'
              : 'bg-[var(--color-bg)] text-[var(--color-text-light)]'
          }`}>
            {mathDone ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
          </div>
        </button>

        {/* English Card */}
        <button
          onClick={() => navigate('/modules/english')}
          className="w-full rounded-2xl bg-white shadow-card hover:shadow-card-hover active:scale-[0.98] transition-all p-4 flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-xl bg-[#F0E6F6] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <BookOpen size={28} className="text-[#9B59B6]" />
          </div>
          <div className="text-left flex-1">
            <div className="text-lg font-extrabold text-[var(--color-text)]">English</div>
            <div className="text-xs text-[var(--color-text-light)] mt-0.5 font-medium">Pronouns, Greetings, Reading, Asking for Help</div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            englishDone
              ? 'bg-[var(--color-correct)] text-white'
              : 'bg-[var(--color-bg)] text-[var(--color-text-light)]'
          }`}>
            {englishDone ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
          </div>
        </button>

        {/* Life Skills Card */}
        <button
          onClick={() => navigate('/modules/life')}
          className="w-full rounded-2xl bg-white shadow-card hover:shadow-card-hover active:scale-[0.98] transition-all p-4 flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-xl bg-[#FDE8D0] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Building2 size={28} className="text-[#E8A838]" />
          </div>
          <div className="text-left flex-1">
            <div className="text-lg font-extrabold text-[var(--color-text)]">Life Skills</div>
            <div className="text-xs text-[var(--color-text-light)] mt-0.5 font-medium">Work Skills, Workplace Scenarios</div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            lifeDone
              ? 'bg-[var(--color-correct)] text-white'
              : 'bg-[var(--color-bg)] text-[var(--color-text-light)]'
          }`}>
            {lifeDone ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
          </div>
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto flex justify-center gap-4 pb-4">
        <button
          onClick={() => navigate('/settings')}
          className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors font-semibold px-3 py-2 rounded-lg"
        >
          Settings
        </button>
        <button
          onClick={() => navigate('/parent')}
          className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors font-semibold px-3 py-2 rounded-lg"
        >
          Parent
        </button>
      </div>
    </div>
  )
}
