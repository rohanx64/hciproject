import { useState } from 'react'

interface ChangeSizeSettingsScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

const sizeOptions = [
    { id: 'small', label: 'Small', description: 'Compact text and UI elements' },
    { id: 'medium', label: 'Medium', description: 'Standard size (Recommended)' },
    { id: 'large', label: 'Large', description: 'Larger text and UI elements' },
    { id: 'extraLarge', label: 'Extra Large', description: 'Maximum size for accessibility' },
]

export function ChangeSizeSettingsScreen({ onNavigate, onBack, hideBottomNav = true }: ChangeSizeSettingsScreenProps) {
    const [selectedSize, setSelectedSize] = useState('medium')

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
                <h1 className="text-xl font-bold text-white">Change Size</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white px-6 py-4">
                <div className="space-y-3">
                    {sizeOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSelectedSize(option.id)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                selectedSize === option.id
                                    ? 'border-primary bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className={`text-base font-semibold ${
                                        selectedSize === option.id ? 'text-primary' : 'text-text-dark'
                                    }`}>
                                        {option.label}
                                    </span>
                                    <span className="text-sm text-gray-500 mt-1">{option.description}</span>
                                </div>
                                {selectedSize === option.id && (
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

