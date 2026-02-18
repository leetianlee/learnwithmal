import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import FillInBlankQuestion from './FillInBlankQuestion'
import AudioButton from './AudioButton'
import ClockFace from '../visuals/ClockFace'
import { Coin, Note } from '../visuals/CurrencyVisuals'
import { ChickenRice, Kopi, NasiLemak, Milo, FOOD_COMPONENTS } from '../visuals/HawkerFood'
import MalcolmAvatar from '../visuals/MalcolmAvatar'
import ScheduleTable from '../visuals/ScheduleTable'

export default function QuestionRenderer({ question, onAnswer, feedback, showHint, moduleId }) {
  if (!question) return null
  const audioText = question.audio || question.question

  const renderQuestion = () => {
    switch (question.type) {
      case 'fillInBlank':
        return (
          <FillInBlankQuestion
            question={question}
            onAnswer={onAnswer}
            feedback={feedback}
            showHint={showHint}
          />
        )
      case 'multipleChoice':
      default:
        return (
          <MultipleChoiceQuestion
            question={question}
            onAnswer={onAnswer}
            feedback={feedback}
            showHint={showHint}
          />
        )
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Reading passage — shown above question for readingComprehension module */}
      {question.passage && (
        <div className="w-full mb-4 p-4 bg-[var(--color-bg)] rounded-2xl border-l-4 border-[var(--color-primary)]">
          <p className="text-sm font-medium text-[var(--color-text-light)] mb-1.5">Read this:</p>
          <p className="text-base leading-relaxed text-[var(--color-text)] font-medium">
            {question.passage}
          </p>
        </div>
      )}

      {/* Question text with audio button */}
      <div className="flex items-start gap-3 mb-5 w-full">
        <AudioButton text={audioText} size="sm" className="mt-1 flex-shrink-0" />
        <h2 className="text-lg md:text-xl font-bold leading-relaxed text-[var(--color-text)]">
          {question.question}
        </h2>
      </div>

      {/* Question-specific visual */}
      <QuestionVisual question={question} moduleId={moduleId} />

      {/* Answer options */}
      {renderQuestion()}
    </div>
  )
}

/** Parse "50¢ + 20¢ + 10¢" or "$1 + $1 + 50¢" expressions into array of {type, value} */
function parseCurrencyExpression(text) {
  const items = []
  const parts = text.match(/\$\d+(?:\.\d+)?|\d+¢/g)
  if (!parts) return items
  for (const part of parts) {
    if (part.includes('¢')) {
      items.push({ type: 'coin', denomination: parseInt(part) })
    } else {
      const val = parseFloat(part.replace('$', ''))
      if (val <= 1) {
        items.push({ type: 'coin', denomination: Math.round(val * 100) })
      } else {
        items.push({ type: 'note', denomination: val })
      }
    }
  }
  return items
}

function QuestionVisual({ question, moduleId }) {
  // Time module: show schedule table for "Look at the schedule" questions
  if (moduleId === 'time' && question.question.toLowerCase().includes('look at the schedule')) {
    // Extract the activity being asked about (e.g., "cleaning" from "What time is cleaning?")
    const match = question.question.match(/what time is (\w[\w\s]*)\?/i)
    const highlight = match ? match[1].trim() : null
    return <ScheduleTable highlight={highlight} />
  }

  // Time module: show clock face if clockTime data exists
  if (moduleId === 'time' && question.clockTime) {
    return (
      <div className="mb-5 flex justify-center">
        <ClockFace
          hours={question.clockTime.hours}
          minutes={question.clockTime.minutes}
          size={140}
        />
      </div>
    )
  }

  // Money module
  if (moduleId === 'money') {
    const q = question.question.toLowerCase()

    // Detect food items mentioned in the question
    const foodMap = {
      'chicken rice': 'chicken-rice',
      'kopi': 'kopi',
      'nasi lemak': 'nasi-lemak',
      'milo': 'milo',
    }
    const detectedFood = Object.entries(foodMap)
      .filter(([name]) => q.includes(name))
      .map(([, key]) => key)

    if (detectedFood.length > 0) {
      return (
        <div className="mb-5 flex justify-center gap-4 flex-wrap">
          {detectedFood.map((foodKey) => {
            const FoodComponent = FOOD_COMPONENTS[foodKey]
            return FoodComponent ? (
              <div key={foodKey}>
                <FoodComponent size={75} />
              </div>
            ) : null
          })}
        </div>
      )
    }

    // "How much money" questions — show the coins/notes being counted
    if (q.includes('how much money')) {
      const items = parseCurrencyExpression(question.question)
      if (items.length > 0) {
        return (
          <div className="mb-5 flex justify-center items-center gap-2 flex-wrap">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                {item.type === 'coin'
                  ? <Coin denomination={item.denomination} size={52} />
                  : <Note denomination={item.denomination} size={72} />
                }
                {i < items.length - 1 && (
                  <span className="text-lg font-bold text-[var(--color-text-light)] mx-0.5">+</span>
                )}
              </div>
            ))}
          </div>
        )
      }
    }

    // "Which is a X?" identification questions — no visual (don't give away answer)
  }

  // English pronouns: show Malcolm avatar with auto-detected pose
  if (moduleId === 'pronouns') {
    const q = question.question.toLowerCase()
    let pose = 'neutral'
    if (q.includes('hungry') || q.includes('happy') || q.includes('excited')) pose = 'happy'
    else if (q.includes('want') || q.includes('need') || q.includes('help')) pose = 'pointing'
    else if (q.includes('hello') || q.includes('hi ') || q.includes('goodbye')) pose = 'waving'
    else if (q.includes('think') || q.includes('wonder') || q.includes('know')) pose = 'thinking'

    return (
      <div className="mb-5 flex justify-center">
        <MalcolmAvatar size={115} pose={pose} />
      </div>
    )
  }

  // Fallback: no visual
  return null
}
