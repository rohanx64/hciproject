import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface VoiceFeedbackContextType {
    voiceFeedbackEnabled: boolean
    setVoiceFeedbackEnabled: (enabled: boolean) => void
    speechRate: number
    setSpeechRate: (rate: number) => void
    speechVolume: number
    setSpeechVolume: (volume: number) => void
    announceActions: boolean
    setAnnounceActions: (enabled: boolean) => void
    announceNavigation: boolean
    setAnnounceNavigation: (enabled: boolean) => void
    announceErrors: boolean
    setAnnounceErrors: (enabled: boolean) => void
    speak: (text: string, priority?: 'high' | 'normal') => void
    speakAction: (text: string) => void
    speakNavigation: (text: string) => void
    speakError: (text: string) => void
}

const VoiceFeedbackContext = createContext<VoiceFeedbackContextType | undefined>(undefined)

export function VoiceFeedbackProvider({ children }: { children: React.ReactNode }) {
    // Initialize state from localStorage if available
    const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(() => {
        return localStorage.getItem('voiceFeedbackEnabled') === 'true'
    })
    const [speechRate, setSpeechRate] = useState(() => {
        const saved = localStorage.getItem('speechRate')
        return saved ? parseFloat(saved) : 1.0
    })
    const [speechVolume, setSpeechVolume] = useState(() => {
        const saved = localStorage.getItem('speechVolume')
        return saved ? parseFloat(saved) : 1.0
    })
    const [announceActions, setAnnounceActions] = useState(() => {
        const saved = localStorage.getItem('announceActions')
        return saved !== 'false' // Default to true
    })
    const [announceNavigation, setAnnounceNavigation] = useState(() => {
        const saved = localStorage.getItem('announceNavigation')
        return saved !== 'false' // Default to true
    })
    const [announceErrors, setAnnounceErrors] = useState(() => {
        const saved = localStorage.getItem('announceErrors')
        return saved !== 'false' // Default to true
    })

    // Persist state changes
    useEffect(() => {
        localStorage.setItem('voiceFeedbackEnabled', String(voiceFeedbackEnabled))
    }, [voiceFeedbackEnabled])

    useEffect(() => {
        localStorage.setItem('speechRate', String(speechRate))
    }, [speechRate])

    useEffect(() => {
        localStorage.setItem('speechVolume', String(speechVolume))
    }, [speechVolume])

    useEffect(() => {
        localStorage.setItem('announceActions', String(announceActions))
    }, [announceActions])

    useEffect(() => {
        localStorage.setItem('announceNavigation', String(announceNavigation))
    }, [announceNavigation])

    useEffect(() => {
        localStorage.setItem('announceErrors', String(announceErrors))
    }, [announceErrors])

    const speak = useCallback((text: string, priority: 'high' | 'normal' = 'normal') => {
        if (!voiceFeedbackEnabled || !('speechSynthesis' in window)) return

        // Cancel current speech if high priority
        if (priority === 'high') {
            window.speechSynthesis.cancel()
        }

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = speechRate
        utterance.volume = speechVolume
        window.speechSynthesis.speak(utterance)
    }, [voiceFeedbackEnabled, speechRate, speechVolume])

    const speakAction = useCallback((text: string) => {
        if (announceActions) speak(text)
    }, [announceActions, speak])

    const speakNavigation = useCallback((text: string) => {
        if (announceNavigation) speak(text)
    }, [announceNavigation, speak])

    const speakError = useCallback((text: string) => {
        if (announceErrors) speak(text, 'high')
    }, [announceErrors, speak])

    return (
        <VoiceFeedbackContext.Provider
            value={{
                voiceFeedbackEnabled,
                setVoiceFeedbackEnabled,
                speechRate,
                setSpeechRate,
                speechVolume,
                setSpeechVolume,
                announceActions,
                setAnnounceActions,
                announceNavigation,
                setAnnounceNavigation,
                announceErrors,
                setAnnounceErrors,
                speak,
                speakAction,
                speakNavigation,
                speakError,
            }}
        >
            {children}
        </VoiceFeedbackContext.Provider>
    )
}

export function useVoiceFeedback() {
    const context = useContext(VoiceFeedbackContext)
    if (context === undefined) {
        throw new Error('useVoiceFeedback must be used within a VoiceFeedbackProvider')
    }
    return context
}
