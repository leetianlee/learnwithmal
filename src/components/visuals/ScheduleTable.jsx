/**
 * ScheduleTable — a simple visual school schedule for Time Level 7 questions.
 * Shows a daily timetable that Malcolm can read to answer "What time is X?" questions.
 */

const SCHEDULE_ITEMS = [
  { time: '8:00', activity: 'English', icon: '📖' },
  { time: '8:30', activity: 'Assembly', icon: '🏫' },
  { time: '9:00', activity: 'Math', icon: '🔢' },
  { time: '10:00', activity: 'Cleaning', icon: '🧹' },
  { time: '11:00', activity: 'PE', icon: '⚽' },
  { time: '12:00', activity: 'Lunch', icon: '🍱' },
  { time: '3:00 PM', activity: 'Dismissal', icon: '🎒' },
]

export default function ScheduleTable({ highlight }) {
  return (
    <div className="mb-5 w-full max-w-xs mx-auto">
      {/* Header */}
      <div
        className="flex items-center justify-center gap-2 py-2 rounded-t-xl text-white font-bold text-sm"
        style={{ background: 'var(--color-primary)' }}
      >
        📅 School Schedule
      </div>

      {/* Rows */}
      <div className="border-2 border-t-0 rounded-b-xl overflow-hidden" style={{ borderColor: 'var(--color-primary)' }}>
        {SCHEDULE_ITEMS.map((item, i) => {
          const isHighlighted = highlight && item.activity.toLowerCase() === highlight.toLowerCase()
          return (
            <div
              key={item.time}
              className={`flex items-center px-3 py-2 text-sm font-semibold ${
                i < SCHEDULE_ITEMS.length - 1 ? 'border-b' : ''
              }`}
              style={{
                borderColor: '#e0e0e0',
                background: isHighlighted ? 'var(--color-primary-light)' : (i % 2 === 0 ? '#fafafa' : 'white'),
              }}
            >
              <span className="w-[70px] text-[var(--color-text-light)] font-bold text-xs">{item.time}</span>
              <span className="mr-2">{item.icon}</span>
              <span className="text-[var(--color-text)]">{item.activity}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
