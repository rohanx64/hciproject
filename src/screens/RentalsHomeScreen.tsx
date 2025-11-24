import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { BottomNav } from '../components/BottomNav'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'
import { favoritePlaces } from '../constants/data'

interface RentalsHomeScreenProps {
    onNavigate?: (screen: string) => void
    onProceedToConfirm: (hours: number, vehicle: string) => void
    pickupLocation: string
    onChangePickup: (location: string) => void
    onOpenFareDialog?: () => void
    onOpenPaymentModal?: () => void
    onOpenPickupSelect?: () => void
    onOpenSidebar?: () => void
    onOpenVoiceActivation?: () => void
}

export function RentalsHomeScreen({
    onNavigate,
    onProceedToConfirm,
    pickupLocation,
    onChangePickup,
    onOpenFareDialog,
    onOpenPaymentModal,
    onOpenPickupSelect,
    onOpenSidebar,
    onOpenVoiceActivation,
}: RentalsHomeScreenProps) {
    const [panelHeight, setPanelHeight] = useState(36) // Slimmer default panel
    const [selectedHours, setSelectedHours] = useState(2)
    const [selectedVehicle, setSelectedVehicle] = useState('Bike')
    const [fare] = useState(900)
    const [paymentMethod] = useState('Cash')
    const [selectedPickupLocation, setSelectedPickupLocation] = useState<[number, number] | null>(null)
    const mapRef = useRef<L.Map | null>(null)

    // Calculate button position in pixels based on panel height percentage
    // Use window.innerHeight to match DraggablePanel
    const [containerHeight, setContainerHeight] = useState(window.innerHeight)

    useEffect(() => {
        const handleResize = () => setContainerHeight(window.innerHeight)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const bottomNavHeight = 110
    const availableHeight = containerHeight - bottomNavHeight
    const panelHeightPixels = (panelHeight / 100) * availableHeight
    const buttonBottomPixels = bottomNavHeight + panelHeightPixels + 6

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedPickupLocation([lat, lng])
    }

    const handleMapDragStart = () => {
        setPanelHeight(20) // Collapse to minimum
    }

    const handleMapDragEnd = () => {
        setTimeout(() => {
            setPanelHeight(showPickupSelection ? 36 : 68) // Expand back to appropriate height
        }, 300)
    }

    // Check if pickup has been selected (not default)
    // If pickupLocation is "My current location", it means it's the initial state
    // Any other value means user has selected a location via the picker
    const hasSelectedPickup = pickupLocation !== 'My current location' && pickupLocation !== '' && pickupLocation !== 'Where to?' && pickupLocation !== undefined

    // Update panel height when pickup is selected - expand smoothly
    useEffect(() => {
        if (hasSelectedPickup) {
            setTimeout(() => setPanelHeight(68), 300)
        } else {
            setPanelHeight(36)
        }
    }, [hasSelectedPickup])

    const vehicles = [
        { id: 'Bike', icon: '🏍️', label: 'Bike' },
        { id: 'Car', icon: '🚗', label: 'Car' },
        { id: 'Auto', icon: '🛺', label: 'Auto' },
        { id: 'Plus', icon: '🚙', label: 'Plus' },
        { id: 'AC', icon: '🚕', label: 'AC' },
    ]

    const handleHoursChange = (delta: number) => {
        setSelectedHours((prev) => Math.max(1, Math.min(24, prev + delta)))
    }

    const handleLocationClick = (location: string) => {
        onChangePickup(location)
    }

    // Determine what to show based on pickup selection
    const showPickupSelection = !hasSelectedPickup

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    selectedPickupLocation={selectedPickupLocation || undefined}
                    onMapClick={handleMapClick}
                    onDragStart={handleMapDragStart}
                    onDragEnd={handleMapDragEnd}
                    className="h-full w-full"
                    mapRef={mapRef}
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Profile Avatar - Consistent across all screens */}
                <button
                    className="absolute left-[4.26%] top-[7.64%] size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg z-20 hover:scale-105 active:scale-95 transition-all duration-200"
                    aria-label="Profile"
                    onClick={() => onOpenSidebar?.()}
                >
                    <div className="h-full w-full bg-gradient-to-br from-[#ffd900] to-[#e6c400] flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Location Pointer - Clean and distinct design */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[120%] z-30 pointer-events-none">
                    <div className="relative">
                        {/* Pointer body - Clean pin without shadows */}
                        <svg className="w-10 h-14 text-[#ffd900]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {/* Center dot for precision */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-[18px] w-2.5 h-2.5 rounded-full bg-white border-2 border-[#ffd900]"></div>
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
                    className="fixed left-[5.68%] px-4 py-3 rounded-full bg-primary/95 backdrop-blur-sm shadow-lg border-2 border-white flex items-center gap-2 z-[600] hover:bg-primary active:scale-95 transition-all duration-200 ease-out"
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
                    className="fixed right-[5.26%] px-4 py-3 rounded-full bg-white/95 border-2 border-[#ffd900] text-[#a47f00] font-semibold shadow-lg flex items-center gap-2 z-[600] hover:bg-[#ffd900] hover:text-white hover:shadow-xl active:scale-95 transition-all duration-200 ease-out"
                    aria-label="Use current location"
                    onClick={() => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                                handleMapClick(position.coords.latitude, position.coords.longitude)
                            })
                        }
                    }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="6" strokeWidth="2" />
                        <path strokeWidth="2" d="M12 6V3M12 21v-3M6 12H3M21 12h-3" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
                    </svg>
                    <span className="text-sm font-extrabold uppercase tracking-wide">Locate</span>
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
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="12" cy="12" r="2" fill="currentColor" />
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
                {selectedPickupLocation && (
                    <div className="absolute left-1/2 top-[33.5%] -translate-x-1/2 z-20 pointer-events-none">
                        <div className="relative">
                            {/* Pin shadow */}
                            <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                            {/* Pin body - Yellow for rentals */}
                            <div className="relative size-[269px] rounded-full bg-[#ffd900]/20 flex items-center justify-center">
                                <div className="size-[67px] rounded-full bg-[#ffd900] flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Draggable Bottom Panel - Standardized initial, expands when pickup selected */}
            <DraggablePanel
                initialHeight={panelHeight}
                minHeight={32}
                maxHeight={82}
                onHeightChange={setPanelHeight}
                hideBottomNav={false}
            >
                <div className="px-6 pb-2">
                    {/* Rentals Title - Top left */}
                    <h1 className="font-display text-[32px] font-normal text-[#ffd900] text-left mb-3 mt-2">
                        Rentals
                    </h1>

                    {showPickupSelection ? (
                        /* Initial State: Pickup Selection */
                        <>
                            <p className="text-left text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-3">
                                SELECT PICKUP LOCATION
                            </p>

                            {/* Suggested Location Tags */}
                            <div className="flex flex-wrap gap-2">
                                {favoritePlaces.map((place, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleLocationClick(place)}
                                        className="min-h-[44px] px-4 py-2.5 rounded-[17.5px] border border-[rgba(50,153,29,0.64)] bg-white text-sm font-normal text-text-dark hover:bg-green-50 hover:border-[#ffd900] hover:shadow-sm active:scale-95 transition-all duration-200 ease-out"
                                    >
                                        {place}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* After Pickup Selected: Hours and Vehicle Selection */
                        <>
                            {/* SELECT HOURS Section */}
                            <div className="mb-4">
                                <p className="text-left text-[19.931px] font-light text-[#919191] mb-3">SELECT HOURS</p>
                                <div className="flex items-center justify-center gap-6">
                                    {/* Minus Button */}
                                    <button
                                        onClick={() => handleHoursChange(-1)}
                                        className="size-[35px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-[#ffd900] hover:shadow-sm active:scale-90 transition-all duration-200"
                                        aria-label="Decrease hours"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                        </svg>
                                    </button>

                                    {/* Hours Display - Large number with underline */}
                                    <div className="flex flex-col items-center">
                                        <p className="text-[37.517px] font-extrabold text-text-dark leading-none">{selectedHours}</p>
                                        <div className="w-[125px] h-[3.5px] bg-gray-300 mt-1"></div>
                                    </div>

                                    {/* Plus Button */}
                                    <button
                                        onClick={() => handleHoursChange(1)}
                                        className="size-[35px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-[#ffd900] hover:shadow-sm active:scale-90 transition-all duration-200"
                                        aria-label="Increase hours"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Divider Line */}
                            <div className="h-[1px] bg-gray-200 mb-4 mx-6"></div>

                            {/* SELECT VEHICLE Section */}
                            <div className="mb-4">
                                <p className="text-left text-[19.931px] font-light text-[#919191] mb-3">SELECT VEHICLE</p>
                                <div className="flex gap-[13px] overflow-x-auto pb-2 scrollbar-hide justify-center">
                                    {vehicles.map((vehicle) => {
                                        const isActive = selectedVehicle === vehicle.id
                                        return (
                                            <button
                                                key={vehicle.id}
                                                onClick={() => setSelectedVehicle(vehicle.id)}
                                                className={`flex min-w-[74.5px] h-[72.7px] flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 ${isActive
                                                    ? 'border-[#c8f0c0] bg-[#c8f0c0]/30 shadow-md scale-105'
                                                    : 'border-[#c8f0c0] bg-white hover:bg-green-50 hover:scale-102 active:scale-98'
                                                    }`}
                                            >
                                                <div className={`grid size-16 place-items-center rounded-xl transition-all duration-200 ${isActive ? 'scale-110' : ''
                                                    }`}>
                                                    <span className={`text-4xl ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                                        {vehicle.icon}
                                                    </span>
                                                </div>
                                                {vehicle.id === 'AC' && (
                                                    <p className="text-[14.493px] font-black italic text-primary mt-1" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>AC</p>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Divider Line */}
                            <div className="h-[1px] bg-gray-200 mb-4 mx-6"></div>

                            {/* Fare and Payment Cards - Matching Figma styling */}
                            <div className="flex gap-3 mb-4">
                                {/* Your Fare - Clickable */}
                                <button
                                    onClick={() => {
                                        onOpenFareDialog?.()
                                    }}
                                    className="flex flex-1 items-center gap-3 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-left transition-all duration-200 hover:border-primary hover:shadow-md hover:scale-102 active:scale-98 min-h-[82px]"
                                >
                                    <div className="grid size-10 place-items-center">
                                        <svg className="w-6 h-6 text-[#ff3b30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14.069px] font-normal uppercase text-[#919191] mb-1">
                                            YOUR FARE
                                        </p>
                                        <p className="text-[37.517px] font-extrabold text-text-dark leading-none">
                                            {fare} <span className="underline decoration-2 underline-offset-2">Rs.</span>
                                        </p>
                                    </div>
                                </button>

                                {/* Payment Method - Clickable */}
                                <button
                                    onClick={() => {
                                        onOpenPaymentModal?.()
                                    }}
                                    className="flex flex-1 items-center gap-3 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-left transition-all duration-200 hover:border-primary hover:shadow-md hover:scale-102 active:scale-98 min-h-[82px]"
                                >
                                    <div className="grid size-10 place-items-center">
                                        <span className="text-2xl">💵</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14.069px] font-normal uppercase text-[#919191] mb-1">
                                            PAYMENT METHOD
                                        </p>
                                        <p className="text-[19.931px] font-semibold text-text-dark">{paymentMethod}</p>
                                    </div>
                                </button>
                            </div>

                            {/* Action Buttons - Matching Figma exactly */}
                            <div className="flex gap-3 mb-2">
                                <button
                                    onClick={() => {
                                        // Cancel - navigate back to previous screen
                                        onNavigate?.('Ride')
                                    }}
                                    className="flex-1 rounded-[7px] border-[1.172px] border-[#ff4141] bg-[#ff544a] px-6 py-4 text-[19.931px] font-extrabold text-white transition-all duration-200 hover:bg-[#ff3d33] hover:shadow-lg hover:scale-102 active:scale-98 min-h-[52px]"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={() => onProceedToConfirm(selectedHours, selectedVehicle)}
                                    className="flex-1 rounded-[7px] bg-[#32991d] px-6 py-4 text-[19.931px] font-extrabold text-white shadow-[3.517px_3.517px_0px_0px_rgba(50,153,29,0.38)] transition-all duration-200 hover:bg-[#2a7f16] hover:shadow-[4px_4px_0px_0px_rgba(50,153,29,0.38)] hover:scale-102 active:scale-98 min-h-[52px]"
                                >
                                    CONFIRM
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </DraggablePanel>

            {/* Bottom Navigation - Always visible */}
            <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white max-w-full">
                <BottomNav active="Rentals" onNavigate={onNavigate} />
            </div>
        </div>
    )
}
