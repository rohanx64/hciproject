import { useState } from 'react'
import { assets } from '../constants/assets'
import { favoritePlaces, recentLocations } from '../constants/data'
import { BottomNav } from '../components/BottomNav'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'

interface HomeRideProps {
    onOpenQuickBook: () => void
    onOpenDropoff: () => void
    dropoffLabel: string
    onNavigate?: (screen: string) => void
}

export function HomeRideScreen({ onOpenQuickBook, onOpenDropoff, dropoffLabel, onNavigate }: HomeRideProps) {
    const [panelHeight, setPanelHeight] = useState(42) // Standardized height for all screens

    const handleLocationClick = (location: string) => {
        // Location will be set when dropoff screen is opened
        onOpenDropoff()
    }

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
                    className="absolute left-[4.26%] top-[7.64%] size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg z-20 hover:scale-105 active:scale-95 transition-all duration-200"
                    aria-label="Profile"
                    onClick={() => onNavigate?.('Settings')}
                >
                    <div className="h-full w-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Quick Book Button - Green button at top */}
                <button
                    onClick={onOpenQuickBook}
                    className="absolute left-1/2 top-[18.8%] -translate-x-1/2 w-[255px] min-h-[56px] z-20 active:scale-95 transition-transform duration-200 ease-out"
                >
                    <div className="rounded-3xl bg-primary px-6 py-3.5 shadow-lg flex items-center justify-between hover:shadow-xl transition-all duration-200">
                        <span className="text-[25.688px] font-extrabold text-white uppercase">QUICK BOOK</span>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Pickup Location Card - Centered on map with green dot */}
                <button
                    onClick={onOpenDropoff}
                    className="absolute left-1/2 top-[25.7%] -translate-x-1/2 w-[254px] min-h-[75px] z-20 active:scale-95 transition-transform duration-200 ease-out"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3 hover:shadow-xl transition-all duration-200">
                        <div className="grid size-10 place-items-center rounded-full border-2 border-primary flex-shrink-0">
                            <div className="size-3 rounded-full bg-primary"></div>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-base font-normal text-text-dark truncate">My current location</p>
                        </div>
                        <button
                            className="grid size-6 place-items-center flex-shrink-0"
                            onClick={(e) => {
                                e.stopPropagation()
                                // Handle location button click
                            }}
                        >
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </button>

                {/* Interactive Location Pin - Large pin in center */}
                <div className="absolute left-1/2 top-[33.5%] -translate-x-1/2 z-20 pointer-events-none">
                    <div className="relative">
                        {/* Pin shadow */}
                        <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                        {/* Pin body - Large green pin */}
                        <div className="relative size-[269px] rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="size-[67px] rounded-full bg-primary flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Voice Button - Left side */}
                <button
                    className="absolute left-[5.68%] bottom-[53%] min-w-[51px] min-h-[51px] rounded-full border border-[rgba(50,153,29,0.64)] bg-white shadow-lg flex items-center justify-center z-20 hover:bg-green-50 active:scale-90 transition-all duration-200 ease-out"
                    aria-label="Voice input"
                >
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
                        <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z" />
                        <path d="M12 18.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-3 0v-3a1.5 1.5 0 011.5-1.5z" />
                    </svg>
                </button>

                {/* Location Button - Green circular button with target icon */}
                <button
                    className="absolute bottom-[53%] right-[5.26%] min-w-[51px] min-h-[51px] rounded-full bg-[#6cc44a] shadow-lg flex items-center justify-center z-20 hover:bg-[#5ab038] active:scale-90 transition-all duration-200 ease-out"
                    aria-label="Use current location"
                    onClick={() => {
                        // Get current location
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                                console.log('Current location:', position.coords.latitude, position.coords.longitude)
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

            {/* Draggable Bottom Panel */}
            <DraggablePanel
                initialHeight={42}
                minHeight={20}
                maxHeight={85}
                onHeightChange={setPanelHeight}
            >
                <div className="px-6 pb-6">
                    {/* Ride Title - Large green text */}
                    <h1 className="font-display text-[42px] font-normal text-primary text-center mb-5 mt-6">
                        Ride
                    </h1>

                    {/* Drop-off Input Card - With red pin icon */}
                    <button
                        onClick={onOpenDropoff}
                        className="w-full min-h-[68px] rounded-3xl border-2 border-[#c8f0c0] bg-white p-4 shadow-sm mb-4 flex items-center gap-3 hover:bg-green-50 active:scale-[0.98] transition-all duration-200 ease-out"
                    >
                        <div className="grid size-7 place-items-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#ff3b30]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-normal uppercase text-[#919191] mb-1">DROP-OFF</p>
                            <p className="text-base font-normal text-text-dark truncate">{dropoffLabel}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Suggested Location Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
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

                    {/* Recent Locations List - Only show when panel is expanded */}
                    {panelHeight > 50 && (
                        <div className="mb-6">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-4">RECENT LOCATIONS</p>
                            <div className="space-y-0">
                                {recentLocations.map((location, idx) => (
                                    <div key={idx}>
                                        <button
                                            onClick={() => handleLocationClick(location.label)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition text-left min-h-[52px]"
                                        >
                                            <div className="size-[14.4px] rounded-full bg-primary flex-shrink-0"></div>
                                            <span className="flex-1 text-base font-normal text-text-dark text-left">{location.label}</span>
                                            {location.favorite && (
                                                <svg className="w-6 h-6 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            )}
                                        </button>
                                        {idx < recentLocations.length - 1 && (
                                            <div className="h-[3.5px] bg-gray-200 mx-3"></div>
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
                <BottomNav active="Ride" onNavigate={onNavigate} />
            </div>
        </div>
    )
}
