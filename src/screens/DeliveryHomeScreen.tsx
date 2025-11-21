import { useState } from 'react'
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
}

export function DeliveryHomeScreen({
    onNavigate,
    onProceedToForm,
    onSelectLocation,
    pickupLocation,
    onOpenPickupSelect,
}: DeliveryHomeScreenProps) {
    const [panelHeight, setPanelHeight] = useState(42) // Standardized height for all screens

    const handleLocationClick = (location: string) => {
        onSelectLocation?.(location)
        onProceedToForm()
    }

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none" style={{ zIndex: 1 }} />

                {/* Profile Avatar - Placeholder */}
                <button
                    className="absolute left-[4.26%] top-[7.64%] size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                    style={{ zIndex: 1000 }}
                    aria-label="Profile"
                    onClick={() => onNavigate?.('Settings')}
                >
                    <div className="h-full w-full bg-gradient-to-br from-[#ff9500] to-[#e68600] flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Location Button - Green circular button with target icon */}
                <button
                    className="absolute bottom-[53%] right-[5.26%] size-[51px] rounded-full bg-[#6cc44a] shadow-lg flex items-center justify-center hover:bg-[#5ab038] active:scale-90 transition-all duration-200"
                    style={{ zIndex: 1000 }}
                    aria-label="Select pickup location"
                    onClick={() => {
                        onOpenPickupSelect?.()
                    }}
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>

                {/* Pickup Location Card - Centered on map */}
                <button
                    onClick={() => {
                        onOpenPickupSelect?.()
                    }}
                    className="absolute left-1/2 top-[25.7%] -translate-x-1/2 w-[254px] active:scale-95 transition-transform duration-200"
                    style={{ zIndex: 1000 }}
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-base font-normal text-text-dark">{pickupLocation}</p>
                        </div>
                        <img src={assets.chevronIcon} alt="" className="h-6 w-6 opacity-70" />
                    </div>
                </button>

                {/* Interactive Location Pin - Clickable orange pin */}
                <button
                    onClick={() => {
                        // Allow user to select location on map
                        console.log('Location pin clicked - open map selection')
                        onProceedToForm()
                    }}
                    className="absolute left-1/2 top-[35%] -translate-x-1/2 cursor-pointer"
                    style={{ zIndex: 1000 }}
                    aria-label="Select location"
                >
                    <div className="relative">
                        {/* Pin shadow */}
                        <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                        {/* Pin body */}
                        <div className="relative size-12 rounded-full bg-[#ff9500] shadow-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </button>
            </section>

            {/* Draggable Bottom Panel */}
            <DraggablePanel
                initialHeight={42}
                minHeight={20}
                maxHeight={85}
                onHeightChange={setPanelHeight}
            >
                <div className="px-6 pb-6">
                    {/* Delivery Title */}
                    <h1 className="font-display text-[42px] font-normal text-[#ff9500] text-center mb-5 mt-6">
                        Delivery
                    </h1>

                    {/* Drop-off Input Card */}
                    <button
                        onClick={onProceedToForm}
                        className="w-full min-h-[68px] rounded-3xl border-2 border-[#c8f0c0] bg-white p-4 shadow-sm mb-4 flex items-center gap-3 hover:bg-green-50 active:scale-[0.98] transition-all duration-200"
                    >
                        <div className="grid size-7 place-items-center flex-shrink-0">
                            <img src={assets.searchIcon} alt="Search" className="h-5 w-5 opacity-70" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-normal uppercase text-[#919191] mb-1">DROP-OFF</p>
                            <p className="text-base font-normal text-text-dark truncate">Where to?</p>
                        </div>
                        <img src={assets.chevronIcon} alt="" className="h-5 w-5 opacity-70 flex-shrink-0" />
                    </button>

                    {/* Suggested Location Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {favoritePlaces.map((place, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleLocationClick(place)}
                                className="px-4 py-2 rounded-[17.5px] border border-[rgba(50,153,29,0.64)] bg-white text-sm font-normal text-text-dark hover:bg-green-50 transition"
                            >
                                {place}
                            </button>
                        ))}
                    </div>

                    {/* Recent Locations List - Only show when panel is expanded */}
                    {panelHeight > 50 && (
                        <div className="mb-6">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-4">RECENT LOCATIONS</p>
                            <div className="space-y-2">
                                {recentLocations.map((location, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleLocationClick(location.label)}
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
