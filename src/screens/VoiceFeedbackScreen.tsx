import { useState } from 'react'

interface VoiceFeedbackScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

export function VoiceFeedbackScreen({ onNavigate, onBack, hideBottomNav = true }: VoiceFeedbackScreenProps) {
    const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(false)
    const [speechRate, setSpeechRate] = useState(1.0)
    const [speechVolume, setSpeechVolume] = useState(1.0)
    const [announceActions, setAnnounceActions] = useState(true)
    const [announceNavigation, setAnnounceNavigation] = useState(true)
    const [announceErrors, setAnnounceErrors] = useState(true)
    const [testVoice, setTestVoice] = useState(false)

    const ToggleSwitch = ({ enabled, onToggle, label, description }: { enabled: boolean; onToggle: () => void; label: string; description?: string }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex flex-col flex-1 pr-4">
                <span className="text-lg font-semibold text-text-dark mb-1">{label}</span>
                {description && <span className="text-sm text-gray-600">{description}</span>}
            </div>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in-out flex-shrink-0 ${
                    enabled ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`${label}: ${enabled ? 'enabled' : 'disabled'}`}
            >
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-md ${
                        enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    )

    const handleTestVoice = () => {
        setTestVoice(true)
        // In a real app, this would use Web Speech API to speak
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('This is a test of voice feedback. The app will now announce your actions.')
            utterance.rate = speechRate
            utterance.volume = speechVolume
            utterance.lang = 'en-US' // Would use selected language
            speechSynthesis.speak(utterance)
            
            utterance.onend = () => {
                setTestVoice(false)
            }
        } else {
            alert('Voice feedback is not supported in your browser.')
            setTestVoice(false)
        }
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Header - Large and accessible */}
            <header className="bg-primary px-6 py-5 flex items-center gap-4 z-10 relative">
                <button
                    onClick={onBack}
                    className="text-white hover:opacity-80 transition-opacity p-2 -ml-2"
                    aria-label="Back to previous screen"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-white">Voice Feedback</h1>
            </header>

            {/* Content - Large text, high contrast for accessibility */}
            <main className="flex-1 overflow-y-auto bg-white px-6 py-6">
                <div className="space-y-2">
                    {/* Main Toggle - Large and prominent */}
                    <div className="bg-green-50 rounded-2xl p-6 mb-6 border-2 border-primary/30">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 pr-6">
                                <h2 className="text-2xl font-bold text-text-dark mb-2">Enable Voice Feedback</h2>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Hear audio announcements for all your actions in your selected language. 
                                    This feature is designed to assist users with visual impairments.
                                </p>
                            </div>
                            <button
                                onClick={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)}
                                className={`relative inline-flex h-10 w-18 items-center rounded-full transition-colors duration-200 ease-in-out flex-shrink-0 ${
                                    voiceFeedbackEnabled ? 'bg-primary' : 'bg-gray-300'
                                }`}
                                aria-label={`Voice Feedback: ${voiceFeedbackEnabled ? 'enabled' : 'disabled'}`}
                            >
                                <span
                                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-lg ${
                                        voiceFeedbackEnabled ? 'translate-x-9' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Settings - Only show when enabled */}
                    {voiceFeedbackEnabled && (
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-text-dark mb-4 px-2">Voice Settings</h3>

                            {/* Speech Rate */}
                            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-lg font-semibold text-text-dark">Speech Rate</label>
                                        <span className="text-lg font-bold text-primary">{speechRate.toFixed(1)}x</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Adjust how fast the voice speaks</p>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2.0"
                                        step="0.1"
                                        value={speechRate}
                                        onChange={(e) => setSpeechRate(Number(e.target.value))}
                                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        aria-label={`Speech rate: ${speechRate.toFixed(1)} times normal speed`}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Slow</span>
                                        <span>Normal</span>
                                        <span>Fast</span>
                                    </div>
                                </div>
                            </div>

                            {/* Speech Volume */}
                            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-lg font-semibold text-text-dark">Volume</label>
                                        <span className="text-lg font-bold text-primary">{Math.round(speechVolume * 100)}%</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Adjust the volume of voice announcements</p>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={speechVolume}
                                        onChange={(e) => setSpeechVolume(Number(e.target.value))}
                                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        aria-label={`Volume: ${Math.round(speechVolume * 100)} percent`}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Quiet</span>
                                        <span>Medium</span>
                                        <span>Loud</span>
                                    </div>
                                </div>
                            </div>

                            {/* What to Announce */}
                            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                                <h4 className="text-lg font-semibold text-text-dark mb-4">What to Announce</h4>
                                <div className="space-y-0">
                                    <ToggleSwitch
                                        enabled={announceActions}
                                        onToggle={() => setAnnounceActions(!announceActions)}
                                        label="Announce Actions"
                                        description="Hear feedback when you tap buttons or perform actions"
                                    />
                                    <ToggleSwitch
                                        enabled={announceNavigation}
                                        onToggle={() => setAnnounceNavigation(!announceNavigation)}
                                        label="Announce Navigation"
                                        description="Hear feedback when navigating between screens"
                                    />
                                    <ToggleSwitch
                                        enabled={announceErrors}
                                        onToggle={() => setAnnounceErrors(!announceErrors)}
                                        label="Announce Errors"
                                        description="Hear feedback when errors occur"
                                    />
                                </div>
                            </div>

                            {/* Test Voice Button - Large and accessible */}
                            <button
                                onClick={handleTestVoice}
                                disabled={testVoice}
                                className="w-full py-5 rounded-xl bg-primary text-white text-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                                aria-label="Test voice feedback"
                            >
                                {testVoice ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Testing...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                        <span>Test Voice</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Info when disabled */}
                    {!voiceFeedbackEnabled && (
                        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                            <p className="text-base text-gray-700 leading-relaxed text-center">
                                Enable voice feedback to hear audio announcements for all your actions. 
                                This feature helps users with visual impairments navigate the app more easily.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

