import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { assets } from '../constants/assets'
import { shopCategories, shops } from '../constants/data'
import { BottomNav } from '../components/BottomNav'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'

interface ShopsHomeScreenProps {
    onNavigate?: (screen: string) => void
    onSelectShop: (shopId: string) => void
    location: string
    onOpenLocationSelect: () => void
    onOpenSidebar?: () => void
    onOpenVoiceActivation?: () => void
}

export function ShopsHomeScreen({
    onNavigate,
    onSelectShop,
    location,
    onOpenLocationSelect,
    onOpenSidebar,
    onOpenVoiceActivation,
}: ShopsHomeScreenProps) {
    const [panelHeight, setPanelHeight] = useState(36) // Slimmer default panel
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null) // Start with no category selected
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)
    const [isMapDragging, setIsMapDragging] = useState(false)
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
        setSelectedLocation([lat, lng])
    }

    const handleMapDragStart = () => {
        setIsMapDragging(true)
        setPanelHeight(20) // Collapse to minimum
    }

    const handleMapDragEnd = () => {
        setIsMapDragging(false)
        setTimeout(() => {
            setPanelHeight(selectedCategory ? 70 : 36) // Expand back to appropriate height
        }, 300)
    }

    // Filter shops based on category and search
    const filteredShops = shops.filter(shop => {
        if (!selectedCategory) return false // Don't show shops until category is selected
        const matchesCategory = shop.category === selectedCategory
        const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && (searchQuery === '' || matchesSearch)
    })

    // Auto-expand panel when category is selected
    useEffect(() => {
        if (selectedCategory) {
            // Smoothly expand to show shops
            setTimeout(() => setPanelHeight(70), 300)
        } else {
            // Reset to initial height when category is deselected
            setPanelHeight(36)
        }
    }, [selectedCategory])

    const handleCategorySelect = (categoryId: string) => {
        if (selectedCategory === categoryId) {
            // If clicking the same category, deselect it
            setSelectedCategory(null)
        } else {
            // Select new category
            setSelectedCategory(categoryId)
        }
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    selectedDropoffLocation={selectedLocation || undefined}
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
                    <div className="h-full w-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Location Pointer - Clean and distinct design */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[120%] z-30 pointer-events-none">
                    <div className="relative">
                        {/* Pointer body - Clean pin without shadows */}
                        <svg className="w-10 h-14 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {/* Center dot for precision */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-[18px] w-2.5 h-2.5 rounded-full bg-white border-2 border-[#3b82f6]"></div>
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
                    className="fixed right-[5.26%] px-4 py-3 rounded-full bg-white/95 border-2 border-[#3b82f6] text-[#1d4ed8] font-semibold shadow-lg flex items-center gap-2 z-[600] hover:bg-[#3b82f6] hover:text-white hover:shadow-xl active:scale-95 transition-all duration-200 ease-out"
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

                {/* Location Card - With green target icon (Figma style) */}
                <button
                    onClick={onOpenLocationSelect}
                    className="absolute left-1/2 top-[25.7%] -translate-x-1/2 w-[254px] min-h-[60px] z-20 active:scale-95 transition-transform duration-200"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3 hover:shadow-xl transition-all duration-200">
                        <div className="grid size-7 place-items-center flex-shrink-0">
                            {/* Green target/crosshair icon for location */}
                            <svg className="w-5 h-5 text-[#6cc44a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                                <circle cx="12" cy="12" r="2" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">SHOPS NEAR</p>
                            <p className="text-base font-normal text-text-dark truncate">{location}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Location Selection Indicator - Consistent pin style */}
                {selectedLocation && (
                    <div className="absolute left-1/2 top-[33.5%] -translate-x-1/2 z-20 pointer-events-none">
                        <div className="relative">
                            {/* Pin shadow */}
                            <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                            {/* Pin body - Blue for shops */}
                            <div className="relative size-[269px] rounded-full bg-[#3b82f6]/20 flex items-center justify-center">
                                <div className="size-[67px] rounded-full bg-[#3b82f6] flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Draggable Bottom Panel - Standardized initial, expands when category selected */}
            <DraggablePanel
                initialHeight={panelHeight}
                minHeight={32}
                maxHeight={82}
                onHeightChange={setPanelHeight}
                hideBottomNav={false}
            >
                <div className="px-6 pb-2">
                    {/* Shops Title - Top left */}
                    <h1 className="font-display text-[32px] font-normal text-[#3b82f6] text-left mb-3 mt-2">
                        Shops
                    </h1>

                    {/* Search Bar */}
                    <div className="mb-3">
                        <div className="flex items-center gap-3 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 shadow-sm focus-within:border-[#3b82f6] focus-within:shadow-md transition-all duration-200">
                            <img src={assets.searchIcon} alt="Search" className="h-5 w-5 opacity-60" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search any store or market in your city"
                                className="flex-1 border-none bg-transparent text-base font-normal text-text-dark placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Category Icons - Always visible */}
                    <div className="mb-3">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-2 text-left">
                            SELECT CATEGORY
                        </p>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {shopCategories.map((category) => {
                                const isActive = selectedCategory === category.id
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category.id)}
                                        className={`flex flex-col items-center gap-2 min-w-[75px] transition-all duration-200 flex-shrink-0 ${isActive ? 'scale-105' : 'hover:scale-102 active:scale-95'
                                            }`}
                                    >
                                        <div
                                            className={`size-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 shadow-sm ${isActive
                                                ? 'shadow-lg border-2 ring-2 ring-offset-2'
                                                : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                                                }`}
                                            style={{
                                                backgroundColor: isActive ? `${category.color}15` : '#ffffff',
                                                borderColor: isActive ? category.color : undefined,
                                                '--tw-ring-color': isActive ? `${category.color}40` : undefined,
                                            } as React.CSSProperties}
                                        >
                                            {category.icon}
                                        </div>
                                        <span
                                            className={`text-xs font-semibold transition-colors duration-200 ${isActive ? 'text-text-dark font-bold' : 'text-gray-600'
                                                }`}
                                        >
                                            {category.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Shop Listings - Only show when category is selected */}
                    {selectedCategory && (
                        <div className="space-y-3">
                            {filteredShops.length > 0 ? (
                                filteredShops.map((shop) => {
                                    const category = shopCategories.find(cat => cat.id === shop.category)
                                    return (
                                        <button
                                            key={shop.id}
                                            onClick={() => onSelectShop(shop.id)}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#c8f0c0] bg-white hover:border-[#3b82f6] hover:shadow-lg hover:bg-blue-50/30 transition-all duration-200 active:scale-[0.98] text-left group"
                                        >
                                            <div
                                                className="size-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm transition-all duration-200 group-hover:scale-110"
                                                style={{
                                                    backgroundColor: category ? `${category.color}20` : '#f3f4f6',
                                                }}
                                            >
                                                {shop.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-semibold text-text-dark truncate group-hover:text-[#3b82f6] transition-colors duration-200">{shop.name}</p>
                                                <p className="text-sm font-normal text-gray-500 mt-1">{category?.label}</p>
                                            </div>
                                            <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                                                <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-base">No shops found</p>
                                    <p className="text-gray-400 text-sm mt-2">Try a different search or category</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DraggablePanel>

            {/* Bottom Navigation - Always visible */}
            <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white max-w-full">
                <BottomNav active="Shops" onNavigate={onNavigate} />
            </div>
        </div>
    )
}
