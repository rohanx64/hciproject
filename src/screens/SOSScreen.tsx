import { useState } from 'react'
import { RideMap } from '../components/RideMap'

interface SOSScreenProps {
    onNavigate?: (screen: string) => void
    onClose: () => void
    contactName?: string
    contactPhone?: string
    currentLocation?: [number, number]
    serviceType?: 'ride' | 'delivery' | 'shop' | 'rental'
}

export function SOSScreen({
    onNavigate,
    onClose,
    contactName = 'Emergency Services',
    contactPhone = '112',
    currentLocation = [24.8607, 67.0011],
    serviceType = 'ride',
}: SOSScreenProps) {
    const [isCalling, setIsCalling] = useState(false)

    const handleEmergencyCall = () => {
        setIsCalling(true)
        // In a real app, this would initiate an emergency call
        setTimeout(() => {
            setIsCalling(false)
        }, 2000)
    }

    const serviceColors = {
        ride: 'primary',
        delivery: '[#ff9500]',
        shop: 'primary',
    }

    const bgColor = serviceType === 'delivery' ? 'bg-[#ff9500]' : 'bg-primary'

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-[844px] relative">
            {/* Map Section */}
            <section className="relative h-[50%] overflow-hidden">
                <RideMap
                    pickupLocation={currentLocation}
                    className="h-full w-full"
                />

                {/* Red overlay for emergency */}
                <div className="absolute inset-0 bg-red-500/20 pointer-events-none z-10" />

                {/* Back Button */}
                <button
                    className="absolute left-6 top-6 size-10 rounded-full bg-white shadow-lg flex items-center justify-center z-20 hover:bg-gray-50 active:scale-90 transition-all duration-200"
                    aria-label="Back"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </section>

            {/* Emergency Content Section */}
            <section className="flex-1 bg-white px-6 py-6 overflow-y-auto">
                {/* Emergency Header */}
                <div className="text-center mb-6">
                    <div className="size-24 rounded-full bg-[#ff3b30] mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#ff3b30] mb-2">EMERGENCY</h1>
                    <p className="text-base text-gray-600">Your location is being shared</p>
                </div>

                {/* Emergency Actions */}
                <div className="space-y-4 mb-6">
                    {/* Call Emergency Services */}
                    <button
                        onClick={handleEmergencyCall}
                        disabled={isCalling}
                        className="w-full rounded-3xl bg-[#ff3b30] px-6 py-5 text-lg font-extrabold text-white shadow-lg hover:bg-[#cc2920] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isCalling ? (
                            <>
                                <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Calling...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Call Emergency (112)</span>
                            </>
                        )}
                    </button>

                    {/* Contact Driver/Rider */}
                    {contactName && (
                        <button
                            onClick={() => onNavigate?.('call')}
                            className="w-full rounded-3xl border-2 border-gray-300 bg-white px-6 py-5 text-lg font-bold text-text-dark shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>Call {contactName}</span>
                        </button>
                    )}

                    {/* Share Location */}
                    <button
                        onClick={() => {
                            // In a real app, this would share location
                            navigator.share?.({
                                title: 'My Location',
                                text: `I'm at ${currentLocation[0]}, ${currentLocation[1]}`,
                            }).catch(() => {
                                // Fallback: copy to clipboard
                                navigator.clipboard.writeText(`Location: ${currentLocation[0]}, ${currentLocation[1]}`)
                            })
                        }}
                        className="w-full rounded-3xl border-2 border-gray-300 bg-white px-6 py-5 text-lg font-bold text-text-dark shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.885 12.938 9 12.482 9 12c0-.482-.115-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share Location</span>
                    </button>
                </div>

                {/* Safety Information */}
                <div className="bg-gray-50 rounded-3xl p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Safety Tips:</p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                        <li>Stay calm and provide clear information</li>
                        <li>Your location is automatically shared</li>
                        <li>Emergency services will be notified</li>
                    </ul>
                </div>
            </section>
        </div>
    )
}

