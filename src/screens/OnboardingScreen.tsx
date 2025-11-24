import { useEffect, useState } from 'react'
import { Overlay } from '../components/Overlay'
import { useTheme, type ThemeOption } from '../contexts/ThemeContext'
import { useTextSize } from '../contexts/TextSizeContext'
import type { TextSizeOption } from '../contexts/TextSizeContext'

interface OnboardingScreenProps {
    onComplete: (data: {
        name: string
        email: string
        language: string
        theme: string
        fontSize: string
        voiceFeedback: boolean
    }) => void
}

const languages = [
    { id: 'english', label: 'English', code: 'EN', flag: '🇬🇧' },
    { id: 'urdu', label: 'اردو', code: 'UR', flag: '🇵🇰' },
    { id: 'punjabi', label: 'پنجابی', code: 'PA', flag: '🇵🇰' },
    { id: 'pashto', label: 'پښتو', code: 'PS', flag: '🇵🇰' },
    { id: 'sindhi', label: 'سنڌي', code: 'SD', flag: '🇵🇰' },
    { id: 'balochi', label: 'بلوچی', code: 'BL', flag: '🇵🇰' },
    { id: 'siraiki', label: 'سرائیکی', code: 'SK', flag: '🇵🇰' },
]

const themes = [
    { id: 'light', label: 'Light', description: 'Default light theme', icon: '☀️' },
    { id: 'dark', label: 'Dark', description: 'Dark mode for low light', icon: '🌙' },
    { id: 'auto', label: 'Auto', description: 'Follow system settings', icon: '🔄' },
    { id: 'custom', label: 'Custom Color Palette', description: 'Adjust colors for accessibility', icon: '🎨' },
]

const fontSizes: { id: TextSizeOption; label: string; size: string }[] = [
    { id: 'small', label: 'Small', size: 'text-sm' },
    { id: 'medium', label: 'Medium', size: 'text-base' },
    { id: 'large', label: 'Large', size: 'text-lg' },
    { id: 'extraLarge', label: 'Extra Large', size: 'text-xl' },
]

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [selectedLanguage, setSelectedLanguage] = useState('english')
    const { theme, setTheme, customTheme, updateCustomTheme } = useTheme()
    const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(theme)
    const [voiceFeedback, setVoiceFeedback] = useState(false)
    const [showColorCalibration, setShowColorCalibration] = useState(false)
    const [hueShift, setHueShift] = useState(customTheme.hueShift)
    const [saturation, setSaturation] = useState(customTheme.saturation)
    const [brightness, setBrightness] = useState(customTheme.brightness)
    const [colorBlindnessFilter, setColorBlindnessFilter] = useState('none')
    const { selectedSize: selectedFontSize, setSelectedSize: setTextSize } = useTextSize()

    useEffect(() => {
        setSelectedTheme(theme)
    }, [theme])

    useEffect(() => {
        setHueShift(customTheme.hueShift)
        setSaturation(customTheme.saturation)
        setBrightness(customTheme.brightness)
    }, [customTheme])

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1)
        } else {
            // Complete onboarding
            onComplete({
                name,
                email,
                language: selectedLanguage,
                theme: selectedTheme,
                fontSize: selectedFontSize,
                voiceFeedback,
            })
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const canProceed = () => {
        switch (step) {
            case 1:
                return name.trim().length > 0
            case 2:
                return email.trim().length > 0 && email.includes('@')
            case 3:
            case 4:
            case 5:
                return true
            default:
                return false
        }
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 px-6 py-2 flex items-center justify-between z-10 bg-primary">
                <span className="text-white font-semibold">9:41</span>
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="w-6 h-3 border-2 border-white rounded-sm">
                        <div className="w-full h-full bg-white rounded-sm" style={{ width: '70%' }} />
                    </div>
                </div>
            </div>

            {/* Green Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-primary" />

            {/* Content */}
            <div className="relative z-20 mt-16 flex-1 bg-white rounded-t-[40px] px-6 pt-8 pb-6 flex flex-col overflow-y-auto">
                {/* Progress Indicator */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500">Step {step} of 5</span>
                        <span className="text-sm font-semibold text-gray-500">{Math.round((step / 5) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(step / 5) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step 1: Name */}
                {step === 1 && (
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold text-text-dark mb-2">What's your name?</h1>
                        <p className="text-base text-gray-600 mb-6">
                            We'll use this to personalize your experience
                        </p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none mb-6"
                            autoFocus
                        />
                    </div>
                )}

                {/* Step 2: Email */}
                {step === 2 && (
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold text-text-dark mb-2">What's your email?</h1>
                        <p className="text-base text-gray-600 mb-6">
                            We'll use this for account recovery and notifications
                        </p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none mb-6"
                            autoFocus
                        />
                    </div>
                )}

                {/* Step 3: Language */}
                {step === 3 && (
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold text-text-dark mb-2">Choose your language</h1>
                        <p className="text-base text-gray-600 mb-6">
                            Select your preferred language for the app
                        </p>
                        <div className="space-y-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                        selectedLanguage === lang.id
                                            ? 'border-primary bg-green-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl">{lang.flag}</span>
                                            <div className="flex flex-col">
                                                <span className={`text-base font-semibold ${
                                                    selectedLanguage === lang.id ? 'text-primary' : 'text-text-dark'
                                                }`}>
                                                    {lang.label}
                                                </span>
                                                <span className="text-sm text-gray-500">{lang.code}</span>
                                            </div>
                                        </div>
                                        {selectedLanguage === lang.id && (
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
                    </div>
                )}

                {/* Step 4: Theme & Font Size */}
                {step === 4 && (
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold text-text-dark mb-2">Customize your experience</h1>
                        <p className="text-base text-gray-600 mb-6">
                            Choose your theme and text size
                        </p>

                        {/* Theme Selection */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-text-dark mb-3">Theme</h2>
                            <div className="space-y-3">
                                {themes.map((themeOption) => (
                                    <button
                                        key={themeOption.id}
                                        onClick={() => {
                                            const option = themeOption.id as ThemeOption
                                            setSelectedTheme(option)
                                            if (option === 'custom') {
                                                setHueShift(customTheme.hueShift)
                                                setSaturation(customTheme.saturation)
                                                setBrightness(customTheme.brightness)
                                                setShowColorCalibration(true)
                                            } else {
                                                setTheme(option)
                                                setShowColorCalibration(false)
                                            }
                                        }}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                            selectedTheme === themeOption.id
                                                ? 'border-primary bg-green-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl">{themeOption.icon}</span>
                                                <div className="flex flex-col">
                                                    <span className={`text-base font-semibold ${
                                                        selectedTheme === themeOption.id ? 'text-primary' : 'text-text-dark'
                                                    }`}>
                                                        {themeOption.label}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{themeOption.description}</span>
                                                </div>
                                            </div>
                                            {selectedTheme === themeOption.id && (
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
                        </div>

                        {/* Font Size Selection */}
                        <div>
                            <h2 className="text-lg font-semibold text-text-dark mb-3">Text Size</h2>
                            <div className="space-y-3">
                                {fontSizes.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => setTextSize(size.id)}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                            selectedFontSize === size.id
                                                ? 'border-primary bg-green-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`${size.size} font-semibold ${
                                                selectedFontSize === size.id ? 'text-primary' : 'text-text-dark'
                                            }`}>
                                                {size.label} - Sample Text
                                            </span>
                                            {selectedFontSize === size.id && (
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
                        </div>
                    </div>
                )}

                {/* Step 5: Voice Feedback */}
                {step === 5 && (
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold text-text-dark mb-2">Voice Feedback</h1>
                        <p className="text-base text-gray-600 mb-6">
                            Enable voice announcements for better accessibility
                        </p>

                        <div className="bg-green-50 rounded-2xl p-6 border-2 border-primary/20 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
                                            <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z" />
                                            <path d="M12 18.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-3 0v-3a1.5 1.5 0 011.5-1.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-dark">Enable Voice Feedback</h3>
                                        <p className="text-sm text-gray-600">
                                            Hear audio announcements for app interactions
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setVoiceFeedback(!voiceFeedback)}
                                    className={`relative inline-flex h-10 w-18 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        voiceFeedback ? 'bg-primary focus:ring-primary' : 'bg-gray-300 focus:ring-gray-400'
                                    }`}
                                    role="switch"
                                    aria-checked={voiceFeedback}
                                >
                                    <span
                                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                                            voiceFeedback ? 'translate-x-9' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            {voiceFeedback && (
                                <div className="mt-4 p-4 bg-white rounded-xl">
                                    <p className="text-sm text-gray-700">
                                        Voice feedback will help you navigate the app using audio cues. You can adjust settings later in the app.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-6">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 py-4 rounded-full border-2 border-gray-300 bg-white text-base font-semibold text-text-dark hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={`flex-1 py-4 rounded-full text-base font-semibold text-white transition-all duration-200 ${
                            canProceed()
                                ? 'bg-primary hover:bg-primary-dark active:scale-95 shadow-lg'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {step === 5 ? 'Get Started' : 'Next'}
                    </button>
                </div>
            </div>

            {/* Color Calibration Overlay */}
            {showColorCalibration && (
                <Overlay>
                    <div className="w-[360px] max-h-[90vh] rounded-[24px] border-2 border-primary/20 bg-white p-6 text-text-dark shadow-2xl overflow-y-auto">
                        <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide text-primary">
                            Color Calibration
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Adjust colors for better visibility, especially for color blindness.
                        </p>

                        {/* Color Blindness Filters */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-text-dark mb-2">Color Vision Test</label>
                            <select
                                value={colorBlindnessFilter}
                                onChange={(e) => setColorBlindnessFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="none">None</option>
                                <option value="protanopia">Protanopia (Red-Green)</option>
                                <option value="deuteranopia">Deuteranopia (Red-Green)</option>
                                <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
                            </select>
                        </div>

                        {/* Hue Slider */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-text-dark mb-2">Hue Shift: {hueShift}°</label>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                value={hueShift}
                                onChange={(e) => setHueShift(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Saturation Slider */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-text-dark mb-2">Saturation: {saturation}%</label>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={saturation}
                                onChange={(e) => setSaturation(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Brightness Slider */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-text-dark mb-2">Brightness: {brightness}%</label>
                            <input
                                type="range"
                                min="50"
                                max="150"
                                value={brightness}
                                onChange={(e) => setBrightness(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm font-semibold text-text-dark mb-3">Preview</p>
                            <div
                                className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden p-2 bg-white/90"
                                style={{
                                    filter: `hue-rotate(${hueShift}deg) saturate(${saturation}%) brightness(${brightness}%)`,
                                }}
                            >
                                <div className="aspect-square rounded-lg bg-red-500"></div>
                                <div className="aspect-square rounded-lg bg-green-500"></div>
                                <div className="aspect-square rounded-lg bg-blue-500"></div>
                                <div className="aspect-square rounded-lg bg-yellow-500"></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setHueShift(0)
                                    setSaturation(100)
                                    setBrightness(100)
                                    setColorBlindnessFilter('none')
                                }}
                                className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-sm font-semibold text-text-dark hover:bg-gray-50"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => {
                                    updateCustomTheme({
                                        hueShift,
                                        saturation,
                                        brightness,
                                    })
                                    setTheme('custom')
                                    setSelectedTheme('custom')
                                    setShowColorCalibration(false)
                                }}
                                className="flex-1 py-3 rounded-full bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
                            >
                                Apply
                            </button>
                        </div>
                        <button
                            onClick={() => setShowColorCalibration(false)}
                            className="w-full mt-4 py-3 rounded-full border-2 border-primary bg-white text-center font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white"
                        >
                            Done
                        </button>
                    </div>
                </Overlay>
            )}
        </div>
    )
}

