interface DeliverySuccessScreenProps {
    onDone: () => void
    onNavigate?: (screen: string) => void
}

export function DeliverySuccessScreen({ onDone, onNavigate }: DeliverySuccessScreenProps) {
    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen relative">
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

            <div className="flex-1 flex flex-col items-center justify-center px-6 bg-gradient-to-b from-green-50 to-white">
                {/* Success Icon */}
                <div className="mb-8 relative">
                    <div className="size-32 rounded-full bg-[#ff9500] flex items-center justify-center shadow-2xl">
                        <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    {/* Animated ring */}
                    <div className="absolute inset-0 size-32 rounded-full border-4 border-[#ff9500] animate-ping opacity-20"></div>
                </div>

                {/* Success Message */}
                <h1 className="font-display text-4xl font-normal text-[#ff9500] mb-4 text-center">
                    Booking Successful!
                </h1>
                <p className="text-lg font-normal text-text-dark text-center mb-2">
                    Your delivery has been confirmed
                </p>
                <p className="text-sm font-normal text-gray-500 text-center mb-12">
                    You will receive a notification once the rider accepts your order
                </p>

                {/* Details Card */}
                <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-normal text-gray-600">Booking ID</span>
                        <span className="text-sm font-bold text-[#ff9500]">#DLV-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-normal text-gray-600">Status</span>
                        <span className="text-sm font-bold text-green-600">Confirmed</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-normal text-gray-600">ETA</span>
                        <span className="text-sm font-bold text-text-dark">15-20 mins</span>
                    </div>
                </div>

                {/* Done Button */}
                <button
                    onClick={onDone}
                    className="w-full max-w-sm rounded-3xl bg-[#ff9500] px-8 py-5 text-lg font-bold text-white transition hover:bg-[#e68600] shadow-xl"
                >
                    Done
                </button>
            </div>
        </div>
    )
}
