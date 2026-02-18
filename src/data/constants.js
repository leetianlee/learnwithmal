export const COLORS = {
  bg: '#F5F3F0',
  primary: '#4AABB3',
  primaryDark: '#3A8A91',
  correct: '#6BBF7B',
  incorrect: '#E8A838',
  text: '#333333',
  card: '#FFFFFF',
  disabled: '#D1D1D1',
}

export const DIFFICULTY = {
  LEVEL_UP_MASTERY: 0.8,
  LEVEL_UP_STREAK: 3,
  LEVEL_DOWN_MASTERY: 0.5,
  LEVEL_DOWN_MIN_ATTEMPTS: 5,
  HISTORY_SIZE: 10,
  WARMUP_COUNT: 2,
  PRACTICE_MIN: 5,
  PRACTICE_MAX: 8,
  // Average seconds per question (used to calculate session question count)
  AVG_SECONDS_PER_QUESTION: 40,
}

export const SESSION = {
  HINT_TIMEOUT_MS: 30000,
  CORRECT_DELAY_MS: 1200,
  INCORRECT_DELAY_MS: 2000,
  DEFAULT_MINUTES: 30,
  MIN_MINUTES: 15,
  MAX_MINUTES: 45,
}

export const TTS = {
  RATE: 0.85,
  LANG: 'en-SG',
}

export const STAR_THRESHOLDS = {
  ONE: 0.01,
  TWO: 0.6,
  THREE: 0.8,
}

export const DEFAULT_SETTINGS = {
  audioEnabled: true,
  autoReadEnabled: true,
  soundEffectsEnabled: true,
  suggestedModuleEnabled: true,
  sessionMinutes: 30,
  parentPin: '1234',
}

export const DEFAULT_MODULE_PROGRESS = {
  currentLevel: 1,
  masteryScore: 0,
  correctStreak: 0,
  totalAttempts: 0,
  totalCorrect: 0,
  stars: 0,
  lastPracticed: null,
  history: [],
}
