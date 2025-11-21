import { useState } from 'react'
import { assets } from '../constants/assets'
import { BottomNav } from '../components/BottomNav'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'
import type { Location } from '../types'

interface RideExtendedProps {
    dropoffLabel: string
    onEditDropoff: () => void
    recentLocations: Location[]
    onNavigate?: (screen: string) => void
}

export function RideExtendedScreen({ dropoffLabel, onEditDropoff, recentLocations, onNavigate }: RideExtendedProps) {
    const [panelHeight, setPanelHeight] = useState(85)

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen relative">
            {/* Map Section */}
            <section className="absolute inset-0 overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    dropoffLocation={dropoffLabel !== 'Where to?' ? [24.8707, 67.0211] : undefined}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Profile Avatar - Placeholder */}
                <button
                    className="absolute left-[4.26%] top-[7%] size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg z-20 hover:scale-105 active:scale-95 transition-all duration-200"
                    aria-label="Profile"
                    onClick={() => onNavigate?.('Settings')}
                >
                    <div className="h-full w-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Interactive Location Pin - Large pin in center */}
                <div className="absolute left-1/2 top-[22.9%] -translate-x-1/2 z-20 pointer-events-none">
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
            </section>

            {/* Draggable Bottom Panel */}
            <DraggablePanel
                initialHeight={85}
                minHeight={20}
                maxHeight={85}
                onHeightChange={setPanelHeight}
            >
                <div className="px-6">
                    {/* Drag Handle */}
                    <div className="absolute left-1/2 top-3 -translate-x-1/2 w-16 h-1.5 bg-gray-300 rounded-full" />

                    {/* Ride Title */}
                    <h1 className="font-display text-[42px] font-normal text-primary text-center mb-6 mt-6">
                        Ride
                    </h1>

                    {/* Pickup Location Card */}
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white px-4 py-3 mb-3 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="grid size-10 place-items-center rounded-full border-2 border-primary mt-1">
                                <div className="size-2 rounded-full bg-primary"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                                <p className="text-base font-normal text-text-dark">My current location</p>
                            </div>
                            <button className="grid size-6 place-items-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Drop-off Location Card */}
                    <button
                        onClick={onEditDropoff}
                        className="w-full rounded-3xl border-2 border-[#c8f0c0] bg-white px-4 py-3 mb-6 shadow-sm flex items-center gap-3 hover:bg-green-50 transition"
                    >
                        <div className="grid size-10 place-items-center rounded-full bg-[#fde1e8] mt-1">
                            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#919191] mb-1">DROP-OFF</p>
                            <p className="text-base font-normal text-text-dark">{dropoffLabel}</p>
                        </div>
                        <img src={assets.chevronIcon} alt="" className="h-5 w-5 opacity-70" />
                    </button>

                    {/* Divider Line */}
                    <div className="h-[3.5px] bg-gray-200 mb-6 mx-6"></div>

                    {/* Recent Locations List */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#c8c7cc] mb-4">RECENT LOCATIONS</p>
                        <div className="space-y-0">
                            {recentLocations.map((location, idx) => (
                                <div key={idx}>
                                    <button
                                        onClick={() => {
                                            // Handle location selection
                                            onEditDropoff()
                                        }}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition text-left"
                                    >
                                        <div className="size-[14.4px] rounded-full bg-primary"></div>
                                        <span className="flex-1 text-base font-normal text-text-dark">{location.label}</span>
                                        {location.favorite && (
                                            <svg className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
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
                </div>
            </DraggablePanel>

            {/* Bottom Navigation - Always visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white">
                <BottomNav active="Ride" onNavigate={onNavigate} />
            </div>
        </div>
    )
}
