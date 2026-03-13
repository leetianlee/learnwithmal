import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useSettings } from '../../context/SettingsContext'
import { useSpeech } from '../../hooks/useSpeech'
import { getModule } from '../../data/moduleMetadata'
import ModuleIcon from '../visuals/ModuleIcon'
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react'
import { selectSessionQuestions } from '../../utils/questionSelector'
import { SESSION } from '../../data/constants'
import { playCorrectSound, playIncorrectSound } from '../../utils/soundEffects'
import QuestionRenderer from '../questions/QuestionRenderer'
import Button from '../common/Button'

export default function PracticeScreen() {
  const { subject, moduleId } = useParams()
  const navigate = useNavigate()
  const { getModuleProgress, recordAnswer, recordWrongAnswer, recordHintUsage, recordSession } = useProgress()
  const { settings } = useSettings()
  const { speak, stop: stopSpeech } = useSpeech()
  const mod = getModule(subject, moduleId)
  const bottomRef = useRef(null)

  const [questions, setQuestions] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  const [showBreak, setShowBreak] = useState(false)

  useEffect(() => {
    async function loadQuestions() {
      try {
        let data
        const mathModules = import.meta.glob('../../data/questions/math/*.json')
        const englishModules = import.meta.glob('../../data/questions/english/*.json')
        const lifeModules = import.meta.glob('../../data/questions/life/*.json')
        const subjectMap = { math: mathModules, english: englishModules, life: lifeModules }
        const allModules = subjectMap[subject] || {}
        const path = Object.keys(allModules).find(k => k.includes(`/${moduleId}.json`))
        if (path) {
          const loaded = await allModules[path]()
          data = loaded.default || loaded
        }
        if (data && data.length > 0) {
          const progress = getModuleProgress(subject, moduleId)
          const selected = selectSessionQuestions(
            data,
            progress.currentLevel,
            mod?.maxLevel || 10,
            settings.sessionMinutes || SESSION.DEFAULT_MINUTES
          )
          setQuestions(selected)
        } else {
          setQuestions([])
        }
      } catch (err) {
        console.error('Failed to load questions:', err)
        setQuestions([])
      }
      setLoading(false)
    }
    loadQuestions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, moduleId])

  useEffect(() => {
    if (feedback || !questions || currentIndex >= questions.length) return
    setShowHint(false)
    const timer = setTimeout(() => setShowHint(true), SESSION.HINT_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [currentIndex, feedback, questions])

  // TTS auto-read: speak question when it appears (if enabled)
  useEffect(() => {
    if (!questions || !settings.autoReadEnabled || feedback) return
    const q = questions[currentIndex]
    if (!q) return
    // For reading comprehension, read the passage first, then the question
    const textToSpeak = q.passage
      ? `${q.passage} ... ${q.audio || q.question}`
      : (q.audio || q.question)
    // Small delay so the card animation settles first
    const timer = setTimeout(() => speak(textToSpeak), 400)
    return () => { clearTimeout(timer); stopSpeech() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions, settings.autoReadEnabled])

  // Auto-scroll to bottom when feedback appears
  useEffect(() => {
    if (feedback && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }, 100)
    }
  }, [feedback])

  // selectedAnswer — string (multipleChoice) or string[] (multiSelect)
  // isCorrectOverride — boolean pre-computed by MultiSelectQuestion; undefined for multipleChoice
  const handleAnswer = useCallback((selectedAnswer, isCorrectOverride) => {
    if (feedback || !questions) return
    const question = questions[currentIndex]

    // Determine correctness
    const isCorrect = typeof isCorrectOverride === 'boolean'
      ? isCorrectOverride
      : selectedAnswer === question.correctAnswer

    // Convert arrays to readable strings for storage / display
    const displaySelected = Array.isArray(selectedAnswer)
      ? selectedAnswer.join(' + ')
      : selectedAnswer
    const displayCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.join(' + ')
      : question.correctAnswer

    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setLastAnswerCorrect(isCorrect)
    setAnswers(prev => [...prev, {
      questionId: question.id,
      selectedAnswer: displaySelected,
      correct: isCorrect,
      questionText: question.question,
      correctAnswer: displayCorrect,
      explanation: question.explanation || null,
    }])
    recordAnswer(subject, moduleId, isCorrect, question.id, mod?.maxLevel || 7)
    // Persist wrong answers for Parent Dashboard
    if (!isCorrect) {
      recordWrongAnswer(subject, moduleId, question.id, question.question, displayCorrect, displaySelected)
    }
    // Track if hint was shown before answering
    if (showHint) {
      recordHintUsage(subject, moduleId, question.id, question.question, isCorrect)
    }
    // Sound effects
    if (settings.soundEffectsEnabled) {
      isCorrect ? playCorrectSound() : playIncorrectSound()
    }
  }, [feedback, questions, currentIndex, subject, moduleId, mod, recordAnswer, recordWrongAnswer, recordHintUsage, showHint, settings.soundEffectsEnabled])

  const navigateToDone = () => {
    stopSpeech()
    recordSession(subject, moduleId)
    const totalCorrect = answers.filter(a => a.correct).length
    const wrongAnswers = answers.filter(a => !a.correct)
    navigate('/done', { state: { subject, moduleId, totalCorrect, total: questions.length, moduleName: mod?.name, wrongAnswers } })
  }

  const handleNext = () => {
    setFeedback(null)
    setShowHint(false)
    setLastAnswerCorrect(null)
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigateToDone()
    }
  }

  const handleStuck = () => {
    setFeedback(null)
    setShowHint(false)
    setLastAnswerCorrect(null)
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigateToDone()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-[var(--color-primary)] animate-pulse-gentle font-semibold">Loading questions...</div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-xl mb-4 font-semibold">No questions available for this module yet.</p>
        <Button onClick={() => navigate(`/modules/${subject}`)}>Back to Modules</Button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex + 1 >= questions.length
  const progressPercent = ((currentIndex + (feedback ? 1 : 0)) / questions.length) * 100

  // ── Break screen overlay ──
  if (showBreak) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-bg)]">
        <div className="text-center mb-8 animate-scale-in">
          {/* Breathing circle */}
          <div className="mx-auto mb-6 w-32 h-32 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center"
            style={{ animation: 'breathe 4s ease-in-out infinite' }}>
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] opacity-40"
              style={{ animation: 'breathe 4s ease-in-out infinite 0.2s' }} />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--color-text)] mb-2">Take a deep breath</h2>
          <p className="text-base text-[var(--color-text-light)] font-medium">
            Breathe in... and out... slowly.
          </p>
          <p className="text-sm text-[var(--color-text-light)] mt-2 font-medium">
            Your progress is saved. No rush.
          </p>
        </div>
        <Button onClick={() => setShowBreak(false)} className="px-10">
          Continue →
        </Button>
        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top bar ── full-width white header */}
      <header className="bg-white shadow-card flex-shrink-0 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate(`/modules/${subject}`)}
              className="w-9 h-9 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-text-light)] hover:bg-[var(--color-bg-hover)] transition-colors text-sm font-bold"
            >
              ✕
            </button>
            <div className="flex items-center gap-2">
              {mod?.icon && <ModuleIcon name={mod.icon} size={20} className="text-[var(--color-primary)]" />}
              <span className="font-extrabold text-sm text-[var(--color-text)]">{mod?.name}</span>
            </div>
            <div className="flex items-center gap-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-bold">
              {currentIndex + 1}
              <span className="opacity-60">/ {questions.length}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #4AABB3, #5DC4CC, #6BD4DB)'
              }}
            />
          </div>
        </div>
      </header>

      {/* ── Content area ── */}
      <div className="flex-1">
        <div className="max-w-2xl mx-auto px-5 py-4">

          {/* Question card */}
          <div
            className="bg-white rounded-3xl shadow-question p-5 md:p-6 animate-scale-in"
            key={currentIndex}
          >
            <QuestionRenderer
              question={currentQuestion}
              onAnswer={handleAnswer}
              feedback={feedback}
              showHint={showHint}
              moduleId={moduleId}
            />
          </div>

          {/* Hint — rendered OUTSIDE the card so nothing can clip it */}
          {showHint && !feedback && currentQuestion.hint && (
            <div
              className="mt-3 px-5 py-3 bg-[var(--color-primary-light)] rounded-2xl text-center animate-slide-up"
              style={{ overflow: 'visible', wordBreak: 'break-word', whiteSpace: 'normal' }}
            >
              <p className="text-sm text-[var(--color-primary)] font-semibold leading-relaxed flex items-start gap-1.5">
                <Lightbulb size={16} className="flex-shrink-0 mt-0.5" />
                {currentQuestion.hint}
              </p>
            </div>
          )}

          {/* ── Feedback + Next OR skip ── */}
          <div className="py-4" ref={bottomRef}>
            {feedback ? (
              <div className={feedback === 'incorrect' ? 'animate-shake' : 'animate-slide-up'}>
                {/* Feedback banner */}
                <div className={`text-center mb-3 p-3 rounded-2xl border-2 ${
                  feedback === 'correct'
                    ? 'bg-[var(--color-correct-light)] border-[var(--color-correct)]'
                    : 'bg-[var(--color-incorrect-light)] border-[var(--color-incorrect)]'
                }`}>
                  <p className={`text-base font-extrabold ${
                    feedback === 'correct' ? 'text-[var(--color-correct)]' : 'text-[var(--color-incorrect)]'
                  }`}>
                    <span className="inline-flex items-center gap-1.5">
                      {feedback === 'correct'
                        ? <><CheckCircle size={18} /> Correct!</>
                        : <><XCircle size={18} /> Not quite</>
                      }
                    </span>
                  </p>
                  {feedback === 'incorrect' && (
                    <p className="text-sm mt-1 text-[var(--color-text-light)]">
                      The answer is: <strong className="text-[var(--color-text)]">{
                        Array.isArray(currentQuestion.correctAnswer)
                          ? currentQuestion.correctAnswer.join(' + ')
                          : currentQuestion.correctAnswer
                      }</strong>
                    </p>
                  )}
                  {feedback === 'incorrect' && currentQuestion.explanation && (
                    <p className="text-sm mt-2 text-[var(--color-text)] bg-white/60 rounded-xl px-3 py-2 leading-relaxed flex items-start gap-1.5">
                      <Lightbulb size={14} className="flex-shrink-0 mt-0.5 text-[var(--color-primary)]" />
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
                {/* Next button */}
                <Button
                  onClick={handleNext}
                  className="w-full"
                  variant={feedback === 'correct' ? 'primary' : 'secondary'}
                >
                  {isLastQuestion ? 'See Results' : 'Next Question →'}
                </Button>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => { stopSpeech(); setShowBreak(true) }}
                  className="text-sm text-[var(--color-disabled)] hover:text-[var(--color-primary)] transition-colors px-4 py-2 rounded-xl font-semibold"
                >
                  Take a break
                </button>
                <button
                  onClick={handleStuck}
                  className="text-sm text-[var(--color-disabled)] hover:text-[var(--color-primary)] transition-colors px-4 py-2 rounded-xl font-semibold"
                >
                  Skip this one
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
