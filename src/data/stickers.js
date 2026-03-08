import { MODULES } from './moduleMetadata'

/**
 * Sticker definitions for LearnWithMal.
 *
 * Stickers are fun, collectible emoji rewards — different from achievements.
 * Achievements = certificates/milestones. Stickers = visual collectibles.
 * Once earned, stickers never disappear.
 */

const SUBJECT_NAMES = { math: 'Math', english: 'English', life: 'Life Skills' }

// --- Getting Started stickers ---
const GETTING_STARTED = [
  {
    id: 'first-try',
    group: 'getting-started',
    sticker: '\u{1F680}', // 🚀
    name: 'First Try!',
    description: 'Complete your first ever session',
    check: (_progress, sessions) => sessions.totalSessions >= 1,
  },
  {
    id: 'comeback',
    group: 'getting-started',
    sticker: '\u{1F44B}', // 👋
    name: 'Welcome Back',
    description: 'Come back for a second day',
    check: (_progress, sessions) => {
      const days = new Set(sessions.log.map(s => s.date))
      return days.size >= 2
    },
  },
  {
    id: 'explorer',
    group: 'getting-started',
    sticker: '\u{1F30D}', // 🌍
    name: 'Explorer',
    description: 'Try all 3 subjects',
    check: (_progress, sessions) => {
      const subjects = new Set(sessions.log.map(s => s.subject))
      return subjects.has('math') && subjects.has('english') && subjects.has('life')
    },
  },
]

// --- Streak stickers ---
const STREAKS = [
  {
    id: 'streak-3',
    group: 'streaks',
    sticker: '\u{1F525}', // 🔥
    name: 'On Fire',
    description: '3-day practice streak',
    check: (_progress, sessions) => sessions.streak >= 3,
  },
  {
    id: 'streak-7',
    group: 'streaks',
    sticker: '\u{26A1}', // ⚡
    name: 'Unstoppable',
    description: '7-day practice streak',
    check: (_progress, sessions) => sessions.streak >= 7,
  },
  {
    id: 'streak-14',
    group: 'streaks',
    sticker: '\u{1F48E}', // 💎
    name: 'Diamond Streak',
    description: '14-day practice streak',
    check: (_progress, sessions) => sessions.streak >= 14,
  },
  {
    id: 'streak-30',
    group: 'streaks',
    sticker: '\u{1F451}', // 👑
    name: 'Streak King',
    description: '30-day practice streak',
    check: (_progress, sessions) => sessions.streak >= 30,
  },
]

// --- Session count stickers ---
const SESSIONS = [
  {
    id: 'sessions-10',
    group: 'sessions',
    sticker: '\u{1F3AF}', // 🎯
    name: '10 Sessions',
    description: 'Complete 10 practice sessions',
    check: (_progress, sessions) => sessions.totalSessions >= 10,
  },
  {
    id: 'sessions-25',
    group: 'sessions',
    sticker: '\u{1F4AA}', // 💪
    name: '25 Sessions',
    description: 'Complete 25 practice sessions',
    check: (_progress, sessions) => sessions.totalSessions >= 25,
  },
  {
    id: 'sessions-50',
    group: 'sessions',
    sticker: '\u{1F31F}', // 🌟
    name: '50 Sessions',
    description: 'Complete 50 practice sessions',
    check: (_progress, sessions) => sessions.totalSessions >= 50,
  },
  {
    id: 'sessions-100',
    group: 'sessions',
    sticker: '\u{1F308}', // 🌈
    name: '100 Sessions',
    description: 'Complete 100 practice sessions',
    check: (_progress, sessions) => sessions.totalSessions >= 100,
  },
]

// --- Star collection stickers ---
function buildStarStickers() {
  const stickers = []

  // Per-module: earn 3 stars
  for (const [subject, modules] of Object.entries(MODULES)) {
    for (const mod of modules) {
      stickers.push({
        id: `3star-${subject}-${mod.id}`,
        group: 'stars',
        sticker: '\u{2B50}', // ⭐
        name: `${mod.icon} ${mod.name} Star`,
        description: `Earn 3 stars in ${mod.name}`,
        check: (progress) => {
          const p = progress[subject]?.[mod.id]
          return p && p.stars >= 3
        },
      })
    }
  }

  // Subject mastery: 3 stars in ALL modules of a subject
  for (const [subject, modules] of Object.entries(MODULES)) {
    const name = SUBJECT_NAMES[subject]
    stickers.push({
      id: `master-${subject}`,
      group: 'stars',
      sticker: '\u{1F3C6}', // 🏆
      name: `${name} Champion`,
      description: `3 stars in every ${name} module`,
      check: (progress) => {
        return modules.every(m => {
          const p = progress[subject]?.[m.id]
          return p && p.stars >= 3
        })
      },
    })
  }

  return stickers
}

// --- Level milestone stickers ---
function buildLevelStickers() {
  const stickers = []

  for (const [subject, modules] of Object.entries(MODULES)) {
    for (const mod of modules) {
      // Halfway there
      const halfLevel = Math.ceil(mod.maxLevel / 2)
      stickers.push({
        id: `half-${subject}-${mod.id}`,
        group: 'levels',
        sticker: '\u{1F3D4}\u{FE0F}', // 🏔️
        name: `${mod.icon} Halfway`,
        description: `Reach Level ${halfLevel} in ${mod.name}`,
        check: (progress) => {
          const p = progress[subject]?.[mod.id]
          return p && p.currentLevel >= halfLevel
        },
      })

      // Max level
      stickers.push({
        id: `max-${subject}-${mod.id}`,
        group: 'levels',
        sticker: '\u{1F3D4}\u{FE0F}', // 🏔️
        name: `${mod.icon} Summit`,
        description: `Reach Level ${mod.maxLevel} in ${mod.name}`,
        check: (progress) => {
          const p = progress[subject]?.[mod.id]
          return p && p.currentLevel >= mod.maxLevel
        },
      })
    }
  }

  return stickers
}

// --- Daily challenge stickers ---
const DAILY = [
  {
    id: 'daily-all-3',
    group: 'daily',
    sticker: '\u{1F389}', // 🎉
    name: 'Full Day',
    description: 'Practice all 3 subjects in one day',
    check: (_progress, sessions) => {
      const daySubs = {}
      for (const s of sessions.log) {
        if (!daySubs[s.date]) daySubs[s.date] = new Set()
        daySubs[s.date].add(s.subject)
      }
      return Object.values(daySubs).some(set =>
        set.has('math') && set.has('english') && set.has('life')
      )
    },
  },
  {
    id: 'daily-5-sessions',
    group: 'daily',
    sticker: '\u{1F4A5}', // 💥
    name: 'Power Day',
    description: 'Do 5 sessions in one day',
    check: (_progress, sessions) => {
      const dayCounts = {}
      for (const s of sessions.log) {
        dayCounts[s.date] = (dayCounts[s.date] || 0) + 1
      }
      return Object.values(dayCounts).some(c => c >= 5)
    },
  },
]

// --- Build full list ---
let _cached = null

export function getStickerDefinitions() {
  if (!_cached) {
    _cached = [
      ...GETTING_STARTED,
      ...STREAKS,
      ...SESSIONS,
      ...buildStarStickers(),
      ...buildLevelStickers(),
      ...DAILY,
    ]
  }
  return _cached
}

/**
 * Compute earned stickers from progress + sessions.
 * Returns { id, group, sticker, name, description, earned }[]
 */
export function computeStickers(progress, sessions) {
  return getStickerDefinitions().map(def => ({
    id: def.id,
    group: def.group,
    sticker: def.sticker,
    name: def.name,
    description: def.description,
    earned: def.check(progress, sessions),
  }))
}

export const GROUP_LABELS = {
  'getting-started': 'Getting Started',
  'streaks': 'Streaks',
  'sessions': 'Practice Sessions',
  'stars': 'Star Collection',
  'levels': 'Level Milestones',
  'daily': 'Daily Challenges',
}

export const GROUP_ORDER = ['getting-started', 'streaks', 'sessions', 'daily', 'stars', 'levels']
