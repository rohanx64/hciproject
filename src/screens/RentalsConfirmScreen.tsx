import { assets } from '../constants/assets'
import { RideMap } from '../components/RideMap'

interface RentalsConfirmScreenProps {
    onNavigate?: (screen: string) => void
    onDone: () => void
    pickupLocation: string
    selectedHours: number
    selectedVehicle: string
    fare: number
}

export function RentalsConfirmScreen({
    onNavigate,
    onDone,
    pickupLocation,
    selectedHours,
    selectedVehicle,
    fare,
}: RentalsConfirmScreenProps) {
    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen">
            {/* Map Section */}
            <section className="relative h-[40%] overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Back Button */}
                <button
                    className="absolute left-[6.13%] top-[6.38%] size-[52px] rounded-full border-2 border-white bg-white shadow-lg flex items-center justify-center z-20 hover:bg-gray-50 active:scale-90 transition-all duration-200"
                    aria-label="Back"
                    onClick={() => onNavigate?.('Rentals')}
                >
                    <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </section>

            {/* Confirmation Section */}
            <section className="flex-1 bg-white px-6 py-6 overflow-y-auto">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="size-24 rounded-full bg-[#32991d] flex items-center justify-center shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        {/* Animated ring */}
                        <div className="absolute inset-0 size-24 rounded-full border-4 border-[#32991d] animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="font-display text-4xl font-bold text-[#32991d] mb-4 text-center">
                    Rental Confirmed!
                </h1>
                <p className="text-lg text-gray-600 text-center mb-8">
                    Your vehicle rental has been confirmed
                </p>

                {/* Details Card */}
                <div className="bg-gray-50 rounded-3xl p-6 mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Pickup Location</span>
                            <span className="text-sm font-bold text-text-dark">{pickupLocation}</span>
                        </div>
                        <div className="h-[1px] bg-gray-200"></div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Vehicle</span>
                            <span className="text-sm font-bold text-text-dark">{selectedVehicle}</span>
                        </div>
                        <div className="h-[1px] bg-gray-200"></div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Duration</span>
                            <span className="text-sm font-bold text-text-dark">{selectedHours} {selectedHours === 1 ? 'Hour' : 'Hours'}</span>
                        </div>
                        <div className="h-[1px] bg-gray-200"></div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Total Fare</span>
                            <span className="text-lg font-bold text-[#32991d]">{fare} Rs.</span>
                        </div>
                    </div>
                </div>

                {/* Booking ID */}
                <div className="bg-white rounded-3xl border-2 border-gray-200 p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">Booking ID</span>
                        <span className="text-sm font-bold text-[#32991d]">#RTL-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                </div>

                {/* Done Button */}
                <button
                    onClick={onDone}
                    className="w-full rounded-[7px] bg-[#32991d] px-8 py-5 text-lg font-extrabold text-white transition-all duration-200 hover:bg-[#2a7f16] hover:shadow-xl hover:scale-102 active:scale-98 shadow-[3.517px_3.517px_0px_0px_rgba(50,153,29,0.38)]"
                >
                    Done
                </button>
            </section>

        </div>
    )
}

