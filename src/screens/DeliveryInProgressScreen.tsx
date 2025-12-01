import { RideMap } from '../components/RideMap'
import { AppIcon } from '../components/AppIcon'

interface DeliveryInProgressScreenProps {
    onNavigate?: (screen: string) => void
    riderName: string
    riderRating: number
    riderAvatar: string
    pickupLocation: string
    deliveryLocation: string
    price: number
    onCallRider?: () => void
    onChatRider?: () => void
    onSOS?: () => void
    onDeliveryCompleted?: () => void
}

export function DeliveryInProgressScreen({
    onNavigate,
    riderName,
    riderAvatar,
    pickupLocation,
    deliveryLocation,
    price,
    onCallRider,
    onChatRider,
    onSOS,
    onDeliveryCompleted,
}: DeliveryInProgressScreenProps) {
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
                        <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                            <div className="size-3 rounded-full bg-white animate-pulse"></div>
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
                            <p className="text-sm text-gray-500">Delivery in progress</p>
                            <p className="text-xs text-gray-400 mt-0.5">Expected time to arrive: 10–15 minutes</p>
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
                    <p className="text-4xl font-extrabold text-[#ff9500]">PKR {price}</p>
                </div>

                {/* Complete Delivery Button */}
                <div className="mb-6">
                    <button
                        onClick={onDeliveryCompleted}
                        className="w-full rounded-full bg-[#ff9500] px-6 py-4 flex items-center justify-center gap-3 shadow-lg hover:bg-[#e68600] active:scale-95 transition-all duration-200"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-lg font-extrabold text-white">Complete Delivery</span>
                    </button>
                </div>
            </section>

            {/* Status Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#ff9500] px-6 py-4 z-[999]">
                <p className="text-center text-lg font-extrabold text-white uppercase tracking-wider">
                    YOUR DELIVERY HAS STARTED
                </p>
            </div>
        </div>
    )
}

