import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeOption = 'light' | 'dark' | 'auto' | 'custom'
export type ResolvedTheme = 'light' | 'dark'

export interface CustomThemeSettings {
  hueShift: number
  saturation: number
  brightness: number
}

interface ThemeContextValue {
  theme: ThemeOption
  resolvedTheme: ResolvedTheme
  customTheme: CustomThemeSettings
  setTheme: (theme: ThemeOption) => void
  updateCustomTheme: (settings: CustomThemeSettings) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = 'appTheme'
const CUSTOM_THEME_STORAGE_KEY = 'appCustomThemeSettings'
const prefersDarkQuery = '(prefers-color-scheme: dark)'

const defaultCustomTheme: CustomThemeSettings = {
  hueShift: 0,
  saturation: 100,
  brightness: 100,
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeOption>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeOption | null
    return saved || 'light'
  })

  const [customTheme, setCustomTheme] = useState<CustomThemeSettings>(() => {
    if (typeof window === 'undefined') {
      return defaultCustomTheme
    }
    const saved = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved) as CustomThemeSettings
      } catch (error) {
        console.warn('Failed to parse custom theme settings', error)
      }
    }
    return defaultCustomTheme
  })

  const [prefersDark, setPrefersDark] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false
    }
    return window.matchMedia(prefersDarkQuery).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }
    const media = window.matchMedia(prefersDarkQuery)
    const handleChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(customTheme))
  }, [customTheme])

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === 'auto') {
      return prefersDark ? 'dark' : 'light'
    }
    if (theme === 'custom') {
      return 'light'
    }
    return theme
  }, [theme, prefersDark])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }
    const root = document.documentElement
    root.dataset.theme = resolvedTheme
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }
    const root = document.documentElement
    const filter =
      theme === 'custom'
        ? `hue-rotate(${customTheme.hueShift}deg) saturate(${customTheme.saturation}%) brightness(${customTheme.brightness}%)`
        : 'none'
    root.style.setProperty('--color-filter', filter)
  }, [theme, customTheme])

  const setTheme = (value: ThemeOption) => {
    setThemeState(value)
  }

  const updateCustomTheme = (settings: CustomThemeSettings) => {
    setCustomTheme(settings)
  }

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      customTheme,
      updateCustomTheme,
    }),
    [theme, resolvedTheme, customTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}