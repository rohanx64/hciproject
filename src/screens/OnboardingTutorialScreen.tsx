import { useState, useEffect } from 'react'

interface OnboardingTutorialScreenProps {
    onComplete: () => void
}

interface TutorialSlide {
    id: number
    title: string
    description: string
    illustration: React.ReactNode
    icon: string
}

const slides: TutorialSlide[] = [
    {
        id: 1,
        title: 'Request Ride',
        description: 'Simply tap to request a ride from anywhere, anytime',
        icon: '🚗',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                {/* City Skyline Background */}
                <div className="absolute inset-0 flex items-end justify-center">
                    <svg className="w-full h-32" viewBox="0 0 440 100" preserveAspectRatio="none">
                        <path d="M0,100 L0,70 L30,70 L30,50 L60,50 L60,80 L90,80 L90,40 L120,40 L120,90 L150,90 L150,60 L180,60 L180,100 L210,100 L210,30 L240,30 L240,70 L270,70 L270,50 L300,50 L300,85 L330,85 L330,45 L360,45 L360,75 L390,75 L390,35 L420,35 L420,100 L440,100 Z" fill="#e5e7eb" opacity="0.3" />
                    </svg>
                </div>
                
                {/* Phone with App */}
                <div className="relative z-10">
                    <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                            {/* Phone Status Bar */}
                            <div className="h-6 bg-primary flex items-center justify-between px-3">
                                <span className="text-[8px] text-white font-semibold">9:41</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-1.5 bg-white rounded-sm" />
                                    <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                            </div>
                            
                            {/* App Content */}
                            <div className="p-3 h-full bg-gradient-to-b from-primary to-primary-dark">
                                {/* Green Circle with AIR */}
                                <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-3 flex items-center justify-center shadow-lg animate-pulse">
                                    <span className="text-white font-bold text-lg">AIR</span>
                                </div>
                                
                                {/* Chat Bubble */}
                                <div className="bg-white/90 rounded-2xl p-3 mb-2 shadow-md">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Car Icon */}
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 animate-bounce">
                        <svg className="w-16 h-16 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                        </svg>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 2,
        title: 'Confirm Your Driver',
        description: 'Review driver details and ratings before confirming your ride',
        icon: '⭐',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                {/* City Skyline Background */}
                <div className="absolute inset-0 flex items-end justify-center">
                    <svg className="w-full h-32" viewBox="0 0 440 100" preserveAspectRatio="none">
                        <path d="M0,100 L0,70 L30,70 L30,50 L60,50 L60,80 L90,80 L90,40 L120,40 L120,90 L150,90 L150,60 L180,60 L180,100 L210,100 L210,30 L240,30 L240,70 L270,70 L270,50 L300,50 L300,85 L330,85 L330,45 L360,45 L360,75 L390,75 L390,35 L420,35 L420,100 L440,100 Z" fill="#e5e7eb" opacity="0.3" />
                    </svg>
                </div>
                
                {/* Phone with Driver Card */}
                <div className="relative z-10">
                    <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                            {/* Phone Status Bar */}
                            <div className="h-6 bg-primary flex items-center justify-between px-3">
                                <span className="text-[8px] text-white font-semibold">9:41</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-1.5 bg-white rounded-sm" />
                                    <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                            </div>
                            
                            {/* App Content */}
                            <div className="p-3 h-full bg-gray-50 flex flex-col items-center justify-center">
                                {/* Driver Card */}
                                <div className="bg-white rounded-2xl p-4 shadow-lg w-full animate-slide-up">
                                    {/* Stars */}
                                    <div className="flex justify-center gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className="w-5 h-5 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    
                                    {/* Confirm Button */}
                                    <button className="w-full py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors animate-pulse">
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 3,
        title: 'Track Your Ride',
        description: 'Watch your ride arrive in real-time on the map',
        icon: '📍',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                {/* City Skyline Background */}
                <div className="absolute inset-0 flex items-end justify-center">
                    <svg className="w-full h-32" viewBox="0 0 440 100" preserveAspectRatio="none">
                        <path d="M0,100 L0,70 L30,70 L30,50 L60,50 L60,80 L90,80 L90,40 L120,40 L120,90 L150,90 L150,60 L180,60 L180,100 L210,100 L210,30 L240,30 L240,70 L270,70 L270,50 L300,50 L300,85 L330,85 L330,45 L360,45 L360,75 L390,75 L390,35 L420,35 L420,100 L440,100 Z" fill="#e5e7eb" opacity="0.3" />
                    </svg>
                </div>
                
                {/* Phone with Map */}
                <div className="relative z-10">
                    <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                            {/* Phone Status Bar */}
                            <div className="h-6 bg-primary flex items-center justify-between px-3">
                                <span className="text-[8px] text-white font-semibold">9:41</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-1.5 bg-white rounded-sm" />
                                    <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                            </div>
                            
                            {/* Map Content */}
                            <div className="p-3 h-full bg-gray-100 relative overflow-hidden">
                                {/* Map Pattern */}
                                <div className="absolute inset-0 opacity-20">
                                    <svg className="w-full h-full" viewBox="0 0 200 200">
                                        <defs>
                                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#grid)" />
                                    </svg>
                                </div>
                                
                                {/* Map Pin */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
                                    <svg className="w-12 h-12 text-red-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    {/* AIR Badge on Pin */}
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-[8px] text-white font-bold">AIR</span>
                                    </div>
                                </div>
                                
                                {/* Car Icon */}
                                <div className="absolute top-1/3 left-1/4 animate-pulse">
                                    <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
]

export function OnboardingTutorialScreen({ onComplete }: OnboardingTutorialScreenProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Simulate background loading
    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false)
        }, 2000) // 2 seconds for initial loading

        return () => clearTimeout(loadingTimer)
    }, [])

    // Auto-advance slides
    useEffect(() => {
        if (isLoading) return

        const timer = setTimeout(() => {
            if (currentSlide < slides.length - 1) {
                setIsAnimating(true)
                setTimeout(() => {
                    setCurrentSlide(currentSlide + 1)
                    setIsAnimating(false)
                }, 300)
            }
        }, 3000) // 3 seconds per slide

        return () => clearTimeout(timer)
    }, [currentSlide, isLoading])

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentSlide(currentSlide + 1)
                setIsAnimating(false)
            }, 300)
        } else {
            onComplete()
        }
    }

    const handleSkip = () => {
        onComplete()
    }

    const slide = slides[currentSlide]
    const progress = ((currentSlide + 1) / slides.length) * 100

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 px-6 py-2 flex items-center justify-between z-10">
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
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-primary via-primary to-primary-dark" />

            {/* Skip Button */}
            {!isLoading && (
                <button
                    onClick={handleSkip}
                    className="absolute top-12 right-6 z-20 px-4 py-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
                >
                    Skip
                </button>
            )}

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-8">
                {/* Illustration Container */}
                <div className="flex-1 flex items-center justify-center w-full mb-8">
                    <div
                        className={`w-full max-w-sm transition-all duration-500 ease-in-out ${
                            isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
                        }`}
                        key={currentSlide}
                    >
                        {slide.illustration}
                    </div>
                </div>

                {/* Text Content */}
                <div
                    className={`text-center mb-8 transition-all duration-500 ${
                        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
                >
                    <div className="mb-4">
                        <span className="text-5xl">{slide.icon}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">{slide.title}</h1>
                    <p className="text-lg text-white/90 max-w-sm mx-auto">{slide.description}</p>
                </div>

                {/* Progress Indicator */}
                <div className="w-full max-w-xs mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    index === currentSlide
                                        ? 'w-8 bg-white'
                                        : index < currentSlide
                                        ? 'w-2 bg-white/60'
                                        : 'w-2 bg-white/30'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Action Button */}
                {!isLoading && (
                    <button
                        onClick={handleNext}
                        className={`w-full max-w-xs py-4 rounded-full bg-white text-primary font-extrabold text-lg uppercase tracking-wide shadow-2xl hover:bg-gray-50 active:scale-95 transition-all duration-200 ${
                            isAnimating ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        {currentSlide === slides.length - 1 ? 'Get Started!' : 'Next'}
                    </button>
                )}

                {/* Loading Indicator (shown during initial load) */}
                {isLoading && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        <p className="text-white/80 text-sm">Setting up your account...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

