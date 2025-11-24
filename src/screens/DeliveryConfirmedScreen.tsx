import { assets } from '../constants/assets'
import { RideMap } from '../components/RideMap'
import { AppIcon } from '../components/AppIcon'

interface DeliveryConfirmedScreenProps {
    onNavigate?: (screen: string) => void
    onDeliveryStarted: () => void
    onCancel: () => void
    riderName: string
    riderRating: number
    riderAvatar: string
    pickupLocation: string
    deliveryLocation: string
    distance: string
    time: string
    price: number
    vehicleType: string
    onCallRider?: () => void
    onChatRider?: () => void
}

export function DeliveryConfirmedScreen({
    onNavigate,
    onDeliveryStarted,
    onCancel,
    riderName,
    riderRating,
    riderAvatar,
    pickupLocation,
    deliveryLocation,
    distance,
    time,
    price,
    vehicleType,
    onCallRider,
    onChatRider,
}: DeliveryConfirmedScreenProps) {
    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Map Section */}
            <section className="relative h-[50%] overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    dropoffLocation={[24.8707, 67.0211]}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Back Button */}
                <button
                    className="absolute left-6 top-6 size-10 rounded-full bg-white shadow-lg flex items-center justify-center z-20 hover:bg-gray-50 active:scale-90 transition-all duration-200"
                    aria-label="Back"
                    onClick={() => onNavigate?.('Delivery')}
                >
                    <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </section>

            {/* Delivery Details Section */}
            <section className="flex-1 bg-white px-6 py-6 overflow-y-auto">
                {/* Rider Information */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <img
                            src={riderAvatar}
                            alt={riderName}
                            className="size-16 rounded-full border-2 border-[#ff9500] object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-[#ff9500] border-2 border-white flex items-center justify-center">
                            <AppIcon name="✓" className="text-xs text-white font-bold" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-text-dark">{riderName}</h3>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <AppIcon key={i} name="★" className="text-yellow-400 text-sm" />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">{vehicleType}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onChatRider}
                            className="size-12 rounded-full bg-[#ff9500] flex items-center justify-center shadow-lg hover:bg-[#e68600] active:scale-90 transition-all duration-200"
                            aria-label="Chat with rider"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        <button
                            onClick={onCallRider}
                            className="size-12 rounded-full bg-[#ff9500] flex items-center justify-center shadow-lg hover:bg-[#e68600] active:scale-90 transition-all duration-200"
                            aria-label="Call rider"
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
                        <div className="grid size-10 place-items-center rounded-full border-2 border-[#ff9500] mt-1 flex-shrink-0">
                            <div className="size-3 rounded-full bg-[#ff9500]"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-base font-normal text-text-dark">{pickupLocation}</p>
                        </div>
                    </div>

                    {/* Dashed line connector */}
                    <div className="flex items-center gap-3 ml-5">
                        <div className="w-0.5 h-8 border-l-2 border-dashed border-gray-300"></div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="grid size-10 place-items-center rounded-full bg-[#ff3b30]/20 mt-1 flex-shrink-0">
                            <svg className="w-5 h-5 text-[#ff3b30]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">DELIVERY</p>
                            <p className="text-base font-normal text-text-dark">{deliveryLocation}</p>
                        </div>
                    </div>
                </div>

                {/* Delivery Summary */}
                <div className="mb-6 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-4">
                    <div className="flex items-center gap-3 mb-3">
                        <AppIcon name="📦" className="text-2xl text-[#ff9500]" />
                        <div className="flex-1">
                            <div className="flex items-center gap-4 text-sm">
                                <span className="font-semibold text-text-dark">DISTANCE <span className="font-normal text-gray-600">{distance}</span></span>
                                <span className="font-semibold text-text-dark">TIME <span className="font-normal text-gray-600">{time}</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t-2 border-gray-200">
                        <p className="text-lg font-extrabold text-[#ff9500]">PRICE PKR {price}</p>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={onCancel}
                    className="w-full rounded-3xl bg-[#ff544a] px-6 py-4 text-lg font-extrabold text-white shadow-lg hover:bg-[#ff3d33] active:scale-95 transition-all duration-200"
                >
                    Cancel Request
                </button>

                {/* Auto-start button for demo */}
                <button
                    onClick={onDeliveryStarted}
                    className="w-full mt-3 rounded-3xl border-2 border-[#ff9500] bg-[#ff9500]/10 px-6 py-4 text-lg font-extrabold text-[#ff9500] hover:bg-[#ff9500]/20 active:scale-95 transition-all duration-200"
                >
                    Start Delivery (Demo)
                </button>
            </section>

        </div>
    )
}

