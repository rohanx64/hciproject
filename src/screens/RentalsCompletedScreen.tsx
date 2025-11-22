import { useState } from 'react'
import { BottomNav } from '../components/BottomNav'

interface RentalsCompletedScreenProps {
    onNavigate?: (screen: string) => void
    onBack?: () => void
    driverName?: string
    driverRating?: number
    driverAvatar?: string
    pickupLocation?: string
    selectedHours?: number
    selectedVehicle?: string
    price?: string
    onDone?: () => void
}

const RENTALS_COLOR = '#32991d'

export function RentalsCompletedScreen({
    onNavigate,
    onBack,
    driverName = 'Ghulam Shabir',
    driverRating = 5,
    driverAvatar,
    pickupLocation = 'Karachi University',
    selectedHours = 2,
    selectedVehicle = 'Bike',
    price = 'RS. 900',
    onDone,
}: RentalsCompletedScreenProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)

    const handleSubmitReview = () => {
        console.log('Rating submitted:', rating)
        onDone?.()
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Header */}
            <header className="px-6 py-4 flex items-center gap-4 z-10 relative" style={{ backgroundColor: RENTALS_COLOR }}>
                <button
                    onClick={onBack || (() => onNavigate?.('rentalsHome'))}
                    className="text-white hover:opacity-80 transition-opacity"
                    aria-label="Back"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white flex-1">Rental Completed</h1>
            </header>

            {/* Content - No scroll, compact layout */}
            <main className="flex-1 bg-white px-6 py-4 flex flex-col justify-between overflow-hidden">
                <div className="space-y-4">
                    {/* Rental Information - Compact */}
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Pickup</span>
                                <p className="font-semibold text-text-dark">{pickupLocation}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Vehicle</span>
                                <p className="font-semibold text-text-dark">{selectedVehicle}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Duration</span>
                                <p className="font-semibold text-text-dark">{selectedHours} {selectedHours === 1 ? 'Hour' : 'Hours'}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Fare</span>
                                <p className="font-bold" style={{ color: RENTALS_COLOR }}>{price}</p>
                            </div>
                        </div>
                    </div>

                    {/* Driver Information - Compact */}
                    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
                        <div className="flex items-center gap-3">
                            {driverAvatar ? (
                                <img
                                    src={driverAvatar}
                                    alt={driverName}
                                    className="size-12 rounded-full border-2 border-gray-200"
                                />
                            ) : (
                                <div className="size-12 rounded-full border-2 border-gray-200 flex items-center justify-center" style={{ background: `linear-gradient(to bottom right, ${RENTALS_COLOR}, #2a7f16)` }}>
                                    <span className="text-lg text-white font-bold">{driverName.charAt(0)}</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-base font-semibold text-text-dark">{driverName}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-3 h-3 ${i < driverRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                            fill={i < driverRating ? 'currentColor' : 'none'}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rating Section */}
                    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
                        <h3 className="text-base font-bold text-text-dark mb-3 text-center">Rate Your Driver</h3>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => {
                                        setRating(star)
                                        // Automatically navigate to home after rating
                                        setTimeout(() => {
                                            onDone?.()
                                        }, 500)
                                    }}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110 active:scale-95"
                                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                >
                                    <svg
                                        className={`w-10 h-10 transition-colors ${
                                            star <= (hoveredRating || rating)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                        fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                                        stroke={star <= (hoveredRating || rating) ? 'currentColor' : 'currentColor'}
                                        strokeWidth={star <= (hoveredRating || rating) ? 0 : 1.5}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    <button
                        onClick={handleSubmitReview}
                        disabled={rating === 0}
                        className="w-full py-3 rounded-xl text-white font-semibold text-base hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: RENTALS_COLOR }}
                    >
                        {rating === 0 ? 'Please rate your driver' : 'Submit Review'}
                    </button>
                </div>
            </main>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white">
                <BottomNav active="Rentals" onNavigate={onNavigate} />
            </div>
        </div>
    )
}

