import { useState } from 'react'
import { assets } from '../constants/assets'
import { RideMap } from '../components/RideMap'

interface RentalsPickupSelectProps {
    onCancel: () => void
    onApply: (value: string) => void
    currentLocation: string
}

export function RentalsPickupSelectScreen({ onCancel, onApply, currentLocation }: RentalsPickupSelectProps) {
    const [value, setValue] = useState(currentLocation === 'My current location' ? '' : currentLocation)
    const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null)
    const [hasInteracted, setHasInteracted] = useState(false)

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedCoords([lat, lng])
        setHasInteracted(true)
        // In a real app, you'd reverse geocode these coords to get an address string
        // For now, use a placeholder address that indicates a location was selected
        if (!value || value === 'My current location') {
            setValue('Selected location')
        }
    }

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
                setSelectedCoords(coords)
                setValue('My current location')
                setHasInteracted(true)
            })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        setHasInteracted(true)
    }

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen">
            {/* Search Input at Top */}
            <section className="bg-white px-6 py-4 border-b border-gray-200 z-10">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#919191] mb-2">PICKUP</p>
                <div className="flex items-center gap-3 rounded-3xl border-2 border-[#c8f0c0] bg-white px-4 py-3 shadow-sm">
                    <img src={assets.searchIcon} alt="" className="h-5 w-5 opacity-60" />
                    <input
                        value={value}
                        onChange={handleInputChange}
                        placeholder="Type here..."
                        className="flex-1 border-none bg-transparent text-lg font-normal text-text-dark placeholder:text-[#242e42]/50 focus:outline-none"
                    />
                    <img src={assets.chevronIcon} alt="" className="h-4 w-4 opacity-60" />
                </div>
            </section>

            {/* Full Screen Map */}
            <section className="relative flex-1 overflow-hidden">
                <RideMap
                    pickupLocation={selectedCoords || [24.8607, 67.0011]}
                    onMapClick={handleMapClick}
                    className="h-full w-full"
                />

                {/* Pin for selected location - always centered visually */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="relative">
                        {/* Pin shadow */}
                        <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                        {/* Pin body - Yellow for pickup */}
                        <div className="relative size-14 rounded-full bg-[#ffd900] border-4 border-white shadow-lg flex items-center justify-center">
                            <div className="size-4 rounded-full bg-white"></div>
                        </div>
                    </div>
                </div>

                {/* "Move pin to set pickup" text */}
                <p className="absolute top-[60%] left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#ffd900] shadow-md z-20">
                    Move pin to set pickup
                </p>

                {/* Location Button - Green circular button with target icon */}
                <button
                    className="absolute bottom-6 right-6 size-[51px] rounded-full bg-primary shadow-lg flex items-center justify-center z-20 hover:bg-primary-dark transition active:scale-95"
                    aria-label="Use current location"
                    onClick={handleUseCurrentLocation}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </section>

            {/* Action Buttons at Bottom */}
            <section className="bg-white px-6 py-6 border-t border-gray-200">
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-3xl border-2 border-gray-300 bg-white px-6 py-4 text-base font-bold text-gray-700 transition hover:bg-gray-50 active:scale-95"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={() => {
                            // Determine the location to apply
                            let locationToApply: string
                            
                            if (hasInteracted) {
                                // User has interacted - use their input or selection
                                if (value && value.trim() && value !== 'My current location') {
                                    // User typed a custom location
                                    locationToApply = value.trim()
                                } else if (selectedCoords) {
                                    // User clicked on map - use a default name to indicate selection
                                    locationToApply = 'Selected location'
                                } else if (value === 'My current location') {
                                    // User explicitly selected "My current location" - use a different identifier
                                    locationToApply = 'Current location'
                                } else {
                                    // Fallback
                                    locationToApply = value || 'Selected location'
                                }
                            } else {
                                // No interaction - user just clicked APPLY without changes
                                // If current location is default, set to "Current location" to trigger expansion
                                if (currentLocation === 'My current location') {
                                    locationToApply = 'Current location'
                                } else {
                                    locationToApply = currentLocation
                                }
                            }
                            
                            onApply(locationToApply)
                        }}
                        className="flex-1 rounded-3xl bg-primary px-6 py-4 text-base font-bold text-white transition hover:bg-primary-dark shadow-lg active:scale-95"
                    >
                        APPLY
                    </button>
                </div>
            </section>
        </div>
    )
}

