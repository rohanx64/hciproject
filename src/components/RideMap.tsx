import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})

// Custom green marker icon for pickup location
const pickupIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="46" viewBox="0 0 32 46">
            <path fill="#6cc44a" stroke="#fff" stroke-width="2" d="M16 1c-7.732 0-14 6.268-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z"/>
            <circle cx="16" cy="15" r="6" fill="#fff"/>
        </svg>
    `),
    iconSize: [32, 46],
    iconAnchor: [16, 46],
    popupAnchor: [0, -46],
})

// Custom pink marker icon for dropoff location
const dropoffIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="46" viewBox="0 0 32 46">
            <path fill="#f06292" stroke="#fff" stroke-width="2" d="M16 1c-7.732 0-14 6.268-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z"/>
            <circle cx="16" cy="15" r="6" fill="#fff"/>
        </svg>
    `),
    iconSize: [32, 46],
    iconAnchor: [16, 46],
    popupAnchor: [0, -46],
})

interface MapRecenterProps {
    center: [number, number]
}

// Component to handle map recentering when center changes (only on initial load)
function MapRecenter({ center }: MapRecenterProps) {
    const map = useMap()
    const isInitialMount = useRef(true)
    const [isUserDragging, setIsUserDragging] = useState(false)

    useEffect(() => {
        // Listen to drag events to prevent recentering during user interaction
        const handleDragStart = () => setIsUserDragging(true)
        const handleDragEnd = () => {
            setIsUserDragging(false)
        }
        
        map.on('dragstart', handleDragStart)
        map.on('dragend', handleDragEnd)
        
        return () => {
            map.off('dragstart', handleDragStart)
            map.off('dragend', handleDragEnd)
        }
    }, [map])

    useEffect(() => {
        // Only recenter on initial mount, not on every center change or during user drag
        if (isInitialMount.current && !isUserDragging) {
            map.setView(center, map.getZoom())
            isInitialMount.current = false
        }
    }, [center, map, isUserDragging])

    return null
}

interface RideMapProps {
    pickupLocation?: [number, number]
    dropoffLocation?: [number, number]
    selectedPickupLocation?: [number, number] // User-selected pickup
    selectedDropoffLocation?: [number, number] // User-selected dropoff
    className?: string
    onMapClick?: (lat: number, lng: number) => void
    onDragStart?: () => void
    onDragEnd?: () => void
    mapRef?: React.MutableRefObject<L.Map | null> // Ref to expose map instance
    showDefaultPickupMarker?: boolean // Option to hide default pickup marker
}

// Custom marker icon for selected pickup location (green)
const selectedPickupIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="56" viewBox="0 0 40 56">
            <path fill="#6cc44a" stroke="#fff" stroke-width="3" d="M20 2c-8.837 0-16 7.163-16 16 0 12 16 30 16 30s16-18 16-30c0-8.837-7.163-16-16-16z"/>
            <circle cx="20" cy="18" r="8" fill="#fff"/>
            <circle cx="20" cy="18" r="4" fill="#6cc44a"/>
        </svg>
    `),
    iconSize: [40, 56],
    iconAnchor: [20, 56],
    popupAnchor: [0, -56],
})

// Custom marker icon for selected dropoff location (red)
const selectedDropoffIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="56" viewBox="0 0 40 56">
            <path fill="#ff3b30" stroke="#fff" stroke-width="3" d="M20 2c-8.837 0-16 7.163-16 16 0 12 16 30 16 30s16-18 16-30c0-8.837-7.163-16-16-16z"/>
            <circle cx="20" cy="18" r="8" fill="#fff"/>
            <circle cx="20" cy="18" r="4" fill="#ff3b30"/>
        </svg>
    `),
    iconSize: [40, 56],
    iconAnchor: [20, 56],
    popupAnchor: [0, -56],
})

export function RideMap({
    pickupLocation = [24.8607, 67.0011], // Default: Karachi, Pakistan
    dropoffLocation,
    selectedPickupLocation,
    selectedDropoffLocation,
    className = '',
    onMapClick,
    onDragStart,
    onDragEnd,
    mapRef: externalMapRef,
    showDefaultPickupMarker = false, // Hide default pickup marker by default
}: RideMapProps) {
    const internalMapRef = useRef<L.Map | null>(null)
    const mapRef = externalMapRef || internalMapRef

    return (
        <div className={`relative ${className}`} style={{ zIndex: 0, cursor: 'grab' }}>
            <MapContainer
                center={pickupLocation}
                zoom={13}
                scrollWheelZoom={false}
                zoomControl={false}
                className="h-full w-full rounded-lg"
                style={{ zIndex: 0, cursor: 'grab' }}
                ref={mapRef}
                whenReady={(map) => {
                    const mapInstance = map.target
                    mapRef.current = mapInstance // Expose map instance via ref
                    const container = mapInstance.getContainer()
                    let wasDragging = false
                    
                    // Set initial cursor
                    container.style.cursor = 'grab'
                    
                    // Handle drag start - when user starts dragging the map
                    if (onDragStart) {
                        mapInstance.on('dragstart', () => {
                            wasDragging = true
                            onDragStart()
                            container.style.cursor = 'grabbing'
                        })
                    }
                    
                    // Handle drag end - when user stops dragging
                    if (onDragEnd) {
                        mapInstance.on('dragend', () => {
                            wasDragging = false
                            onDragEnd()
                            container.style.cursor = 'grab'
                        })
                    }
                    
                    // Handle map click (only if it wasn't a drag)
                    if (onMapClick) {
                        mapInstance.on('click', (e: L.LeafletMouseEvent) => {
                            // Small delay to check if drag just ended
                            setTimeout(() => {
                                if (!wasDragging) {
                                    onMapClick(e.latlng.lat, e.latlng.lng)
                                }
                                wasDragging = false
                            }, 100)
                        })
                    }
                    
                    // Handle touch events for mobile
                    if (onDragStart && onDragEnd) {
                        container.addEventListener('touchstart', () => {
                            wasDragging = false
                            onDragStart()
                        }, { passive: true })
                        
                        container.addEventListener('touchend', () => {
                            setTimeout(() => {
                                onDragEnd()
                            }, 150)
                        }, { passive: true })
                    }
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Pickup Marker - Only show if explicitly requested */}
                {showDefaultPickupMarker && (
                    <Marker position={pickupLocation} icon={pickupIcon}>
                        <Popup className="custom-popup">
                            <div className="text-center">
                                <p className="font-semibold text-primary">📍 Pickup Location</p>
                                <p className="text-xs text-gray-600 mt-1">Your current location</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Dropoff Marker (if provided) */}
                {dropoffLocation && (
                    <Marker position={dropoffLocation} icon={dropoffIcon}>
                        <Popup className="custom-popup">
                            <div className="text-center">
                                <p className="font-semibold text-accent">💖 Drop-off Location</p>
                                <p className="text-xs text-gray-600 mt-1">Your destination</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Selected Pickup Location Marker */}
                {selectedPickupLocation && (
                    <Marker position={selectedPickupLocation} icon={selectedPickupIcon}>
                        <Popup className="custom-popup">
                            <div className="text-center">
                                <p className="font-semibold text-primary">📍 Selected Pickup</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Selected Dropoff Location Marker */}
                {selectedDropoffLocation && (
                    <Marker position={selectedDropoffLocation} icon={selectedDropoffIcon}>
                        <Popup className="custom-popup">
                            <div className="text-center">
                                <p className="font-semibold text-red-500">📍 Selected Drop-off</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}
