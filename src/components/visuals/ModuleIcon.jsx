import {
  Coins, Clock, Plus, Minus,
  User, HandMetal, MessageCircle, BookOpen,
  Briefcase, Building2,
} from 'lucide-react'

const ICON_MAP = {
  Coins,
  Clock,
  Plus,
  Minus,
  User,
  HandMetal,
  MessageCircle,
  BookOpen,
  Briefcase,
  Building2,
}

/**
 * Renders a Lucide icon by name string. Falls back to the raw string if no match.
 * Used for module icons defined in moduleMetadata.js
 */
export default function ModuleIcon({ name, size = 24, className = '' }) {
  const Icon = ICON_MAP[name]
  if (Icon) {
    return <Icon size={size} className={className} strokeWidth={2} />
  }
  // Fallback: render the string (e.g., old emoji)
  return <span className={className} style={{ fontSize: size }}>{name}</span>
}
