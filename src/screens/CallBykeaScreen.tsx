import { useState } from 'react'

interface CallBykeaScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

export function CallBykeaScreen({ onNavigate, onBack, hideBottomNav = true }: CallBykeaScreenProps) {
    const [isCalling, setIsCalling] = useState(false)

    const handleCall = () => {
        setIsCalling(true)
        // Simulate calling
        setTimeout(() => {
            // In a real app, this would initiate a phone call
            window.location.href = 'tel:+923001234567'
            setIsCalling(false)
        }, 1000)
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
                <h1 className="text-xl font-bold text-white">Call Bykea</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white flex flex-col items-center justify-center px-6 py-8">
                <div className="text-center space-y-6 max-w-sm">
                    {/* Icon */}
                    <div className="mx-auto size-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-text-dark">Call Bykea Representative</h2>

                    {/* Description */}
                    <p className="text-base text-gray-600 leading-relaxed">
                        Speak directly with a Bykea representative to place your order via phone. 
                        No need to navigate through the app - just call and order!
                    </p>

                    {/* Phone Number */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Call us at</p>
                        <p className="text-xl font-bold text-primary">+92 300 123 4567</p>
                    </div>

                    {/* Call Button */}
                    <button
                        onClick={handleCall}
                        disabled={isCalling}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isCalling ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Connecting...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Call Now</span>
                            </>
                        )}
                    </button>

                    {/* Info */}
                    <p className="text-sm text-gray-500">
                        Available 24/7 for your convenience
                    </p>
                </div>
            </main>
        </div>
    )
}

