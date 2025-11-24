import { useTextSize } from '../contexts/TextSizeContext'
import type { TextSizeOption } from '../contexts/TextSizeContext'

interface ChangeSizeSettingsScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

const sizeOptions: { id: TextSizeOption; label: string; description: string }[] = [
    { id: 'small', label: 'Small', description: 'Compact text and UI elements' },
    { id: 'medium', label: 'Medium', description: 'Standard size (Recommended)' },
    { id: 'large', label: 'Large', description: 'Larger text and UI elements' },
    { id: 'extraLarge', label: 'Extra Large', description: 'Maximum size for accessibility' },
    { id: 'custom', label: 'Custom', description: 'Adjust text size to your preference' },
]

export function ChangeSizeSettingsScreen({ onNavigate, onBack, hideBottomNav = true }: ChangeSizeSettingsScreenProps) {
    const { selectedSize, customSize, setSelectedSize, setCustomSize } = useTextSize()

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
                        <div key={option.id}>
                            <button
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
                            
                            {/* Custom Size Slider - Only show when custom is selected */}
                            {option.id === 'custom' && selectedSize === 'custom' && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border-2 border-primary">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-base font-semibold text-text-dark">
                                            Custom Size
                                        </label>
                                        <span className="text-lg font-bold text-primary">
                                            {Math.round(customSize)}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="200"
                                        step="5"
                                        value={customSize}
                                        onChange={(e) => setCustomSize(parseFloat(e.target.value))}
                                        className="w-full"
                                        aria-label="Custom text size slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>50%</span>
                                        <span>100%</span>
                                        <span>200%</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-3">
                                        Adjust the slider to set your preferred text size. The size will be applied across the app.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

