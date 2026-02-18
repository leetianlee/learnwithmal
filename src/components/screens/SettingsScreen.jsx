import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { useProgress } from '../../context/ProgressContext'
import Button from '../common/Button'
import Card from '../common/Card'
import Modal from '../common/Modal'

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-lg">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-14 h-8 rounded-full transition-colors duration-200 relative ${value ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-disabled)]'}`}
      >
        <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform duration-200 ${value ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { settings, updateSetting } = useSettings()
  const { resetAll } = useProgress()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const handleResetAll = () => {
    resetAll()
    setShowResetConfirm(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-2">Audio</h2>
        <Toggle
          label="Read questions aloud"
          value={settings.audioEnabled}
          onChange={(v) => updateSetting('audioEnabled', v)}
        />
        <Toggle
          label="Auto-read on new question"
          value={settings.autoReadEnabled}
          onChange={(v) => updateSetting('autoReadEnabled', v)}
        />
        <Toggle
          label="Sound effects"
          value={settings.soundEffectsEnabled}
          onChange={(v) => updateSetting('soundEffectsEnabled', v)}
        />
      </Card>

      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-2">Practice</h2>
        <Toggle
          label="Show suggested module"
          value={settings.suggestedModuleEnabled}
          onChange={(v) => updateSetting('suggestedModuleEnabled', v)}
        />
      </Card>

      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-3">Session Length</h2>
        <div className="flex gap-3">
          {[15, 30, 45].map(mins => (
            <button
              key={mins}
              onClick={() => updateSetting('sessionMinutes', mins)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                settings.sessionMinutes === mins
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg)] text-[var(--color-text)]'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-3">Parent PIN</h2>
        <p className="text-sm text-[var(--color-disabled)] mb-2">
          Used to access the Parent Dashboard
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="password"
            value={settings.parentPin}
            onChange={(e) => updateSetting('parentPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            className="w-32 text-center text-2xl tracking-widest border-2 border-[var(--color-disabled)] rounded-xl py-2 px-4 focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="1234"
          />
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="font-bold text-lg mb-2">Practice Data</h2>
        <p className="text-sm text-[var(--color-text-light)] mb-3">
          Reset all progress, levels, and session history. This cannot be undone.
        </p>
        {resetDone ? (
          <div className="bg-[var(--color-correct-light)] text-[var(--color-correct)] px-4 py-3 rounded-xl text-sm font-bold text-center">
            ✓ All progress has been reset
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-xl font-semibold text-[var(--color-incorrect)] bg-[var(--color-incorrect-light)] hover:bg-[var(--color-incorrect)] hover:text-white transition-colors"
          >
            Reset All Progress
          </button>
        )}
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Reset All Progress?">
        <p className="mb-4 text-[var(--color-text-light)]">
          This will erase <strong className="text-[var(--color-text)]">all</strong> of Malcolm's progress across every module — levels, stars, mastery scores, and session history. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowResetConfirm(false)} className="flex-1">Cancel</Button>
          <button
            onClick={handleResetAll}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[var(--color-incorrect)] hover:opacity-90 transition-opacity"
          >
            Reset Everything
          </button>
        </div>
      </Modal>
    </div>
  )
}
