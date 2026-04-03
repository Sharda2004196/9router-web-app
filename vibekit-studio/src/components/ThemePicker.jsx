import { themes } from '../lib/themes'
import './ThemePicker.css'

export default function ThemePicker({ selectedTheme, onSelectTheme }) {
  return (
    <div className="theme-picker">
      {themes.map((theme) => (
        <button
          key={theme.id}
          className={`theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
          onClick={() => onSelectTheme(theme.id)}
          title={theme.description}
        >
          <div className="theme-preview-mini">
            <div
              className="color-bar"
              style={{ background: theme.preview.primary }}
            />
            <div
              className="color-bar"
              style={{ background: theme.preview.secondary }}
            />
            <div
              className="color-bar"
              style={{ background: theme.preview.accent }}
            />
          </div>
          <span className="theme-name">{theme.name}</span>
        </button>
      ))}
    </div>
  )
}
