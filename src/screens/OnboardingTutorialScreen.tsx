import { useState, useEffect } from 'react'
import { AppIcon } from '../components/AppIcon'
import { useLanguage } from '../contexts/LanguageContext'

interface OnboardingTutorialScreenProps {
    onComplete: () => void
}

interface TutorialSlide {
    id: number
    title: string
    description: string
    illustration: React.ReactNode
    icon: string
    flowStep?: string
}

const slides: TutorialSlide[] = [
    {
        id: 1,
        title: 'Welcome to AIR',
        description: 'Your all-in-one transportation and delivery app. Book rides, send packages, rent vehicles, and shop - all in one place.',
        icon: '🚀',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-b from-primary to-primary-dark rounded-[24px] overflow-hidden relative flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-2xl mb-4">
                            <div className="text-center">
                                <div className="text-3xl font-extrabold text-white mb-1">AIR</div>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white text-center px-4">Your Ride, Your Way</h2>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 2,
        title: 'Book a Ride',
        description: 'Start by selecting your destination. Tap the "Where to?" field to enter your drop-off location. You can choose from recent locations or search for a new one.',
        icon: '🚗',
        flowStep: 'home',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                        <div className="h-6 bg-primary flex items-center justify-between px-3">
                            <span className="text-[8px] text-white font-semibold">9:41</span>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-1.5 bg-white rounded-sm" />
                            </div>
                        </div>
                        <div className="p-3 h-full bg-gray-50">
                            {/* Map background */}
                            <div className="absolute inset-0 bg-gray-200 opacity-30" />
                            
                            {/* Bottom panel */}
                            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-3 shadow-lg">
                                <h3 className="text-lg font-extrabold text-primary mb-2">Ride</h3>
                                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3 mb-2">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">DROP-OFF</p>
                                    <p className="text-xs text-gray-700">Where to?</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-primary text-white text-xs py-2 rounded-xl font-semibold">Quick Book</button>
                                    <button className="px-3 py-2 bg-gray-100 rounded-xl">
                                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
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
        title: 'Select Your Vehicle',
        description: 'After choosing your destination, select your preferred vehicle type - Bike, Car, Auto, or Plus. Review the fare and payment method, then tap "Apply" to confirm.',
        icon: '🚙',
        flowStep: 'selectVehicle',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                        <div className="h-6 bg-primary flex items-center justify-between px-3">
                            <span className="text-[8px] text-white font-semibold">9:41</span>
                        </div>
                        <div className="p-3 h-full bg-gray-50 overflow-y-auto">
                            <div className="space-y-2">
                                <div className="bg-white rounded-xl p-3 border-2 border-primary shadow-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold">Bike</span>
                                        <span className="text-xs font-bold text-primary">RS. 150</span>
                                    </div>
                                    <div className="text-[8px] text-gray-500">Fastest option</div>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold">Car</span>
                                        <span className="text-xs font-bold text-gray-600">RS. 300</span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold">Auto</span>
                                        <span className="text-xs font-bold text-gray-600">RS. 200</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-4 bg-primary text-white text-xs py-2.5 rounded-xl font-semibold shadow-lg">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 4,
        title: 'Track Your Ride',
        description: 'Once confirmed, watch your driver arrive in real-time on the map. You\'ll see their location, estimated arrival time, and can contact them via call or chat.',
        icon: '📍',
        flowStep: 'rideStarted',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                        <div className="h-6 bg-primary flex items-center justify-between px-3">
                            <span className="text-[8px] text-white font-semibold">9:41</span>
                        </div>
                        <div className="h-full bg-gray-100 relative">
                            {/* Map pattern */}
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
                            
                            {/* Pickup pin */}
                            <div className="absolute top-1/3 left-1/3">
                                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            </div>
                            
                            {/* Dropoff pin */}
                            <div className="absolute bottom-1/3 right-1/3">
                                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            </div>
                            
                            {/* Driver car */}
                            <div className="absolute top-1/2 left-1/2 animate-pulse">
                                <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                                </svg>
                            </div>
                            
                            {/* Driver info card */}
                            <div className="absolute bottom-4 left-3 right-3 bg-white rounded-2xl p-3 shadow-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">D</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Driver Name</p>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-[8px] text-gray-600">5.0</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-primary text-white text-[8px] py-1.5 rounded-lg font-semibold">Call</button>
                                    <button className="flex-1 bg-gray-100 text-gray-700 text-[8px] py-1.5 rounded-lg font-semibold">Chat</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 5,
        title: 'Send a Delivery',
        description: 'Need to send something? Go to Delivery tab, select pickup and delivery locations, enter parcel details, choose payment method, and confirm. Track your package in real-time!',
        icon: '📦',
        flowStep: 'delivery',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                        <div className="h-6 bg-[#ff9500] flex items-center justify-between px-3">
                            <span className="text-[8px] text-white font-semibold">9:41</span>
                        </div>
                        <div className="p-3 h-full bg-gray-50">
                            <h3 className="text-lg font-extrabold text-[#ff9500] mb-3">Delivery</h3>
                            <div className="space-y-2 mb-3">
                                <div className="bg-white rounded-xl p-3 border-2 border-orange-200">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">PICKUP</p>
                                    <p className="text-xs text-gray-700">My current location</p>
                                </div>
                                <div className="bg-white rounded-xl p-3 border-2 border-orange-200">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">DELIVERY</p>
                                    <p className="text-xs text-gray-700">Enter delivery address</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 mb-3">
                                <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">PARCEL DETAILS</p>
                                <input className="w-full text-xs border border-gray-200 rounded-lg p-2" placeholder="What are you sending?" />
                            </div>
                            <button className="w-full bg-[#ff9500] text-white text-xs py-2.5 rounded-xl font-semibold">Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 6,
        title: 'Rent a Vehicle',
        description: 'Need a vehicle for hours? Select Rentals, choose your pickup location, select rental duration (hours), pick a vehicle type, review fare, and confirm. Perfect for longer trips!',
        icon: '⏰',
        flowStep: 'rentals',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                        <div className="h-6 bg-[#ffd900] flex items-center justify-between px-3">
                            <span className="text-[8px] text-white font-semibold">9:41</span>
                        </div>
                        <div className="p-3 h-full bg-gray-50">
                            <h3 className="text-lg font-extrabold text-[#ffd900] mb-3">Rentals</h3>
                            <div className="bg-white rounded-xl p-3 mb-3 border-2 border-yellow-200">
                                <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">PICKUP LOCATION</p>
                                <p className="text-xs text-gray-700">My current location</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 mb-3">
                                <p className="text-[8px] font-bold text-gray-500 uppercase mb-2">SELECT HOURS</p>
                                <div className="flex gap-2">
                                    {[2, 4, 6, 8].map((h) => (
                                        <button key={h} className={`flex-1 py-2 rounded-lg text-xs font-semibold ${h === 2 ? 'bg-[#ffd900] text-white' : 'bg-gray-100 text-gray-700'}`}>
                                            {h}h
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 mb-3">
                                <p className="text-[8px] font-bold text-gray-500 uppercase mb-2">SELECT VEHICLE</p>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-gray-100 rounded-lg text-xs font-semibold">Bike</button>
                                    <button className="flex-1 py-2 bg-gray-100 rounded-lg text-xs font-semibold">Car</button>
                                </div>
                            </div>
                            <button className="w-full bg-[#ffd900] text-white text-xs py-2.5 rounded-xl font-semibold">Confirm Rental</button>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 7,
        title: 'Shop & Order',
        description: 'Browse shops by category (Food, Pharmacy, Grocery, etc.), select items, choose delivery location, review order and fare, then confirm. Your order will be delivered to your door!',
        icon: '🛍️',
        flowStep: 'shops',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                        <div className="h-6 bg-[#3b82f6] flex items-center justify-between px-3">
                            <span className="text-[8px] text-white font-semibold">9:41</span>
                        </div>
                        <div className="p-3 h-full bg-gray-50">
                            <h3 className="text-lg font-extrabold text-[#3b82f6] mb-3">Shops</h3>
                            <div className="mb-3">
                                <p className="text-[8px] font-bold text-gray-500 uppercase mb-2">CATEGORIES</p>
                                <div className="flex gap-2 flex-wrap">
                                    {['Food', 'Pharmacy', 'Grocery', 'Bakery'].map((cat) => (
                                        <button key={cat} className="px-3 py-1.5 bg-white rounded-full text-[8px] font-semibold border border-gray-200">
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold">Restaurant Name</p>
                                        <p className="text-[8px] text-gray-500">Fast Food • 4.5⭐</p>
                                    </div>
                                </div>
                                <button className="w-full bg-[#3b82f6] text-white text-xs py-2 rounded-lg font-semibold">View Menu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 8,
        title: 'Voice Commands',
        description: 'Use voice commands for hands-free booking! Tap the microphone button and say "Book a ride from [location] to [destination]" or "Send a delivery to [address]". The app will understand and book for you!',
        icon: '🎤',
        flowStep: 'voice',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                        <div className="h-6 bg-primary flex items-center justify-between px-3">
                            <span className="text-[8px] text-white font-semibold">9:41</span>
                        </div>
                        <div className="h-full bg-gradient-to-b from-primary to-primary-dark flex flex-col items-center justify-center p-6">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center mb-6 animate-pulse">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
                                    <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z" />
                                    <path d="M12 18.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-3 0v-3a1.5 1.5 0 011.5-1.5z" />
                                </svg>
                            </div>
                            <div className="bg-white/90 rounded-2xl p-4 w-full">
                                <div className="flex gap-1 justify-center mb-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <p className="text-xs text-center text-gray-700 font-semibold">Listening...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 9,
        title: 'You\'re All Set!',
        description: 'You now know how to use AIR! Start by booking a ride, sending a delivery, renting a vehicle, or shopping. Need help? Access the tutorial anytime from Help & Support in the sidebar.',
        icon: '✅',
        illustration: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-80 bg-gray-800 rounded-[32px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-b from-primary to-primary-dark rounded-[24px] overflow-hidden relative flex flex-col items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center mb-6 animate-bounce">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white text-center mb-2">Ready to Go!</h2>
                        <p className="text-sm text-white/90 text-center px-4">Start exploring AIR now</p>
                    </div>
                </div>
            </div>
        ),
    },
]

export function OnboardingTutorialScreen({ onComplete }: OnboardingTutorialScreenProps) {
    const { t } = useLanguage()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Simulate background loading
    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(loadingTimer)
    }, [])

    // Auto-advance slides (optional - can be disabled)
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
        }, 4000) // 4 seconds per slide

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

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentSlide(currentSlide - 1)
                setIsAnimating(false)
            }, 300)
        }
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
                    {t('Skip')}
                </button>
            )}

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-8">
                {/* Illustration Container */}
                <div className="flex-1 flex items-center justify-center w-full mb-6">
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
                    className={`text-center mb-6 transition-all duration-500 ${
                        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
                >
                    <div className="mb-4">
                        <AppIcon name={slide.icon} className="text-5xl text-white drop-shadow-lg" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">{slide.title}</h1>
                    <p className="text-lg text-white/90 max-w-sm mx-auto leading-relaxed">{slide.description}</p>
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
                    <p className="text-center text-white/80 text-sm mt-2">
                        {currentSlide + 1} / {slides.length}
                    </p>
                </div>

                {/* Navigation Buttons */}
                {!isLoading && (
                    <div className="flex gap-3 w-full max-w-xs">
                        {currentSlide > 0 && (
                            <button
                                onClick={handlePrevious}
                                className={`flex-1 py-3 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 active:scale-95 transition-all duration-200 ${
                                    isAnimating ? 'opacity-0' : 'opacity-100'
                                }`}
                            >
                                {t('Back')}
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`flex-1 py-3 rounded-full bg-white text-primary font-extrabold text-lg uppercase tracking-wide shadow-2xl hover:bg-gray-50 active:scale-95 transition-all duration-200 ${
                                isAnimating ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            {currentSlide === slides.length - 1 ? t('Get Started') : t('Next')}
                        </button>
                    </div>
                )}

                {/* Loading Indicator (shown during initial load) */}
                {isLoading && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        <p className="text-white/80 text-sm">{t('Loading...')}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
