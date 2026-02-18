import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import { ProgressProvider } from './context/ProgressContext'
import HomeScreen from './components/screens/HomeScreen'
import ModuleSelect from './components/screens/ModuleSelect'
import PracticeScreen from './components/screens/PracticeScreen'
import DoneScreen from './components/screens/DoneScreen'
import SettingsScreen from './components/screens/SettingsScreen'
import ParentDashboard from './components/screens/ParentDashboard'
import DailyPlanScreen from './components/screens/DailyPlanScreen'
import ParentGuide from './components/screens/ParentGuide'

export default function App() {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[var(--color-bg)]">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/daily-plan" element={<DailyPlanScreen />} />
              <Route path="/modules/:subject" element={<ModuleSelect />} />
              <Route path="/practice/:subject/:moduleId" element={<PracticeScreen />} />
              <Route path="/done" element={<DoneScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/parent" element={<ParentDashboard />} />
              <Route path="/parent/guide" element={<ParentGuide />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ProgressProvider>
    </SettingsProvider>
  )
}
