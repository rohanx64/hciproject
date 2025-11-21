import { useState, useEffect } from 'react'
import { assets } from '../constants/assets'
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
}

export function RentalsHomeScreen({
    onNavigate,
    onProceedToConfirm,
    pickupLocation,
    onChangePickup,
    onOpenFareDialog,
    onOpenPaymentModal,
    onOpenPickupSelect,
}: RentalsHomeScreenProps) {
    const [panelHeight, setPanelHeight] = useState(42) // Standardized height for all screens
    const [selectedHours, setSelectedHours] = useState(2)
    const [selectedVehicle, setSelectedVehicle] = useState('Bike')
    const [fare] = useState(900)
    const [paymentMethod] = useState('Cash')
    
    // Check if pickup has been selected (not default)
    // If pickupLocation is "My current location", it means it's the initial state
    // Any other value means user has selected a location via the picker
    const hasSelectedPickup = pickupLocation !== 'My current location' && pickupLocation !== '' && pickupLocation !== 'Where to?' && pickupLocation !== undefined
    
    // Update panel height when pickup is selected - expand smoothly
    useEffect(() => {
        if (hasSelectedPickup) {
            // Smoothly expand to show hours/vehicle selection - auto-adjusted to show all content
            setTimeout(() => setPanelHeight(68), 300)
        } else {
            // Reset to initial height
            setPanelHeight(42)
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
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Profile Avatar - Placeholder */}
                <button
                    className="absolute left-[4.26%] top-[7.64%] size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 z-20"
                    aria-label="Profile"
                    onClick={() => onNavigate?.('Settings')}
                >
                    <div className="h-full w-full bg-gradient-to-br from-[#ffd900] to-[#e6c400] flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Pickup Location Card - At top */}
                <button
                    onClick={() => {
                        onOpenPickupSelect?.()
                    }}
                    className="absolute left-[14.3%] top-[7.74%] w-[347px] min-h-[60px] z-20 active:scale-95 transition-transform duration-200"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3 hover:shadow-xl transition-all duration-200">
                        <div className="grid size-7 place-items-center flex-shrink-0">
                            <div className="size-5 rounded-full border-2 border-primary bg-[#ffd900]"></div>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-[14.069px] font-normal uppercase text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-[19.931px] font-normal text-text-dark truncate">{pickupLocation}</p>
                        </div>
                        <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Yellow location pin on map - only when pickup is selected */}
                {hasSelectedPickup && (
                    <div className="absolute left-1/2 top-[33.5%] -translate-x-1/2 z-20 pointer-events-none">
                        <div className="relative">
                            {/* Pin shadow */}
                            <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                            {/* Pin body - Large yellow pin */}
                            <div className="relative size-[269px] rounded-full bg-[#ffd900]/20 flex items-center justify-center">
                                <div className="size-[67px] rounded-full bg-[#ffd900] flex items-center justify-center shadow-lg">
                                    <div className="size-4 rounded-full bg-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Draggable Bottom Panel - Standardized initial, expands when pickup selected */}
            <DraggablePanel
                initialHeight={showPickupSelection ? 42 : 68}
                minHeight={20}
                maxHeight={85}
                onHeightChange={setPanelHeight}
                hideBottomNav={hasSelectedPickup}
            >
                <div className="px-6 pb-6">
                    {/* Rentals Title - Yellow color matching Figma */}
                    <h1 className="font-display text-[42px] font-normal text-[#ffd900] text-center mb-5 mt-6">
                        Rentals
                    </h1>

                    {showPickupSelection ? (
                        /* Initial State: Pickup Selection */
                        <>
                            <p className="text-center text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-4">
                                SELECT PICKUP LOCATION
                            </p>
                            
                            {/* Suggested Location Tags */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {favoritePlaces.map((place, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleLocationClick(place)}
                                        className="min-h-[44px] px-4 py-2.5 rounded-[17.5px] border border-[rgba(50,153,29,0.64)] bg-white text-sm font-normal text-text-dark hover:bg-green-50 active:scale-95 transition-all duration-200 ease-out"
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
                            <div className="mb-6">
                                <p className="text-center text-[19.931px] font-light text-[#919191] mb-4">SELECT HOURS</p>
                                <div className="flex items-center justify-center gap-6">
                                    {/* Minus Button */}
                                    <button
                                        onClick={() => handleHoursChange(-1)}
                                        className="size-[35px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all duration-200"
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
                                        className="size-[35px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all duration-200"
                                        aria-label="Increase hours"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Divider Line */}
                            <div className="h-[1px] bg-gray-200 mb-6 mx-6"></div>

                            {/* SELECT VEHICLE Section */}
                            <div className="mb-6">
                                <p className="text-center text-[19.931px] font-light text-[#919191] mb-4">SELECT VEHICLE</p>
                                <div className="flex gap-[13px] overflow-x-auto pb-2 scrollbar-hide justify-center">
                                    {vehicles.map((vehicle) => {
                                        const isActive = selectedVehicle === vehicle.id
                                        return (
                                            <button
                                                key={vehicle.id}
                                                onClick={() => setSelectedVehicle(vehicle.id)}
                                                className={`flex min-w-[74.5px] h-[72.7px] flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
                                                    isActive
                                                        ? 'border-[#c8f0c0] bg-[#c8f0c0]/30 shadow-md scale-105'
                                                        : 'border-[#c8f0c0] bg-white hover:bg-green-50 hover:scale-102 active:scale-98'
                                                }`}
                                            >
                                                <div className={`grid size-16 place-items-center rounded-xl transition-all duration-200 ${
                                                    isActive ? 'scale-110' : ''
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
                            <div className="h-[1px] bg-gray-200 mb-6 mx-6"></div>

                            {/* Fare and Payment Cards - Matching Figma styling */}
                            <div className="flex gap-3 mb-6">
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
                            <div className="flex gap-3">
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

            {/* Bottom Navigation - Hide when panel is expanded */}
            {!hasSelectedPickup && (
                <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white transition-opacity duration-300">
                    <BottomNav active="Rentals" onNavigate={onNavigate} />
                </div>
            )}
        </div>
    )
}
