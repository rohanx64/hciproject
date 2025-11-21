import { useState } from 'react'
import { RideMap } from '../components/RideMap'
import { assets } from '../constants/assets'
import { favoritePlaces, recentLocations } from '../constants/data'

interface ShopsLocationSelectProps {
    onCancel: () => void
    onApply: (value: string) => void
    currentLocation: string
}

export function ShopsLocationSelectScreen({ onCancel, onApply, currentLocation }: ShopsLocationSelectProps) {
    const [value, setValue] = useState(currentLocation)
    const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null)
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedCoords([lat, lng])
        setValue(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
    }

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
                    setSelectedCoords(coords)
                    setValue('My current location')
                },
                (error) => {
                    console.error('Error getting location:', error)
                    setValue('My current location')
                }
            )
        } else {
            setValue('My current location')
        }
    }

    const handleLocationSelect = (location: string) => {
        setValue(location)
        onApply(location)
    }

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen">
            {/* Header with Search Input and View Toggle */}
            <section className="bg-white px-6 py-4 border-b border-gray-200 z-10">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#919191] mb-2">LOCATION</p>
                <div className="flex items-center gap-3 rounded-3xl border-2 border-[#c8f0c0] bg-white px-4 py-3 shadow-sm">
                    <img src={assets.searchIcon} alt="Search" className="h-5 w-5 opacity-60" />
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Type here..."
                        className="flex-1 border-none bg-transparent text-lg font-normal text-text-dark placeholder:text-[#242e42]/50 focus:outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && value) {
                                onApply(value)
                            }
                        }}
                    />
                    <img src={assets.chevronIcon} alt="" className="h-4 w-4 opacity-60" />
                </div>

                {/* View Toggle */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-l-full text-sm font-semibold transition-all duration-200 ${
                            viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 rounded-r-full text-sm font-semibold transition-all duration-200 ${
                            viewMode === 'map' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Map View
                    </button>
                </div>
            </section>

            {/* Content Section (List or Map) */}
            <section className="relative flex-1 overflow-hidden">
                {viewMode === 'list' && (
                    <div className="h-full overflow-y-auto px-6 py-4">
                        {/* Use Current Location */}
                        <button
                            onClick={handleUseCurrentLocation}
                            className="w-full flex items-center gap-3 p-3 mb-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition text-left"
                        >
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="flex-1 text-base font-normal text-text-dark">Use current location</span>
                        </button>

                        {/* Suggested Locations */}
                        <div className="mb-6">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-4">SUGGESTED</p>
                            <div className="flex flex-wrap gap-2">
                                {favoritePlaces.map((place, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleLocationSelect(place)}
                                        className="px-4 py-2 rounded-[17.5px] border border-[rgba(50,153,29,0.64)] bg-white text-sm font-normal text-text-dark hover:bg-green-50 transition"
                                    >
                                        {place}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Locations List */}
                        <div className="mb-6">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-4">RECENT LOCATIONS</p>
                            <div className="space-y-2">
                                {recentLocations.map((location, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleLocationSelect(location.label)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition text-left"
                                    >
                                        <span className="text-lg">
                                            {location.favorite ? '⭐' : '📍'}
                                        </span>
                                        <span className="flex-1 text-base font-normal text-text-dark">{location.label}</span>
                                        {location.favorite && (
                                            <span className="text-yellow-400 text-lg">⭐</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'map' && (
                    <>
                        <RideMap
                            pickupLocation={selectedCoords || [24.8607, 67.0011]}
                            onMapClick={handleMapClick}
                            className="h-full w-full"
                        />

                        {/* Pin for selected location */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                            <div className="relative">
                                <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                                <div className="relative size-14 rounded-full bg-primary border-4 border-white shadow-lg flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <p className="absolute top-[60%] left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-md z-20">
                            Move pin to set location
                        </p>

                        {/* Location Button */}
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
                    </>
                )}
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
                        onClick={() => onApply(value || 'My current location')}
                        className="flex-1 rounded-3xl bg-primary px-6 py-4 text-base font-bold text-white transition hover:bg-primary-dark shadow-lg active:scale-95"
                    >
                        APPLY
                    </button>
                </div>
            </section>
        </div>
    )
}

