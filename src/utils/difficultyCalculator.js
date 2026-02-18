import { DIFFICULTY, STAR_THRESHOLDS, DEFAULT_MODULE_PROGRESS } from '../data/constants'

export const calculateMastery = (history) => {
  if (!history || history.length === 0) return 0
  const recent = history.slice(-DIFFICULTY.HISTORY_SIZE)
  const correct = recent.filter(h => h.correct).length
  return correct / recent.length
}

export const shouldLevelUp = (progress) => {
  return (
    progress.masteryScore >= DIFFICULTY.LEVEL_UP_MASTERY &&
    progress.correctStreak >= DIFFICULTY.LEVEL_UP_STREAK
  )
}

export const shouldLevelDown = (progress) => {
  return (
    progress.masteryScore < DIFFICULTY.LEVEL_DOWN_MASTERY &&
    progress.totalAttempts >= DIFFICULTY.LEVEL_DOWN_MIN_ATTEMPTS
  )
}

export const getNextLevel = (progress, maxLevel) => {
  if (shouldLevelUp(progress)) {
    return Math.min(progress.currentLevel + 1, maxLevel)
  }
  if (shouldLevelDown(progress)) {
    return Math.max(progress.currentLevel - 1, 1)
  }
  return progress.currentLevel
}

export const calculateStars = (masteryScore, currentStars) => {
  let newStars = 0
  if (masteryScore >= STAR_THRESHOLDS.THREE) newStars = 3
  else if (masteryScore >= STAR_THRESHOLDS.TWO) newStars = 2
  else if (masteryScore >= STAR_THRESHOLDS.ONE) newStars = 1
  // Stars never decrease
  return Math.max(newStars, currentStars)
}

export const updateProgressAfterAnswer = (progress, correct, questionId, maxLevel) => {
  const newHistory = [
    ...progress.history.slice(-(DIFFICULTY.HISTORY_SIZE - 1)),
    { correct, questionId, timestamp: new Date().toISOString(), level: progress.currentLevel }
  ]
  
  const masteryScore = calculateMastery(newHistory)
  const correctStreak = correct ? progress.correctStreak + 1 : 0
  const totalAttempts = progress.totalAttempts + 1
  const totalCorrect = progress.totalCorrect + (correct ? 1 : 0)
  
  const updatedProgress = {
    ...progress,
    masteryScore,
    correctStreak,
    totalAttempts,
    totalCorrect,
    history: newHistory,
    lastPracticed: new Date().toISOString().split('T')[0],
  }
  
  updatedProgress.currentLevel = getNextLevel(updatedProgress, maxLevel)
  updatedProgress.stars = calculateStars(masteryScore, progress.stars)
  
  return updatedProgress
}
