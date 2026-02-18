import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import Card from '../common/Card'

export default function ParentGuide() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/parent')}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Parent's Guide</h1>
      </div>

      {/* How to Use the App */}
      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-3">How to Use the App</h2>

        <div className="space-y-4 text-sm text-[var(--color-text)] leading-relaxed">
          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">Daily Practice</h3>
            <p>
              Malcolm should aim to complete one session per subject each day (Math, English, Life Skills).
              The home screen shows a checklist — when all three are ticked, he's done for the day.
              The <strong>"Start Today's Plan"</strong> button picks 3 modules for him automatically,
              choosing areas he needs to work on plus one he's good at for confidence.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">Session Duration</h3>
            <p>
              In <strong>Settings</strong>, you can choose 15, 30, or 45 minutes.
              This controls how many questions Malcolm gets per session.
              Start with 15 minutes if he's new to the app, then increase as he builds stamina.
              He can always take a break mid-session — his progress is saved.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">Hints</h3>
            <p>
              If Malcolm doesn't answer within 30 seconds, a hint appears automatically.
              This is normal and expected — hints are there to help, not to judge.
              In the Parent Dashboard, you'll see a <strong>"Waited for Hints"</strong> section
              showing which questions he needed hints on most often. This tells you which
              topics to revisit together.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">Difficulty Levels</h3>
            <p>
              Each module has levels (up to 6, 8, or 10 depending on the subject).
              Malcolm levels up when he gets 80% or more correct with a streak of 3+.
              He levels down if accuracy drops below 50% after several attempts.
              This happens automatically — you don't need to manage it.
              The stars on each module card show overall progress (1–3 stars).
            </p>
          </div>
        </div>
      </Card>

      {/* Reading the Dashboard */}
      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-3">Reading the Dashboard</h2>

        <div className="space-y-4 text-sm text-[var(--color-text)] leading-relaxed">
          <div>
            <h3 className="font-bold text-[var(--color-incorrect)] mb-1">Needs Practice</h3>
            <p>
              Shows questions Malcolm gets wrong most often. If the same question appears
              repeatedly (e.g., "3x wrong"), it means he hasn't grasped that concept yet.
              Focus on these during offline practice.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">Waited for Hints</h3>
            <p>
              Shows questions where Malcolm waited for the hint before answering.
              This is different from getting it wrong — it means he was <strong>unsure or slow</strong>.
              If he got it right after the hint (<span className="text-[var(--color-correct)] font-semibold">teal card</span>),
              he probably knows the concept but needs more confidence.
              If he got it wrong even with the hint (<span className="text-[var(--color-incorrect)] font-semibold">amber card</span>),
              that topic needs extra attention.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-correct)] mb-1">What Good Progress Looks Like</h3>
            <p>
              Don't worry about perfection. Good signs are: the day streak going up,
              overall accuracy staying above 60%, and levels gradually increasing.
              It's normal for English to be harder than Math —
              Malcolm's math is strong (Level 6–7) while English may start at Level 1–3.
            </p>
          </div>
        </div>
      </Card>

      {/* Helping Malcolm Outside the App */}
      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-3">Helping Malcolm Outside the App</h2>

        <div className="space-y-4 text-sm text-[var(--color-text)] leading-relaxed">
          <div>
            <h3 className="font-bold mb-1">💰 Money Skills</h3>
            <p>
              Practice at the hawker centre or supermarket. Let Malcolm pay and count the change himself.
              Start with round amounts ($5, $10) before moving to coins.
              Ask "How much change should you get?" before paying.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-1">🕐 Time Skills</h3>
            <p>
              Use a physical clock at home. Practice daily routines: "What time do you leave for work?"
              "How long until dinner?" Let Malcolm set his own alarms for tasks.
              Ask about bus/MRT schedules when travelling together.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-1">➕ Math in Daily Life</h3>
            <p>
              Count items at the supermarket. Share food equally ("We have 12 nuggets for 4 people").
              Help Malcolm read receipts. Ask "Is this cheaper or more expensive?" when shopping.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-1">👤 Pronouns and Greetings</h3>
            <p>
              Role-play conversations at home: greeting a colleague, asking a supervisor for help,
              ordering food. Practice "excuse me" and "thank you" in different settings.
              When watching TV together, ask "What should he say next?"
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-1">🗣️ Asking for Help</h3>
            <p>
              This is one of the most important life skills. Practice scenarios:
              "What would you do if your MRT card doesn't work?"
              "What would you say if you don't understand your supervisor's instruction?"
              Praise Malcolm every time he asks for help in real life — it takes courage.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-1">📖 Reading Comprehension</h3>
            <p>
              Read signs, notices, and menus together. Ask Malcolm "What does this sign mean?"
              at MRT stations, at work, or in shopping centres.
              Read simple instructions together (e.g., food packet instructions, cleaning product labels).
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-1">🏨 Work Skills</h3>
            <p>
              Talk about Malcolm's day at work. Ask specific questions:
              "What rooms did you clean today?" "Did your supervisor give you any instructions?"
              Practice reading his work schedule together. Role-play handling problems
              like a missing item or a guest request.
            </p>
          </div>
        </div>
      </Card>

      {/* General Tips */}
      <Card className="mb-6">
        <h2 className="font-bold text-lg mb-3">General Tips</h2>

        <div className="space-y-3 text-sm text-[var(--color-text)] leading-relaxed">
          <p>
            <strong>Keep it routine.</strong> Same time each day works best. Many families do it
            after dinner or before bed. Consistency matters more than duration.
          </p>
          <p>
            <strong>Celebrate effort, not just results.</strong> "You practiced for 15 minutes — great job!"
            matters more than "You got 90%." Malcolm responds well to encouragement.
          </p>
          <p>
            <strong>Don't correct too quickly.</strong> Let Malcolm try, even if he gets it wrong.
            The app shows the correct answer and an explanation — give him time to read it.
          </p>
          <p>
            <strong>Watch for frustration signals.</strong> If Malcolm seems upset or rushed,
            remind him about the "Take a break" button. Short, positive sessions are better
            than long, stressful ones.
          </p>
          <p>
            <strong>Connect app learning to real life.</strong> When Malcolm does well in a module,
            find a real-world opportunity to use that skill within the same week.
            This is the most powerful thing you can do.
          </p>
        </div>
      </Card>

      <button
        onClick={() => navigate('/parent')}
        className="w-full text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors font-semibold py-2 mb-4"
      >
        ← Back to Dashboard
      </button>
    </div>
  )
}
