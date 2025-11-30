import { useState } from 'react'
import { AppIcon } from '../components/AppIcon'
import { useLanguage } from '../contexts/LanguageContext'
import { MessageScreen } from './MessageScreen'

interface HelpSupportScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
    onStartTutorial?: () => void
}

export function HelpSupportScreen({ onNavigate, onBack, onStartTutorial }: HelpSupportScreenProps) {
    const { t } = useLanguage()
    const [showLiveChat, setShowLiveChat] = useState(false)

    if (showLiveChat) {
        return (
            <MessageScreen
                onNavigate={onNavigate}
                onClose={() => setShowLiveChat(false)}
                contactName="AIR Support"
                serviceType="ride"
            />
        )
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
                <h1 className="text-xl font-bold text-white">{t('Help & Support')}</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
                <div className="space-y-4">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <AppIcon name="❓" className="text-3xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">How can we help?</h2>
                                <p className="text-white/90">We're here to assist you 24/7</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Options */}
                    <div className="space-y-4">
                        {/* Tutorial Option */}
                        <button
                            onClick={() => {
                                if (onStartTutorial) {
                                    onStartTutorial()
                                } else if (onNavigate) {
                                    // Store that we're coming from help support
                                    onNavigate('onboardingTutorial')
                                }
                            }}
                            className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                                    <AppIcon name="📚" className="text-3xl text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-text-dark mb-1">Go Through Tutorial</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Learn how to use AIR step-by-step. See how to book rides, send deliveries, rent vehicles, and shop.
                                    </p>
                                </div>
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        {/* Live Chat Option */}
                        <button
                            onClick={() => setShowLiveChat(true)}
                            className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                                    <AppIcon name="💬" className="text-3xl text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-text-dark mb-1">Chat with AIR Representative</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Get instant help from our support team. Ask questions, report issues, or get assistance with your bookings.
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-green-600 font-semibold">Available 24/7</span>
                                    </div>
                                </div>
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Quick Help Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-text-dark mb-4">Quick Help</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => onNavigate?.('callBykea')}
                                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 text-center"
                            >
                                <AppIcon name="📞" className="text-2xl mb-2" />
                                <p className="text-sm font-semibold text-text-dark">{t('Call AIR')}</p>
                            </button>
                            <button
                                onClick={() => onNavigate?.('contactUs')}
                                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 text-center"
                            >
                                <AppIcon name="📧" className="text-2xl mb-2" />
                                <p className="text-sm font-semibold text-text-dark">{t('Contact Us')}</p>
                            </button>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-text-dark mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <h4 className="text-base font-semibold text-text-dark mb-1">How do I book a ride?</h4>
                                <p className="text-sm text-gray-600">
                                    Tap on the Ride tab, enter your destination, select a vehicle, and confirm. Your driver will arrive shortly!
                                </p>
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <h4 className="text-base font-semibold text-text-dark mb-1">Can I pay with cash?</h4>
                                <p className="text-sm text-gray-600">
                                    Yes! You can choose cash or digital payment when booking. Half-pay and full-pay options are available.
                                </p>
                            </div>
                            <div className="pb-4">
                                <h4 className="text-base font-semibold text-text-dark mb-1">How do I track my delivery?</h4>
                                <p className="text-sm text-gray-600">
                                    After confirming your delivery, you'll see a real-time map showing your package's location and estimated arrival time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
