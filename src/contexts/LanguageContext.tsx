import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../i18n/translations'

export type SupportedLanguage = 'english' | 'urdu'

interface LanguageContextValue {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  t: (text: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'hci-language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null
    return saved ?? 'english'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language === 'urdu' ? 'ur' : 'en'
    document.documentElement.dir = language === 'urdu' ? 'rtl' : 'ltr'
    document.documentElement.dataset.language = language
    document.body.classList.toggle('rtl', language === 'urdu')
  }, [language])

  const translate = useCallback(
    (text: string) => {
      if (language !== 'urdu') {
        return text
      }
      const normalized = text.trim()
      const lower = normalized.toLowerCase()
      const dictionary = translations.urdu
      return dictionary[normalized as keyof typeof dictionary] ?? dictionary[lower as keyof typeof dictionary] ?? normalized
    },
    [language],
  )

  const setLanguage = useCallback((next: SupportedLanguage) => {
    setLanguageState(next)
  }, [])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translate,
      isRTL: language === 'urdu',
    }),
    [language, setLanguage, translate],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

