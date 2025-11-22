import { useState } from 'react'

interface NotificationsSettingsScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

export function NotificationsSettingsScreen({ onNavigate, onBack, hideBottomNav = true }: NotificationsSettingsScreenProps) {
    const [pushNotifications, setPushNotifications] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [smsNotifications, setSmsNotifications] = useState(false)
    const [rideUpdates, setRideUpdates] = useState(true)
    const [promotionalOffers, setPromotionalOffers] = useState(false)

    const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                enabled ? 'bg-primary' : 'bg-gray-300'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    )

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
                <h1 className="text-xl font-bold text-white">Notifications</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white px-6 py-4">
                <div className="space-y-6">
                    {/* Push Notifications */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-base font-normal text-text-dark">Push Notifications</span>
                            <span className="text-sm text-gray-500 mt-1">Receive notifications on your device</span>
                        </div>
                        <ToggleSwitch enabled={pushNotifications} onToggle={() => setPushNotifications(!pushNotifications)} />
                    </div>

                    {/* Email Notifications */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-base font-normal text-text-dark">Email Notifications</span>
                            <span className="text-sm text-gray-500 mt-1">Receive updates via email</span>
                        </div>
                        <ToggleSwitch enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
                    </div>

                    {/* SMS Notifications */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-base font-normal text-text-dark">SMS Notifications</span>
                            <span className="text-sm text-gray-500 mt-1">Receive text message updates</span>
                        </div>
                        <ToggleSwitch enabled={smsNotifications} onToggle={() => setSmsNotifications(!smsNotifications)} />
                    </div>

                    {/* Ride Updates */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-base font-normal text-text-dark">Ride Updates</span>
                            <span className="text-sm text-gray-500 mt-1">Get notified about your ride status</span>
                        </div>
                        <ToggleSwitch enabled={rideUpdates} onToggle={() => setRideUpdates(!rideUpdates)} />
                    </div>

                    {/* Promotional Offers */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-base font-normal text-text-dark">Promotional Offers</span>
                            <span className="text-sm text-gray-500 mt-1">Receive special deals and discounts</span>
                        </div>
                        <ToggleSwitch enabled={promotionalOffers} onToggle={() => setPromotionalOffers(!promotionalOffers)} />
                    </div>
                </div>
            </main>
        </div>
    )
}

