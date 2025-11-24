import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'

type PresetSize = 'small' | 'medium' | 'large' | 'extraLarge'
export type TextSizeOption = PresetSize | 'custom'

interface TextSizeContextValue {
  selectedSize: TextSizeOption
  customSize: number
  scale: number
  setSelectedSize: (size: TextSizeOption) => void
  setCustomSize: (size: number) => void
}

const PRESET_SCALES: Record<PresetSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.1,
  extraLarge: 1.25,
}

const TextSizeContext = createContext<TextSizeContextValue | undefined>(undefined)

const getLocalStorageValue = (key: string) => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

export function TextSizeProvider({ children }: { children: ReactNode }) {
  const [selectedSize, setSelectedSizeState] = useState<TextSizeOption>(() => {
    const saved = getLocalStorageValue('textSize')
    return (saved as TextSizeOption) || 'medium'
  })

  const [customSize, setCustomSizeState] = useState(() => {
    const saved = getLocalStorageValue('customTextSize')
    const parsed = saved ? parseFloat(saved) : 100
    return Number.isFinite(parsed) ? parsed : 100
  })

  const scale = useMemo(() => {
    if (selectedSize === 'custom') {
      return Math.min(Math.max(customSize, 50), 200) / 100
    }
    return PRESET_SCALES[selectedSize] ?? 1
  }, [customSize, selectedSize])

  useEffect(() => {
    localStorage.setItem('textSize', selectedSize)
  }, [selectedSize])

  useEffect(() => {
    localStorage.setItem('customTextSize', String(customSize))
  }, [customSize])

  useEffect(() => {
    const baseFontSize = 16
    document.documentElement.style.fontSize = `${baseFontSize * scale}px`
    document.documentElement.style.setProperty('--app-scale', String(scale))
  }, [scale])

  const setSelectedSize = (size: TextSizeOption) => {
    setSelectedSizeState(size)
  }

  const setCustomSize = (size: number) => {
    setCustomSizeState(size)
    if (selectedSize !== 'custom') {
      setSelectedSizeState('custom')
    }
  }

  const value: TextSizeContextValue = {
    selectedSize,
    customSize,
    scale,
    setSelectedSize,
    setCustomSize,
  }

  return <TextSizeContext.Provider value={value}>{children}</TextSizeContext.Provider>
}

export function useTextSize() {
  const context = useContext(TextSizeContext)
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider')
  }
  return context
}

