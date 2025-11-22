import { RideMap } from '../components/RideMap'

interface RentalsStartedScreenProps {
    onNavigate?: (screen: string) => void
    driverName: string
    driverRating: number
    driverAvatar: string
    pickupLocation: string
    selectedHours: number
    selectedVehicle: string
    price: number
    onCallDriver?: () => void
    onChatDriver?: () => void
    onSOS?: () => void
    onRentalCompleted?: () => void
}

const RENTALS_COLOR = '#32991d'

export function RentalsStartedScreen({
    onNavigate,
    driverName,
    driverRating,
    driverAvatar,
    pickupLocation,
    selectedHours,
    selectedVehicle,
    price,
    onCallDriver,
    onChatDriver,
    onSOS,
    onRentalCompleted,
}: RentalsStartedScreenProps) {
    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Map Section */}
            <section className="relative h-[50%] overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Back Button */}
                <button
                    className="absolute left-6 top-6 size-10 rounded-full bg-white shadow-lg flex items-center justify-center z-20 hover:bg-gray-50 active:scale-90 transition-all duration-200"
                    aria-label="Back"
                    onClick={() => onNavigate?.('Rentals')}
                >
                    <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </section>

            {/* Rental Details Section */}
            <section className="flex-1 bg-white px-6 py-6 overflow-y-auto">
                {/* Driver Information */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <img
                            src={driverAvatar}
                            alt={driverName}
                            className="size-16 rounded-full border-2 object-cover"
                            style={{ borderColor: RENTALS_COLOR }}
                        />
                        <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                            <div className="size-3 rounded-full bg-white animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-text-dark">{driverName}</h3>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-sm">★</span>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Rental in progress</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onChatDriver}
                            className="size-12 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 active:scale-90 transition-all duration-200"
                            style={{ backgroundColor: RENTALS_COLOR }}
                            aria-label="Chat with driver"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        <button
                            onClick={onCallDriver}
                            className="size-12 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 active:scale-90 transition-all duration-200"
                            style={{ backgroundColor: RENTALS_COLOR }}
                            aria-label="Call driver"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Route Information */}
                <div className="mb-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="grid size-10 place-items-center rounded-full border-2 mt-1 flex-shrink-0" style={{ borderColor: RENTALS_COLOR }}>
                            <div className="size-3 rounded-full" style={{ backgroundColor: RENTALS_COLOR }}></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-base font-normal text-text-dark">{pickupLocation}</p>
                        </div>
                    </div>
                </div>

                {/* SOS Button - Above price */}
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={onSOS}
                        className="px-4 py-3 rounded-full bg-[#ff3b30] flex items-center justify-center gap-2 shadow-lg hover:bg-[#ff2d20] active:scale-95 transition-all duration-200"
                        aria-label="SOS Emergency"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-base font-extrabold text-white">SOS</span>
                    </button>
                </div>

                {/* Price Display */}
                <div className="mb-6 text-center">
                    <p className="text-4xl font-extrabold" style={{ color: RENTALS_COLOR }}>PKR {price}</p>
                </div>

                {/* Complete Rental Button */}
                <div className="mb-6">
                    <button
                        onClick={onRentalCompleted}
                        className="w-full rounded-full px-6 py-4 flex items-center justify-center gap-3 shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200"
                        style={{ backgroundColor: RENTALS_COLOR }}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-lg font-extrabold text-white">Complete Rental</span>
                    </button>
                </div>
            </section>

            {/* Status Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 z-[999]" style={{ backgroundColor: RENTALS_COLOR }}>
                <p className="text-center text-lg font-extrabold text-white uppercase tracking-wider">
                    YOUR RENTAL HAS STARTED
                </p>
            </div>
        </div>
    )
}

