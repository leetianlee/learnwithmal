export const MODULES = {
  math: [
    { id: 'money', name: 'Money', icon: 'Coins', maxLevel: 10, description: 'Coins, prices, and change' },
    { id: 'time', name: 'Time', icon: 'Clock', maxLevel: 10, description: 'Clocks and schedules' },
    { id: 'adding', name: 'Adding', icon: 'Plus', maxLevel: 10, description: 'Addition practice' },
    { id: 'subtracting', name: 'Subtracting', icon: 'Minus', maxLevel: 10, description: 'Subtraction practice' },
  ],
  english: [
    { id: 'pronouns', name: 'Pronouns', icon: 'User', maxLevel: 8, description: 'I, you, he, she' },
    { id: 'greetings', name: 'Greetings', icon: 'HandMetal', maxLevel: 8, description: 'Hello and workplace phrases' },
    { id: 'askingForHelp', name: 'Asking for Help', icon: 'MessageCircle', maxLevel: 8, description: 'How to ask for help' },
    { id: 'readingComprehension', name: 'Reading', icon: 'BookOpen', maxLevel: 6, description: 'Read and understand passages' },
    { id: 'workplaceWords', name: 'Workplace Words', icon: 'Briefcase', maxLevel: 8, description: 'Hotel and workplace vocabulary' },
    { id: 'sentenceBuilding', name: 'Sentences', icon: 'AlignLeft', maxLevel: 8, description: 'Build sentences in order' },
  ],
  life: [
    { id: 'workSkills', name: 'Work Skills', icon: 'Building2', maxLevel: 6, description: 'Hotel tasks and workplace scenarios' },
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
