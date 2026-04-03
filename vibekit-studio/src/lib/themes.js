// VibeKit Studio - Theme Definitions

export const themes = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, editorial, high contrast',
    className: 'theme-minimal',
    preview: {
      primary: '#2563EB',
      secondary: '#3B82F6',
      accent: '#F97316',
      background: '#FFFFFF'
    }
  },
  {
    id: 'dark-neon',
    name: 'Dark Neon',
    description: 'Cyberpunk, high contrast, futuristic',
    className: 'theme-dark-neon',
    preview: {
      primary: '#00F0FF',
      secondary: '#FF00FF',
      accent: '#00FF88',
      background: '#0A0A0F'
    }
  },
  {
    id: 'neo-brutal',
    name: 'Neo-Brutal',
    description: 'Bold, geometric, high contrast',
    className: 'theme-neo-brutal',
    preview: {
      primary: '#000000',
      secondary: '#FF6B35',
      accent: '#FFD23F',
      background: '#FFFFFF'
    }
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    description: 'Gentle, friendly, approachable',
    className: 'theme-soft-pastel',
    preview: {
      primary: '#A78BFA',
      secondary: '#F9A8D4',
      accent: '#FCD34D',
      background: '#FFF7ED'
    }
  },
  {
    id: 'retro-gaming',
    name: 'Retro Gaming',
    description: '8-bit, pixelated, nostalgic',
    className: 'theme-retro-gaming',
    preview: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#2D2D2D'
    }
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Luxury, sophisticated, timeless',
    className: 'theme-elegant-serif',
    preview: {
      primary: '#8B7355',
      secondary: '#C4A57B',
      accent: '#D4AF37',
      background: '#FAFAF9'
    }
  }
]

export function getThemeById(id) {
  return themes.find(theme => theme.id === id) || themes[0]
}

export function getThemeClassName(id) {
  const theme = getThemeById(id)
  return theme.className
}
