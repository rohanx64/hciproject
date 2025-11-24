import { useState } from 'react'
import { RideMap } from '../components/RideMap'
import { assets } from '../constants/assets'

interface DeliveryMapScreenProps {
    pickupLocation: [number, number]
    deliveryLocation: [number, number]
    onCancel: () => void
    onApply: (coords?: [number, number]) => void
}

export function DeliveryMapScreen({
    pickupLocation,
    deliveryLocation,
    onCancel,
    onApply,
}: DeliveryMapScreenProps) {
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(deliveryLocation ? deliveryLocation : null)
    const [searchQuery, setSearchQuery] = useState('')

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedLocation([lat, lng])
    }

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-[844px]">
            {/* Drop-off Input at Top */}
            <section className="bg-white px-6 py-4 border-b border-gray-200 z-10">
                <div className="flex gap-2 items-center">
                    <div className="grid size-7 place-items-center">
                        <img src={assets.searchIcon} alt="Search" className="h-5 w-5 opacity-70" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type here..."
                        className="flex-1 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-[#ff9500] focus:outline-none"
                    />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mt-2 ml-2">DROP-OFF</p>
            </section>

            {/* Full Screen Map */}
            <section className="relative flex-1 overflow-hidden" style={{ zIndex: 0 }}>
                <RideMap
                    pickupLocation={pickupLocation}
                    dropoffLocation={selectedLocation || undefined}
                    onMapClick={handleMapClick}
                    className="h-full w-full"
                />

                {/* Selected Location Pin - Centered on map */}
                {selectedLocation && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 1000 }}>
                        <div className="relative">
                            {/* Pin shadow */}
                            <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                            {/* Pin body - Red for drop-off */}
                            <div className="relative size-14 rounded-full bg-red-500 shadow-lg flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Avatar - Placeholder */}
                <button
                    className="absolute left-6 top-6 size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                    style={{ zIndex: 1000 }}
                    aria-label="Profile"
                >
                    <div className="h-full w-full bg-gradient-to-br from-[#ff9500] to-[#e68600] flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Location Button - Green circular button */}
                <button
                    className="absolute bottom-[20%] right-6 size-[51px] rounded-full bg-[#6cc44a] shadow-lg flex items-center justify-center hover:bg-[#5ab038] transition"
                    style={{ zIndex: 1000 }}
                    aria-label="Use current location"
                    onClick={() => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                                const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
                                setSelectedLocation(coords)
                            })
                        }
                    }}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </section>

            {/* Action Buttons at Bottom */}
            <section className="bg-white px-6 py-6 border-t border-gray-200" style={{ zIndex: 1000 }}>
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-3xl border-2 border-gray-300 bg-white px-6 py-4 text-base font-bold text-gray-700 transition hover:bg-gray-50"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={() => onApply(selectedLocation || undefined)}
                        className="flex-1 rounded-3xl bg-[#6cc44a] px-6 py-4 text-base font-bold text-white transition hover:bg-[#5ab038] shadow-lg"
                    >
                        APPLY
                    </button>
                </div>
            </section>
        </div>
    )
}
