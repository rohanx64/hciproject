import { useState, useRef } from 'react'
import L from 'leaflet'
import { assets } from '../constants/assets'
import { favoritePlaces, recentLocations } from '../constants/data'
import { BottomNav } from '../components/BottomNav'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'

interface DeliveryHomeScreenProps {
    onNavigate?: (screen: string) => void
    onProceedToForm: () => void
    onSelectLocation?: (location: string) => void
    selectedType: 'bike' | 'package' | 'restaurant' | 'groceries'
    onSelectType: (type: 'bike' | 'package' | 'restaurant' | 'groceries') => void
    pickupLocation: string
    onChangePickup: (location: string) => void
    onOpenPickupSelect?: () => void
    onOpenSidebar?: () => void
    onOpenVoiceActivation?: () => void
}

export function DeliveryHomeScreen({
    onNavigate,
    onProceedToForm,
    onSelectLocation,
    pickupLocation,
    onOpenPickupSelect,
    onOpenSidebar,
    onOpenVoiceActivation,
}: DeliveryHomeScreenProps) {
    const [panelHeight, setPanelHeight] = useState(42) // Standardized height for all screens
    const [selectedPickupLocation, setSelectedPickupLocation] = useState<[number, number] | null>(null)
    const [selectedDropoffLocation, setSelectedDropoffLocation] = useState<[number, number] | null>(null)
    const [isMapDragging, setIsMapDragging] = useState(false)
    const mapRef = useRef<L.Map | null>(null)
    
    // Calculate button position in pixels based on panel height percentage
    const containerHeight = 844
    const bottomNavHeight = 110
    const availableHeight = containerHeight - bottomNavHeight
    const panelHeightPixels = (panelHeight / 100) * availableHeight
    const buttonBottomPixels = bottomNavHeight + panelHeightPixels + 20 // 20px gap above panel

    const handleLocationClick = (location: string) => {
        onSelectLocation?.(location)
        onProceedToForm()
    }

    const handleMapClick = (lat: number, lng: number) => {
        // If no dropoff selected, select dropoff; otherwise select pickup
        if (!selectedDropoffLocation) {
            setSelectedDropoffLocation([lat, lng])
        } else {
            setSelectedPickupLocation([lat, lng])
        }
    }

    const handleMapDragStart = () => {
        setIsMapDragging(true)
        setPanelHeight(20) // Collapse to minimum
    }

    const handleMapDragEnd = () => {
        setIsMapDragging(false)
        setTimeout(() => {
            setPanelHeight(42) // Expand back to initial
        }, 300)
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    selectedPickupLocation={selectedPickupLocation || undefined}
                    selectedDropoffLocation={selectedDropoffLocation || undefined}
                    onMapClick={handleMapClick}
                    onDragStart={handleMapDragStart}
                    onDragEnd={handleMapDragEnd}
                    className="h-full w-full"
                    mapRef={mapRef}
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none" style={{ zIndex: 1 }} />

                {/* Profile Avatar - Consistent across all screens */}
                <button
                    className="absolute left-[4.26%] top-[7.64%] size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg z-20 hover:scale-105 active:scale-95 transition-all duration-200"
                    aria-label="Profile"
                    onClick={() => onOpenSidebar?.()}
                >
                    <div className="h-full w-full bg-gradient-to-br from-[#ff9500] to-[#e68600] flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Location Pointer - Clean and distinct design */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-30 pointer-events-none">
                    <div className="relative">
                        {/* Pointer body - Clean pin without shadows */}
                        <svg className="w-10 h-14 text-[#ff9500]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        {/* Center dot for precision */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-[18px] w-2.5 h-2.5 rounded-full bg-white border-2 border-[#ff9500]"></div>
                    </div>
                </div>

                {/* Zoom Controls - Positioned at top right, always visible */}
                <div className="absolute right-[5.26%] top-[20%] z-30 flex flex-col gap-2">
                    <button
                        onClick={() => {
                            if (mapRef.current) {
                                mapRef.current.zoomIn()
                            }
                        }}
                        className="size-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all duration-200"
                        aria-label="Zoom in"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            if (mapRef.current) {
                                mapRef.current.zoomOut()
                            }
                        }}
                        className="size-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all duration-200"
                        aria-label="Zoom out"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                        </svg>
                    </button>
                </div>

                {/* Voice Button - Combined mic + Voice label, aligned with location button */}
                <button
                    style={{ bottom: `${buttonBottomPixels}px` }}
                    onClick={onOpenVoiceActivation}
                    className="absolute left-[5.68%] px-4 py-3 rounded-full bg-primary/95 backdrop-blur-sm shadow-lg border-2 border-white flex items-center gap-2 z-[600] hover:bg-primary active:scale-95 transition-all duration-200 ease-out"
                    aria-label="Voice input"
                >
                    <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
                        <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z" />
                        <path d="M12 18.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-3 0v-3a1.5 1.5 0 011.5-1.5z" />
                    </svg>
                    <span className="text-base font-extrabold text-white uppercase tracking-wide">Voice</span>
                </button>

                {/* Location Button - Dynamically positioned above panel */}
                <button
                    style={{ bottom: `${buttonBottomPixels}px` }}
                    className="absolute right-[5.26%] min-w-[51px] min-h-[51px] rounded-full bg-[#6cc44a] shadow-lg flex items-center justify-center z-[600] hover:bg-[#5ab038] active:scale-90 transition-all duration-200 ease-out"
                    aria-label="Use current location"
                    onClick={() => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                                handleMapClick(position.coords.latitude, position.coords.longitude)
                            })
                        }
                    }}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>

                {/* Pickup Location Card - With green target icon (Figma style) */}
                <button
                    onClick={() => {
                        onOpenPickupSelect?.()
                    }}
                    className="absolute left-1/2 top-[25.7%] -translate-x-1/2 w-[254px] min-h-[60px] z-20 active:scale-95 transition-transform duration-200"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3 hover:shadow-xl transition-all duration-200">
                        <div className="grid size-7 place-items-center flex-shrink-0">
                            {/* Green target/crosshair icon for pickup */}
                            <svg className="w-5 h-5 text-[#6cc44a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-base font-normal text-text-dark truncate">{pickupLocation}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Location Selection Indicator - Consistent pin style */}
                {(selectedPickupLocation || selectedDropoffLocation) && (
                    <div className="absolute left-1/2 top-[33.5%] -translate-x-1/2 z-20 pointer-events-none">
                        <div className="relative">
                            {/* Pin shadow */}
                            <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                            {/* Pin body - Orange for delivery */}
                            <div className="relative size-[269px] rounded-full bg-[#ff9500]/20 flex items-center justify-center">
                                <div className="size-[67px] rounded-full bg-[#ff9500] flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Draggable Bottom Panel */}
            <DraggablePanel
                initialHeight={panelHeight}
                minHeight={20}
                maxHeight={85}
                onHeightChange={setPanelHeight}
            >
                <div className="px-6 pb-2">
                    {/* Delivery Title - Top left */}
                    <h1 className="font-display text-[32px] font-normal text-[#ff9500] text-left mb-3 mt-2">
                        Delivery
                    </h1>

                    {/* Drop-off Input Card - With red pin icon (Figma style) */}
                    <button
                        onClick={onProceedToForm}
                        className="w-full min-h-[68px] rounded-3xl border-2 border-[#c8f0c0] bg-white p-4 shadow-sm mb-3 flex items-center gap-3 hover:bg-green-50 hover:border-[#ff9500] hover:shadow-md active:scale-[0.98] transition-all duration-200 group"
                    >
                        <div className="grid size-7 place-items-center flex-shrink-0">
                            {/* Red location pin icon */}
                            <svg className="w-5 h-5 text-[#ff3b30]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#919191] mb-1">DROP-OFF</p>
                            <p className="text-base font-normal text-text-dark truncate">Where to?</p>
                        </div>
                        <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                            <svg className="w-5 h-5 text-[#ff9500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    {/* Suggested Location Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {favoritePlaces.map((place, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleLocationClick(place)}
                                className="min-h-[44px] px-4 py-2.5 rounded-[17.5px] border border-[rgba(50,153,29,0.64)] bg-white text-sm font-normal text-text-dark hover:bg-green-50 hover:border-[#32991d] hover:shadow-sm active:scale-95 transition-all duration-200 ease-out"
                            >
                                {place}
                            </button>
                        ))}
                    </div>

                    {/* Recent Locations List - Only show when panel is expanded (Figma style) */}
                    {panelHeight > 50 && (
                        <div className="mb-3">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-3">RECENT LOCATIONS</p>
                            <div className="space-y-0">
                                {recentLocations.map((location, idx) => (
                                    <div key={idx}>
                                        <button
                                            onClick={() => handleLocationClick(location.label)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 text-left min-h-[52px] group"
                                        >
                                            {/* Red location pin icon */}
                                            <svg className="w-5 h-5 text-[#ff3b30] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                            </svg>
                                            <span className="flex-1 text-base font-normal text-text-dark">{location.label}</span>
                                            {/* Clickable star icon */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    // Toggle favorite - in real app, this would update state
                                                    console.log('Toggle favorite for:', location.label)
                                                }}
                                                className="flex-shrink-0 p-1 hover:scale-110 active:scale-95 transition-transform"
                                                aria-label={location.favorite ? 'Remove from favorites' : 'Add to favorites'}
                                            >
                                                <svg className={`w-6 h-6 flex-shrink-0 transition-colors ${location.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={location.favorite ? 'currentColor' : 'none'} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        </button>
                                        {idx < recentLocations.length - 1 && (
                                            <div className="h-[1px] bg-gray-200 mx-3"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DraggablePanel>

            {/* Bottom Navigation - Always visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white">
                <BottomNav active="Delivery" onNavigate={onNavigate} />
            </div>
        </div>
    )
}
