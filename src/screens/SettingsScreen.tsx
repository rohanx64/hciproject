import { BottomNav } from '../components/BottomNav'

interface SettingsScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    userName?: string
    userAvatar?: string
    hideBottomNav?: boolean
}

const settingsOptions = [
    { id: 'notifications', label: 'Notifications' },
    { id: 'changeSize', label: 'Change Size' },
    { id: 'language', label: 'Language' },
    { id: 'voiceFeedback', label: 'Voice Feedback' },
    { id: 'changeTheme', label: 'Change Theme' },
    { id: 'terms', label: 'Terms & Privacy Policy' },
    { id: 'contact', label: 'Contact us' },
]

export function SettingsScreen({ onNavigate, userName = 'Rohan Riaz', userAvatar, hideBottomNav = true }: SettingsScreenProps) {
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
                <h1 className="text-xl font-bold text-white">Settings</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white">
                {/* Profile Section */}
                <button
                    onClick={() => onNavigate?.('myAccount')}
                    className="w-full px-6 py-4 flex items-center gap-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    {userAvatar ? (
                        <img
                            src={userAvatar}
                            alt={userName}
                            className="size-16 rounded-full border-2 border-gray-200"
                        />
                    ) : (
                        <div className="size-16 rounded-full border-2 border-gray-200 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                            <span className="text-2xl text-white font-bold">{userName.charAt(0)}</span>
                        </div>
                    )}
                    <span className="flex-1 text-base font-normal text-text-dark text-left">{userName}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Settings Options */}
                <div className="py-2">
                    {settingsOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => {
                                if (option.id === 'notifications') {
                                    onNavigate?.('notificationsSettings')
                                } else if (option.id === 'changeSize') {
                                    onNavigate?.('changeSizeSettings')
                                } else if (option.id === 'language') {
                                    onNavigate?.('languageSettings')
                                } else if (option.id === 'voiceFeedback') {
                                    onNavigate?.('voiceFeedback')
                                } else if (option.id === 'changeTheme') {
                                    onNavigate?.('changeThemeSettings')
                                } else if (option.id === 'terms') {
                                    onNavigate?.('termsPrivacy')
                                } else if (option.id === 'contact') {
                                    onNavigate?.('contactUs')
                                }
                            }}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                        >
                            <span className="text-base font-normal text-text-dark">{option.label}</span>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Logout Button */}
                <div className="px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={() => {
                            console.log('Logout clicked')
                        }}
                        className="w-full text-center text-base font-normal text-gray-500 hover:text-red-500 transition-colors py-2"
                    >
                        Log out
                    </button>
                </div>
            </main>

            {/* Bottom Navigation - Hidden when in sidebar screens */}
            {!hideBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white max-w-full">
                    <BottomNav active="Ride" onNavigate={onNavigate} />
                </div>
            )}
        </div>
    )
}

