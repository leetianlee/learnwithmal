import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loadData, saveData } from '../utils/storage'
import { DEFAULT_MODULE_PROGRESS } from '../data/constants'
import { updateProgressAfterAnswer } from '../utils/difficultyCalculator'
import { MODULES } from '../data/moduleMetadata'

const ProgressContext = createContext()

function getInitialProgress() {
  const saved = loadData('progress')
  if (saved) return saved

  const initial = {}
  for (const subject of Object.keys(MODULES)) {
    initial[subject] = {}
    for (const mod of MODULES[subject]) {
      initial[subject][mod.id] = { ...DEFAULT_MODULE_PROGRESS }
    }
  }
  return initial
}

function getInitialSessions() {
  return loadData('sessions') || { streak: 0, lastSessionDate: null, totalSessions: 0, log: [] }
}

function getInitialWrongAnswers() {
  return loadData('wrongAnswers') || []
}

function getInitialHintUsages() {
  return loadData('hintUsages') || []
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(getInitialProgress)
  const [sessions, setSessions] = useState(getInitialSessions)
  const [wrongAnswers, setWrongAnswers] = useState(getInitialWrongAnswers)
  const [hintUsages, setHintUsages] = useState(getInitialHintUsages)

  useEffect(() => { saveData('progress', progress) }, [progress])
  useEffect(() => { saveData('sessions', sessions) }, [sessions])
  useEffect(() => { saveData('wrongAnswers', wrongAnswers) }, [wrongAnswers])
  useEffect(() => { saveData('hintUsages', hintUsages) }, [hintUsages])

  const getModuleProgress = useCallback((subject, moduleId) => {
    return progress[subject]?.[moduleId] || { ...DEFAULT_MODULE_PROGRESS }
  }, [progress])

  const recordAnswer = useCallback((subject, moduleId, correct, questionId, maxLevel) => {
    setProgress(prev => {
      const current = prev[subject]?.[moduleId] || { ...DEFAULT_MODULE_PROGRESS }
      const updated = updateProgressAfterAnswer(current, correct, questionId, maxLevel)
      return {
        ...prev,
        [subject]: { ...prev[subject], [moduleId]: updated }
      }
    })
  }, [])

  /** Store wrong answers for the Parent Dashboard "Needs Practice" section */
  const recordWrongAnswer = useCallback((subject, moduleId, questionId, questionText, correctAnswer, selectedAnswer) => {
    setWrongAnswers(prev => {
      const entry = {
        subject,
        moduleId,
        questionId,
        questionText,
        correctAnswer,
        selectedAnswer,
        timestamp: new Date().toISOString(),
      }
      // Keep the last 100 wrong answers
      return [...prev.slice(-99), entry]
    })
  }, [])

  /** Store questions where the hint appeared before Malcolm answered */
  const recordHintUsage = useCallback((subject, moduleId, questionId, questionText, answeredCorrect) => {
    setHintUsages(prev => {
      const entry = {
        subject,
        moduleId,
        questionId,
        questionText,
        answeredCorrect,
        timestamp: new Date().toISOString(),
      }
      // Keep the last 100 hint usages
      return [...prev.slice(-99), entry]
    })
  }, [])

  const recordSession = useCallback((subject, moduleId) => {
    const today = new Date().toISOString().split('T')[0]
    setSessions(prev => {
      const isNewDay = prev.lastSessionDate !== today
      return {
        streak: isNewDay ? prev.streak + 1 : prev.streak,
        lastSessionDate: today,
        totalSessions: prev.totalSessions + 1,
        log: [...prev.log.slice(-99), { date: today, subject, module: moduleId }]
      }
    })
  }, [])

  const resetModule = useCallback((subject, moduleId) => {
    setProgress(prev => ({
      ...prev,
      [subject]: { ...prev[subject], [moduleId]: { ...DEFAULT_MODULE_PROGRESS } }
    }))
    // Also clear wrong answers and hint usages for this module
    setWrongAnswers(prev => prev.filter(w => !(w.subject === subject && w.moduleId === moduleId)))
    setHintUsages(prev => prev.filter(h => !(h.subject === subject && h.moduleId === moduleId)))
  }, [])

  const resetAll = useCallback(() => {
    const fresh = {}
    for (const subject of Object.keys(MODULES)) {
      fresh[subject] = {}
      for (const mod of MODULES[subject]) {
        fresh[subject][mod.id] = { ...DEFAULT_MODULE_PROGRESS }
      }
    }
    setProgress(fresh)
    setSessions({ streak: 0, lastSessionDate: null, totalSessions: 0, log: [] })
    setWrongAnswers([])
    setHintUsages([])
  }, [])

  const todayCompleted = useCallback((subject) => {
    const today = new Date().toISOString().split('T')[0]
    return sessions.log.some(s => s.date === today && s.subject === subject)
  }, [sessions])

  return (
    <ProgressContext.Provider value={{
      progress, sessions, wrongAnswers, hintUsages, getModuleProgress, recordAnswer, recordWrongAnswer, recordHintUsage, recordSession, resetModule, resetAll, todayCompleted
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => useContext(ProgressContext)
