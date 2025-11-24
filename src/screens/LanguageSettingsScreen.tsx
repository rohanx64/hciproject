import { useState } from 'react'

interface LanguageSettingsScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

const languageOptions = [
    { id: 'english', label: 'English', code: 'EN', flag: '🇬🇧' },
    { id: 'urdu', label: 'اردو', code: 'UR', flag: '🇵🇰' },
    { id: 'punjabi', label: 'پنجابی', code: 'PA', flag: '🇵🇰' },
    { id: 'pashto', label: 'پښتو', code: 'PS', flag: '🇵🇰' },
    { id: 'sindhi', label: 'سنڌي', code: 'SD', flag: '🇵🇰' },
    { id: 'balochi', label: 'بلوچی', code: 'BL', flag: '🇵🇰' },
    { id: 'siraiki', label: 'سرائیکی', code: 'SK', flag: '🇵🇰' },
]

export function LanguageSettingsScreen({ onBack }: LanguageSettingsScreenProps) {
    const [selectedLanguage, setSelectedLanguage] = useState('english')

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Header */}
            <header className="bg-primary px-6 py-4 flex items-center gap-4 z-10 relative">
                <button
                    onClick={onBack}
                    className="text-white hover:opacity-80 transition-opacity"
                    aria-label="Back"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white">Language</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white px-6 py-4">
                <div className="space-y-3">
                    {languageOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSelectedLanguage(option.id)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${selectedLanguage === option.id
                                    ? 'border-primary bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{option.flag}</span>
                                    <div className="flex flex-col">
                                        <span className={`text-base font-semibold ${selectedLanguage === option.id ? 'text-primary' : 'text-text-dark'
                                            }`}>
                                            {option.label}
                                        </span>
                                        <span className="text-sm text-gray-500">{option.code}</span>
                                    </div>
                                </div>
                                {selectedLanguage === option.id && (
                                    <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    )
}

