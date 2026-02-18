export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export const getToday = () => {
  return new Date().toISOString().split('T')[0]
}

export const calculateStreak = (sessionLog) => {
  if (!sessionLog || sessionLog.length === 0) return 0
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let checkDate = new Date(today)
  
  const dateSet = new Set(sessionLog.map(s => s.date))
  
  // Check if practiced today
  if (dateSet.has(getToday())) {
    streak = 1
    checkDate.setDate(checkDate.getDate() - 1)
  } else {
    // Check if practiced yesterday (streak still valid)
    checkDate.setDate(checkDate.getDate() - 1)
    if (!dateSet.has(checkDate.toISOString().split('T')[0])) {
      return 0
    }
  }
  
  // Count consecutive days backwards
  while (dateSet.has(checkDate.toISOString().split('T')[0])) {
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }
  
  return streak
}
