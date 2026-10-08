import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations, LANGUAGES } from '../i18n/translations.js'

const LANG_KEY = 'mfi.language'
const LanguageContext = createContext(null)

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => window.localStorage.getItem(LANG_KEY) || 'en')
  // Bumped on every language change so components (e.g. AnimatePresence) can
  // key off it to trigger a transition animation.
  const [transitionKey, setTransitionKey] = useState(0)

  useEffect(() => {
    window.localStorage.setItem(LANG_KEY, language)
  }, [language])

  const setLanguage = useCallback((code) => {
    setLanguageState(code)
    setTransitionKey((k) => k + 1)
  }, [])

  const t = useCallback(
    (key) => {
      const value = getNested(translations[language], key)
      if (value !== undefined) return value
      // Fall back to English, then to the raw key, so a missing translation
      // never breaks the UI.
      const fallback = getNested(translations.en, key)
      return fallback !== undefined ? fallback : key
    },
    [language]
  )

  const value = useMemo(
    () => ({ language, setLanguage, t, transitionKey, languages: LANGUAGES }),
    [language, setLanguage, t, transitionKey]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
