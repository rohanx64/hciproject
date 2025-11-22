import { useState } from 'react'

interface ChangeThemeSettingsScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

const themeOptions = [
    { id: 'light', label: 'Light', description: 'Default light theme', icon: '☀️' },
    { id: 'dark', label: 'Dark', description: 'Dark mode for low light', icon: '🌙' },
    { id: 'auto', label: 'Auto', description: 'Follow system settings', icon: '🔄' },
    { id: 'custom', label: 'Custom Color Palette', description: 'Customize colors for accessibility', icon: '🎨' },
]

// Color calibration test patterns for color blind users
const colorTestPatterns = [
    { id: 'protanopia', label: 'Red-Green (Protanopia)', description: 'Test for red color blindness' },
    { id: 'deuteranopia', label: 'Red-Green (Deuteranopia)', description: 'Test for green color blindness' },
    { id: 'tritanopia', label: 'Blue-Yellow (Tritanopia)', description: 'Test for blue color blindness' },
]

export function ChangeThemeSettingsScreen({ onNavigate, onBack, hideBottomNav = true }: ChangeThemeSettingsScreenProps) {
    const [selectedTheme, setSelectedTheme] = useState('light')
    const [showColorCalibration, setShowColorCalibration] = useState(false)
    const [hueShift, setHueShift] = useState(0)
    const [saturation, setSaturation] = useState(100)
    const [brightness, setBrightness] = useState(100)
    const [selectedTest, setSelectedTest] = useState<string | null>(null)

    const handleCustomThemeClick = () => {
        setSelectedTheme('custom')
        setShowColorCalibration(true)
    }

    const applyColorFilter = () => {
        // Apply CSS filter to simulate/adjust colors
        const filter = `hue-rotate(${hueShift}deg) saturate(${saturation}%) brightness(${brightness}%)`
        document.documentElement.style.setProperty('--color-filter', filter)
        // In a real app, this would save to user preferences
        console.log('Color filter applied:', { hueShift, saturation, brightness })
    }

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
                <h1 className="text-xl font-bold text-white">Change Theme</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white px-6 py-4">
                <div className="space-y-3">
                    {themeOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => {
                                if (option.id === 'custom') {
                                    handleCustomThemeClick()
                                } else {
                                    setSelectedTheme(option.id)
                                    setShowColorCalibration(false)
                                }
                            }}
                            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                selectedTheme === option.id
                                    ? 'border-primary bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{option.icon}</span>
                                    <div className="flex flex-col">
                                        <span className={`text-base font-semibold ${
                                            selectedTheme === option.id ? 'text-primary' : 'text-text-dark'
                                        }`}>
                                            {option.label}
                                        </span>
                                        <span className="text-sm text-gray-500">{option.description}</span>
                                    </div>
                                </div>
                                {selectedTheme === option.id && (
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

                {/* Color Calibration Overlay */}
                {showColorCalibration && (
                    <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-text-dark">Color Calibration</h2>
                                <button
                                    onClick={() => setShowColorCalibration(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-6">
                                Adjust colors to improve visibility and distinguishability for color vision differences.
                            </p>

                            {/* Color Test Patterns */}
                            <div className="mb-6">
                                <h3 className="text-base font-semibold text-text-dark mb-3">Color Vision Tests</h3>
                                <div className="space-y-2">
                                    {colorTestPatterns.map((test) => (
                                        <button
                                            key={test.id}
                                            onClick={() => setSelectedTest(test.id)}
                                            className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                                                selectedTest === test.id
                                                    ? 'border-primary bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    <div className="w-8 h-8 rounded bg-red-500"></div>
                                                    <div className="w-8 h-8 rounded bg-green-500"></div>
                                                    <div className="w-8 h-8 rounded bg-blue-500"></div>
                                                    <div className="w-8 h-8 rounded bg-yellow-500"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-text-dark">{test.label}</p>
                                                    <p className="text-xs text-gray-500">{test.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Adjustment Controls */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-semibold text-text-dark">Hue Shift</label>
                                        <span className="text-sm text-gray-600">{hueShift}°</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={hueShift}
                                        onChange={(e) => setHueShift(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-semibold text-text-dark">Saturation</label>
                                        <span className="text-sm text-gray-600">{saturation}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={saturation}
                                        onChange={(e) => setSaturation(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-semibold text-text-dark">Brightness</label>
                                        <span className="text-sm text-gray-600">{brightness}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={brightness}
                                        onChange={(e) => setBrightness(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm font-semibold text-text-dark mb-3">Preview</p>
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="aspect-square rounded-lg bg-red-500"></div>
                                    <div className="aspect-square rounded-lg bg-green-500"></div>
                                    <div className="aspect-square rounded-lg bg-blue-500"></div>
                                    <div className="aspect-square rounded-lg bg-yellow-500"></div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setHueShift(0)
                                        setSaturation(100)
                                        setBrightness(100)
                                    }}
                                    className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-text-dark font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => {
                                        applyColorFilter()
                                        setShowColorCalibration(false)
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
