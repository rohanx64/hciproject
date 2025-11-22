interface HelpSupportScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

export function HelpSupportScreen({ onNavigate, onBack, hideBottomNav = true }: HelpSupportScreenProps) {
    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Header */}
            <header className="bg-primary px-6 py-4 flex items-center gap-4 z-10 relative">
                <button
                    onClick={() => {
                        onNavigate?.('home')
                    }}
                    className="text-white hover:opacity-80 transition-opacity"
                    aria-label="Back to Home"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white">Help & Support</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white px-6 py-6">
                <div className="space-y-4">
                    <p className="text-base text-gray-600 text-center py-8">
                        Help & Support screen will be designed here.
                    </p>
                </div>
            </main>
        </div>
    )
}

