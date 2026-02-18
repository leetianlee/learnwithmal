import { DIFFICULTY } from '../data/constants'

/**
 * Build a session question set based on duration and adaptive level.
 *
 * @param {Array}  allQuestions   – full question bank for this module
 * @param {number} currentLevel  – learner's current adaptive level
 * @param {number} maxLevel      – module's maximum level (from moduleMetadata)
 * @param {number} sessionMinutes – chosen session duration (15 / 30 / 45)
 */
export const selectSessionQuestions = (allQuestions, currentLevel, maxLevel = 10, sessionMinutes = 30) => {
  const { WARMUP_COUNT, AVG_SECONDS_PER_QUESTION } = DIFFICULTY

  // Calculate how many questions to serve based on session duration
  const totalTarget = Math.max(
    WARMUP_COUNT + 3,                                           // absolute minimum
    Math.round((sessionMinutes * 60) / AVG_SECONDS_PER_QUESTION) // duration-based
  )
  const practiceTarget = totalTarget - WARMUP_COUNT

  // ── Warmup: easy questions from below current level ──
  const warmupPool = allQuestions.filter(q => q.level <= Math.max(1, currentLevel - 1))
  const warmup = shuffleAndPick(warmupPool, WARMUP_COUNT)

  // ── Practice: questions at current level, then expand outward to fill ──
  // Start with current & current+1 (capped at the real maxLevel, not 7)
  let practicePool = allQuestions.filter(q =>
    q.level >= currentLevel && q.level <= Math.min(currentLevel + 1, maxLevel)
  )
  let practice = shuffleAndPick(practicePool, practiceTarget)

  // If we still need more, expand the range further (up to maxLevel, then down)
  if (practice.length < practiceTarget) {
    const usedIds = new Set([...warmup.map(q => q.id), ...practice.map(q => q.id)])
    const wider = allQuestions.filter(q =>
      q.level >= Math.max(1, currentLevel - 2) &&
      q.level <= maxLevel &&
      !usedIds.has(q.id)
    )
    const needed = practiceTarget - practice.length
    practice.push(...shuffleAndPick(wider, needed))
  }

  // Final fallback: if the bank is tiny, grab anything unused
  if (practice.length < practiceTarget) {
    const usedIds = new Set([...warmup.map(q => q.id), ...practice.map(q => q.id)])
    const remaining = allQuestions.filter(q => !usedIds.has(q.id))
    practice.push(...shuffleAndPick(remaining, practiceTarget - practice.length))
  }

  return [...warmup, ...practice]
}

/** Fisher-Yates shuffle — unbiased random selection */
function shuffleAndPick(arr, count) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, count)
}
