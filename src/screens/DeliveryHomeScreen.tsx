import { useState, useRef, useEffect } from 'react'
import L from 'leaflet'
import { favoritePlaces, recentLocations } from '../constants/data'
import { BottomNav } from '../components/BottomNav'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'

const PANEL_BASE_MIN_HEIGHT = 30
const PANEL_DRAG_MIN_HEIGHT = 12
const PANEL_RESTORE_DELAY = 220

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
    const [panelHeight, setPanelHeight] = useState(36) // Slimmer default panel
    const [panelMinHeight, setPanelMinHeight] = useState(PANEL_BASE_MIN_HEIGHT)
    const panelHeightBeforeDragRef = useRef<number | null>(null)
    const [selectedPickupLocation, setSelectedPickupLocation] = useState<[number, number] | null>(null)
    const [selectedDropoffLocation, setSelectedDropoffLocation] = useState<[number, number] | null>(null)
    const mapRef = useRef<L.Map | null>(null)
    const panelContentRef = useRef<HTMLDivElement>(null)
    const isMapDraggingRef = useRef(false)
    
    // Horizontal scroll refs for location buttons
    const favoritePlacesScrollRef = useRef<HTMLDivElement>(null)
    const recentLocationsScrollRef = useRef<HTMLDivElement>(null)
    const [isDraggingFavorites, setIsDraggingFavorites] = useState(false)
    const [isDraggingRecent, setIsDraggingRecent] = useState(false)
    const [startXFavorites, setStartXFavorites] = useState(0)
    const [startXRecent, setStartXRecent] = useState(0)
    const [scrollLeftFavorites, setScrollLeftFavorites] = useState(0)
    const [scrollLeftRecent, setScrollLeftRecent] = useState(0)
    const hasDraggedFavoritesRef = useRef(false)
    const hasDraggedRecentRef = useRef(false)

    // Calculate button position in pixels based on panel height percentage
    // Use window.innerHeight to match DraggablePanel
    const [containerHeight, setContainerHeight] = useState(window.innerHeight)

    useEffect(() => {
        const handleResize = () => setContainerHeight(window.innerHeight)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Calculate optimal panel height based on content
    useEffect(() => {
        if (!panelContentRef.current || isMapDraggingRef.current) return
        
        const calculateOptimalHeight = () => {
            // Skip calculation if map is being dragged
            if (isMapDraggingRef.current) return
            
            const content = panelContentRef.current
            if (!content) return
            
            const contentHeight = content.scrollHeight
            const padding = 48
            const totalNeededHeight = contentHeight + padding
            
            const bottomNavHeight = 110
            const availableHeight = containerHeight - bottomNavHeight
            const optimalPercent = Math.min(82, Math.max(30, (totalNeededHeight / availableHeight) * 100))
            
            if (Math.abs(panelHeight - optimalPercent) > 2) {
                setPanelHeight(optimalPercent)
                setPanelMinHeight(Math.max(PANEL_BASE_MIN_HEIGHT, optimalPercent * 0.7))
            }
        }
        
        const timeoutId = setTimeout(calculateOptimalHeight, 100)
        const observer = new ResizeObserver(() => {
            if (!isMapDraggingRef.current) {
                calculateOptimalHeight()
            }
        })
        
        if (panelContentRef.current) {
            observer.observe(panelContentRef.current)
        }
        
        return () => {
            clearTimeout(timeoutId)
            observer.disconnect()
        }
    }, [containerHeight, panelHeight])

    // Global mouse event handlers for favorite places scrolling
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDraggingFavorites || !favoritePlacesScrollRef.current) return
            e.preventDefault()
            hasDraggedFavoritesRef.current = true
            const x = e.pageX - favoritePlacesScrollRef.current.offsetLeft
            const walk = (x - startXFavorites) * 2
            favoritePlacesScrollRef.current.scrollLeft = scrollLeftFavorites - walk
        }

        const handleGlobalMouseUp = () => {
            setIsDraggingFavorites(false)
        }

        if (isDraggingFavorites) {
            document.addEventListener('mousemove', handleGlobalMouseMove)
            document.addEventListener('mouseup', handleGlobalMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleGlobalMouseMove)
                document.removeEventListener('mouseup', handleGlobalMouseUp)
            }
        }
    }, [isDraggingFavorites, startXFavorites, scrollLeftFavorites])

    // Global mouse event handlers for recent locations scrolling
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDraggingRecent || !recentLocationsScrollRef.current) return
            e.preventDefault()
            hasDraggedRecentRef.current = true
            const x = e.pageX - recentLocationsScrollRef.current.offsetLeft
            const walk = (x - startXRecent) * 2
            recentLocationsScrollRef.current.scrollLeft = scrollLeftRecent - walk
        }

        const handleGlobalMouseUp = () => {
            setIsDraggingRecent(false)
        }

        if (isDraggingRecent) {
            document.addEventListener('mousemove', handleGlobalMouseMove)
            document.addEventListener('mouseup', handleGlobalMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleGlobalMouseMove)
                document.removeEventListener('mouseup', handleGlobalMouseUp)
            }
        }
    }, [isDraggingRecent, startXRecent, scrollLeftRecent])

    const bottomNavHeight = 110
    const availableHeight = containerHeight - bottomNavHeight
    const panelHeightPixels = (panelHeight / 100) * availableHeight
    const buttonBottomPixels = bottomNavHeight + panelHeightPixels + 6
    const dropoffCardStyle = { minHeight: 'calc(58px * var(--app-scale, 1))' }

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
        isMapDraggingRef.current = true
        if (panelHeightBeforeDragRef.current === null) {
            panelHeightBeforeDragRef.current = panelHeight
        }
        setPanelMinHeight(PANEL_DRAG_MIN_HEIGHT)
        setPanelHeight(PANEL_DRAG_MIN_HEIGHT)
    }

    const handleMapDragEnd = () => {
        setTimeout(() => {
            isMapDraggingRef.current = false
            const fallback = Math.max(panelHeightBeforeDragRef.current ?? 36, PANEL_BASE_MIN_HEIGHT)
            panelHeightBeforeDragRef.current = null
            setPanelMinHeight(PANEL_BASE_MIN_HEIGHT)
            setPanelHeight(fallback)
        }, PANEL_RESTORE_DELAY)
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

                {/* Profile Avatar - Enhanced with better affordance */}
                <button
                    className="absolute left-[4.26%] top-[7.64%] size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg z-20 hover:scale-105 hover-lift active:animate-button-press transition-all duration-200 group"
                    aria-label="Open menu"
                    onClick={() => onOpenSidebar?.()}
                    title="Tap to open menu"
                >
                    <div className="h-full w-full bg-gradient-to-br from-[#ff9500] to-[#e68600] flex items-center justify-center relative">
                        <span className="text-2xl text-white font-bold">R</span>
                        {/* Enhanced indicator for pullable area - More visible */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 opacity-70 group-hover:opacity-100 transition-all duration-200 group-hover:scale-110">
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                        </div>
                    </div>
                </button>

                {/* Location Pointer - Clean and distinct design */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[120%] z-30 pointer-events-none">
                    <div
                        className="relative"
                        style={{ transform: 'scale(var(--app-scale, 1))', transformOrigin: 'center bottom' }}
                    >
                        {/* Pointer body - Clean pin without shadows */}
                        <svg className="w-10 h-14 text-[#ff9500]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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
                    style={{ 
                        bottom: `${buttonBottomPixels}px`,
                        transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClick={onOpenVoiceActivation}
                    className="fixed left-[5.68%] px-4 py-3 rounded-full bg-primary/95 backdrop-blur-sm shadow-lg border-2 border-white flex items-center gap-2 z-[600] hover:bg-primary hover-lift active:animate-button-press transition-colors duration-200 ease-out"
                    aria-label="Voice input"
                >
                    <svg className="w-5 h-5 text-white animate-subtle-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
                        <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z" />
                        <path d="M12 18.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-3 0v-3a1.5 1.5 0 011.5-1.5z" />
                    </svg>
                    <span className="text-base font-extrabold text-white uppercase tracking-wide">Voice</span>
                </button>

                {/* Location Button - Dynamically positioned above panel */}
                <button
                    style={{ 
                        bottom: `${buttonBottomPixels}px`,
                        transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="fixed right-[5.26%] px-4 py-3 rounded-full bg-white/95 border-2 border-[#ff9500] text-[#ff9500] font-semibold shadow-lg flex items-center gap-2 z-[600] hover:bg-[#ff9500] hover:text-white hover-lift active:animate-button-press transition-colors duration-200 ease-out"
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
                minHeight={panelMinHeight}
                maxHeight={82}
                onHeightChange={setPanelHeight}
                hideBottomNav={false}
            >
                <div ref={panelContentRef} className="px-6 pb-2">
                    {/* Delivery Title - Top left */}
                    <h1 className="font-display text-[32px] font-extrabold text-[#ff9500] text-left mb-3 mt-2">
                        Delivery
                    </h1>

                    {/* Drop-off Input Card - With red pin icon (Figma style) */}
                    <button
                        onClick={onProceedToForm}
                        className="w-full rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 shadow-sm mb-3 flex items-center gap-3 hover:bg-green-50 hover:border-[#ff9500] hover-lift active:animate-button-press transition-all duration-200 group"
                        style={dropoffCardStyle}
                    >
                        <div className="grid size-7 place-items-center flex-shrink-0">
                            {/* Red location pin icon */}
                            <svg className="w-5 h-5 text-[#ff3b30]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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

                    {/* Suggested Location Tags - Horizontal Scrollable */}
                    <div className="mb-3">
                        <div 
                            ref={favoritePlacesScrollRef}
                            onMouseDown={(e) => {
                                if (!favoritePlacesScrollRef.current) return
                                setIsDraggingFavorites(true)
                                hasDraggedFavoritesRef.current = false
                                setStartXFavorites(e.pageX - favoritePlacesScrollRef.current.offsetLeft)
                                setScrollLeftFavorites(favoritePlacesScrollRef.current.scrollLeft)
                            }}
                            onMouseMove={(e) => {
                                if (!isDraggingFavorites || !favoritePlacesScrollRef.current) return
                                e.preventDefault()
                                hasDraggedFavoritesRef.current = true
                                const x = e.pageX - favoritePlacesScrollRef.current.offsetLeft
                                const walk = (x - startXFavorites) * 2
                                favoritePlacesScrollRef.current.scrollLeft = scrollLeftFavorites - walk
                            }}
                            onMouseUp={() => setIsDraggingFavorites(false)}
                            onMouseLeave={() => setIsDraggingFavorites(false)}
                            className={`w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide scroll-smooth -mx-6 px-6 ${isDraggingFavorites ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                            style={{ 
                                scrollbarWidth: 'none', 
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch',
                                touchAction: 'pan-x pinch-zoom',
                                userSelect: 'none'
                            }}
                        >
                            <div className="flex gap-2" style={{ width: 'max-content' }}>
                                {favoritePlaces.map((place, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            if (hasDraggedFavoritesRef.current) {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                hasDraggedFavoritesRef.current = false
                                                return
                                            }
                                            handleLocationClick(place)
                                        }}
                                        className="flex-shrink-0 min-h-[44px] px-4 py-2.5 rounded-[17.5px] border border-[rgba(50,153,29,0.64)] bg-white text-sm font-normal text-text-dark hover:bg-green-50 hover:border-[#32991d] hover-lift active:animate-button-press transition-all duration-200 ease-out"
                                    >
                                        {place}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Locations - Horizontal Scrollable Chips */}
                    {panelHeight > 50 && (
                        <div className="mb-3">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-3">RECENT LOCATIONS</p>
                            <div 
                                ref={recentLocationsScrollRef}
                                onMouseDown={(e) => {
                                    if (!recentLocationsScrollRef.current) return
                                    setIsDraggingRecent(true)
                                    hasDraggedRecentRef.current = false
                                    setStartXRecent(e.pageX - recentLocationsScrollRef.current.offsetLeft)
                                    setScrollLeftRecent(recentLocationsScrollRef.current.scrollLeft)
                                }}
                                onMouseMove={(e) => {
                                    if (!isDraggingRecent || !recentLocationsScrollRef.current) return
                                    e.preventDefault()
                                    hasDraggedRecentRef.current = true
                                    const x = e.pageX - recentLocationsScrollRef.current.offsetLeft
                                    const walk = (x - startXRecent) * 2
                                    recentLocationsScrollRef.current.scrollLeft = scrollLeftRecent - walk
                                }}
                                onMouseUp={() => setIsDraggingRecent(false)}
                                onMouseLeave={() => setIsDraggingRecent(false)}
                                className={`w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide scroll-smooth -mx-6 px-6 ${isDraggingRecent ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                                style={{ 
                                    scrollbarWidth: 'none', 
                                    msOverflowStyle: 'none',
                                    WebkitOverflowScrolling: 'touch',
                                    touchAction: 'pan-x pinch-zoom',
                                    userSelect: 'none'
                                }}
                            >
                                <div className="flex gap-2" style={{ width: 'max-content' }}>
                                    {recentLocations.map((location, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => {
                                                if (hasDraggedRecentRef.current) {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    hasDraggedRecentRef.current = false
                                                    return
                                                }
                                                handleLocationClick(location.label)
                                            }}
                                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-[17.5px] border border-[rgba(50,153,29,0.64)] bg-white text-sm font-normal text-text-dark hover:bg-green-50 hover-lift active:animate-button-press transition-all duration-200 ease-out"
                                        >
                                            <svg className="w-4 h-4 text-[#ff3b30] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            <span>{location.label}</span>
                                            {location.favorite && (
                                                <svg className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DraggablePanel>

            {/* Bottom Navigation - Always visible at bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white max-w-full">
                <BottomNav active="Delivery" onNavigate={onNavigate} />
            </div>
        </div>
    )
}
