import { MODULES, getAllModules } from './moduleMetadata'

/**
 * Achievement definitions for LearnWithMal.
 * Each achievement is computed from existing progress + session data — no new storage needed.
 */

const SUBJECT_NAMES = { math: 'Math', english: 'English', life: 'Life Skills' }

// --- Dynamic per-module achievements ---
function buildModuleAchievements() {
  const achievements = []
  const allModules = getAllModules()

  for (const mod of allModules) {
    // First Steps — reach Level 2
    achievements.push({
      id: `first-steps-${mod.subject}-${mod.id}`,
      category: 'module',
      icon: '\u{1F331}',       // 🌱
      title: `First Steps: ${mod.name}`,
      description: `Reach Level 2 in ${mod.name}`,
      check: (progress) => {
        const p = progress[mod.subject]?.[mod.id]
        const earned = p && p.currentLevel >= 2
        return { earned: !!earned, date: earned ? p.lastPracticed : null }
      },
    })

    // Getting Good — reach Level 5
    if (mod.maxLevel >= 5) {
      achievements.push({
        id: `getting-good-${mod.subject}-${mod.id}`,
        category: 'module',
        icon: '\u{2B50}',     // ⭐
        title: `Getting Good: ${mod.name}`,
        description: `Reach Level 5 in ${mod.name}`,
        check: (progress) => {
          const p = progress[mod.subject]?.[mod.id]
          const earned = p && p.currentLevel >= 5
          return { earned: !!earned, date: earned ? p.lastPracticed : null }
        },
      })
    }

    // Expert — reach max level
    achievements.push({
      id: `expert-${mod.subject}-${mod.id}`,
      category: 'module',
      icon: '\u{1F3C6}',     // 🏆
      title: `Expert: ${mod.name}`,
      description: `Reach Level ${mod.maxLevel} in ${mod.name}`,
      check: (progress) => {
        const p = progress[mod.subject]?.[mod.id]
        const earned = p && p.currentLevel >= mod.maxLevel
        return { earned: !!earned, date: earned ? p.lastPracticed : null }
      },
    })
  }

  return achievements
}

// --- Subject mastery achievements ---
function buildSubjectAchievements() {
  const achievements = []

  for (const [subject, modules] of Object.entries(MODULES)) {
    const name = SUBJECT_NAMES[subject]

    // Explorer — Level 3+ in ALL modules of a subject
    achievements.push({
      id: `explorer-${subject}`,
      category: 'subject',
      icon: '\u{1F5FA}\u{FE0F}', // 🗺️
      title: `${name} Explorer`,
      description: `Reach Level 3 in all ${name} modules`,
      check: (progress) => {
        const all = modules.every(m => {
          const p = progress[subject]?.[m.id]
          return p && p.currentLevel >= 3
        })
        if (!all) return { earned: false, date: null }
        // Use the most recent lastPracticed among the modules
        const dates = modules
          .map(m => progress[subject]?.[m.id]?.lastPracticed)
          .filter(Boolean)
        return { earned: true, date: dates.sort().pop() || null }
      },
    })

    // Star — 3 stars in ANY module of a subject
    achievements.push({
      id: `star-${subject}`,
      category: 'subject',
      icon: '\u{1F31F}',     // 🌟
      title: `${name} Star`,
      description: `Earn 3 stars in any ${name} module`,
      check: (progress) => {
        for (const m of modules) {
          const p = progress[subject]?.[m.id]
          if (p && p.stars >= 3) {
            return { earned: true, date: p.lastPracticed }
          }
        }
        return { earned: false, date: null }
      },
    })

    // Master — 3 stars in ALL modules of a subject
    achievements.push({
      id: `master-${subject}`,
      category: 'subject',
      icon: '\u{1F451}',     // 👑
      title: `${name} Master`,
      description: `Earn 3 stars in ALL ${name} modules`,
      check: (progress) => {
        const all = modules.every(m => {
          const p = progress[subject]?.[m.id]
          return p && p.stars >= 3
        })
        if (!all) return { earned: false, date: null }
        const dates = modules
          .map(m => progress[subject]?.[m.id]?.lastPracticed)
          .filter(Boolean)
        return { earned: true, date: dates.sort().pop() || null }
      },
    })
  }

  return achievements
}

// --- Streak & consistency achievements ---
const STREAK_ACHIEVEMENTS = [
  {
    id: 'first-session',
    category: 'streak',
    icon: '\u{1F389}',       // 🎉
    title: 'First Session',
    description: 'Complete your first practice session',
    check: (_progress, sessions) => {
      const earned = sessions.totalSessions >= 1
      const date = sessions.log.length > 0 ? sessions.log[0].date : null
      return { earned, date }
    },
  },
  {
    id: 'streak-3',
    category: 'streak',
    icon: '\u{1F525}',       // 🔥
    title: '3-Day Streak',
    description: 'Practice 3 days in a row',
    check: (_progress, sessions) => ({
      earned: sessions.streak >= 3,
      date: sessions.streak >= 3 ? sessions.lastSessionDate : null,
    }),
  },
  {
    id: 'streak-7',
    category: 'streak',
    icon: '\u{1F4AA}',       // 💪
    title: '7-Day Streak',
    description: 'Practice 7 days in a row',
    check: (_progress, sessions) => ({
      earned: sessions.streak >= 7,
      date: sessions.streak >= 7 ? sessions.lastSessionDate : null,
    }),
  },
  {
    id: 'streak-30',
    category: 'streak',
    icon: '\u{1F3C5}',       // 🏅
    title: '30-Day Streak',
    description: 'Practice 30 days in a row!',
    check: (_progress, sessions) => ({
      earned: sessions.streak >= 30,
      date: sessions.streak >= 30 ? sessions.lastSessionDate : null,
    }),
  },
  {
    id: 'sessions-50',
    category: 'streak',
    icon: '\u{1F4DA}',       // 📚
    title: '50 Sessions',
    description: 'Complete 50 practice sessions',
    check: (_progress, sessions) => ({
      earned: sessions.totalSessions >= 50,
      date: sessions.totalSessions >= 50 ? sessions.lastSessionDate : null,
    }),
  },
]

// --- Special achievements ---
const SPECIAL_ACHIEVEMENTS = [
  {
    id: 'all-rounder',
    category: 'special',
    icon: '\u{1F308}',       // 🌈
    title: 'All Rounder',
    description: 'Practice Math, English, and Life Skills in one day',
    check: (_progress, sessions) => {
      // Check if any single day has all 3 subjects
      const daySubjects = {}
      for (const entry of sessions.log) {
        if (!daySubjects[entry.date]) daySubjects[entry.date] = new Set()
        daySubjects[entry.date].add(entry.subject)
      }
      for (const [date, subjects] of Object.entries(daySubjects)) {
        if (subjects.has('math') && subjects.has('english') && subjects.has('life')) {
          return { earned: true, date }
        }
      }
      return { earned: false, date: null }
    },
  },
  {
    id: 'super-star',
    category: 'special',
    icon: '\u{1F320}',       // 🌠
    title: 'Super Star',
    description: 'Earn 3 stars in 5 or more modules',
    check: (progress) => {
      let count = 0
      let latestDate = null
      for (const subject of Object.keys(MODULES)) {
        for (const mod of MODULES[subject]) {
          const p = progress[subject]?.[mod.id]
          if (p && p.stars >= 3) {
            count++
            if (p.lastPracticed && (!latestDate || p.lastPracticed > latestDate)) {
              latestDate = p.lastPracticed
            }
          }
        }
      }
      return { earned: count >= 5, date: latestDate }
    },
  },
  {
    id: 'dedicated-learner',
    category: 'special',
    icon: '\u{2728}',        // ✨
    title: 'Dedicated Learner',
    description: 'Reach Level 2+ in every single module',
    check: (progress) => {
      const allModules = getAllModules()
      const all = allModules.every(m => {
        const p = progress[m.subject]?.[m.id]
        return p && p.currentLevel >= 2
      })
      if (!all) return { earned: false, date: null }
      const dates = allModules
        .map(m => progress[m.subject]?.[m.id]?.lastPracticed)
        .filter(Boolean)
      return { earned: true, date: dates.sort().pop() || null }
    },
  },
]

// --- Build full list ---
let _cachedDefinitions = null

export function getAchievementDefinitions() {
  if (!_cachedDefinitions) {
    _cachedDefinitions = [
      ...buildModuleAchievements(),
      ...buildSubjectAchievements(),
      ...STREAK_ACHIEVEMENTS,
      ...SPECIAL_ACHIEVEMENTS,
    ]
  }
  return _cachedDefinitions
}

/**
 * Compute all achievements from current progress and session data.
 * Returns array of { id, category, icon, title, description, earned, date }
 */
export function computeAchievements(progress, sessions) {
  const definitions = getAchievementDefinitions()
  return definitions.map(def => {
    const { earned, date } = def.check(progress, sessions)
    return {
      id: def.id,
      category: def.category,
      icon: def.icon,
      title: def.title,
      description: def.description,
      earned,
      date,
    }
  })
}

export const CATEGORY_LABELS = {
  module: 'Module Milestones',
  subject: 'Subject Mastery',
  streak: 'Streaks & Consistency',
  special: 'Special',
}

export const CATEGORY_ORDER = ['module', 'subject', 'streak', 'special']
