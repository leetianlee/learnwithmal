export const MODULES = {
  math: [
    { id: 'money', name: 'Money', icon: '💰', maxLevel: 10, description: 'Coins, prices, and change' },
    { id: 'time', name: 'Time', icon: '🕐', maxLevel: 10, description: 'Clocks and schedules' },
    { id: 'adding', name: 'Adding', icon: '➕', maxLevel: 10, description: 'Addition practice' },
    { id: 'subtracting', name: 'Subtracting', icon: '➖', maxLevel: 10, description: 'Subtraction practice' },
  ],
  english: [
    { id: 'pronouns', name: 'Pronouns', icon: '👤', maxLevel: 8, description: 'I, you, he, she' },
    { id: 'greetings', name: 'Greetings', icon: '👋', maxLevel: 8, description: 'Hello and workplace phrases' },
    { id: 'askingForHelp', name: 'Asking for Help', icon: '🗣️', maxLevel: 8, description: 'How to ask for help' },
    { id: 'readingComprehension', name: 'Reading', icon: '📖', maxLevel: 6, description: 'Read and understand passages' },
  ],
  life: [
    { id: 'workSkills', name: 'Work Skills', icon: '🏨', maxLevel: 6, description: 'Hotel tasks and workplace scenarios' },
  ],
}

export const getModule = (subject, moduleId) => {
  return MODULES[subject]?.find(m => m.id === moduleId)
}

export const getAllModules = () => {
  return [
    ...MODULES.math.map(m => ({ ...m, subject: 'math' })),
    ...MODULES.english.map(m => ({ ...m, subject: 'english' })),
    ...MODULES.life.map(m => ({ ...m, subject: 'life' })),
  ]
}
