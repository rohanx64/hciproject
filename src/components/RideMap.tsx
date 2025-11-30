import { useRef, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AppIcon } from './AppIcon'
import { useTheme } from '../contexts/ThemeContext'

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

// Custom green marker icon for pickup location - Minimalist style
const pickupIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#34C759" stroke="#fff" stroke-width="2"/>
            <circle cx="12" cy="12" r="5" fill="#fff"/>
        </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
})

// Custom red marker icon for dropoff location - Minimalist style
const dropoffIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#FF3B30" stroke="#fff" stroke-width="2"/>
            <circle cx="12" cy="12" r="5" fill="#fff"/>
        </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
})

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
    zoomLevel?: number
}

// Custom marker icon for selected pickup location (green) - Minimalist style
const selectedPickupIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#34C759" stroke="#fff" stroke-width="3"/>
            <circle cx="16" cy="16" r="7" fill="#fff"/>
        </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
})

// Custom marker icon for selected dropoff location (red) - Minimalist style
const selectedDropoffIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#FF3B30" stroke="#fff" stroke-width="3"/>
            <circle cx="16" cy="16" r="7" fill="#fff"/>
        </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
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
    zoomLevel = 20,
}: RideMapProps) {
    const internalMapRef = useRef<L.Map | null>(null)
    const mapRef = externalMapRef || internalMapRef
    const interactionActiveRef = useRef(false)
    const [mapReady, setMapReady] = useState(false)
    const { resolvedTheme } = useTheme()

    // Set up event listeners when map is ready and callbacks change
    useEffect(() => {
        const mapInstance = mapRef.current
        if (!mapInstance || !mapReady) return

        const container = mapInstance.getContainer()
        let wasDragging = false

        const startInteraction = () => {
            if (!interactionActiveRef.current) {
                interactionActiveRef.current = true
                onDragStart?.()
            }
            container.style.cursor = 'grabbing'
            wasDragging = true
        }

        const endInteraction = () => {
            if (interactionActiveRef.current) {
                interactionActiveRef.current = false
                onDragEnd?.()
            }
            container.style.cursor = 'grab'
            wasDragging = false
        }

        const handleClick = (e: L.LeafletMouseEvent) => {
            // Small delay to check if drag just ended
            setTimeout(() => {
                if (!wasDragging) {
                    onMapClick?.(e.latlng.lat, e.latlng.lng)
                }
                wasDragging = false
            }, 100)
        }

        const handleTouchStart = () => {
            startInteraction()
        }

        const handleTouchEnd = () => {
            setTimeout(() => {
                endInteraction()
            }, 150)
        }

        // Set initial cursor
        container.style.cursor = 'grab'

        // Add event listeners
        mapInstance.on('dragstart', startInteraction)
        mapInstance.on('movestart', startInteraction)
        mapInstance.on('dragend', endInteraction)
        mapInstance.on('moveend', endInteraction)

        if (onMapClick) {
            mapInstance.on('click', handleClick)
        }

        container.addEventListener('touchstart', handleTouchStart, { passive: true })
        container.addEventListener('touchend', handleTouchEnd, { passive: true })

        // Cleanup function
        return () => {
            mapInstance.off('dragstart', startInteraction)
            mapInstance.off('movestart', startInteraction)
            mapInstance.off('dragend', endInteraction)
            mapInstance.off('moveend', endInteraction)
            if (onMapClick) {
                mapInstance.off('click', handleClick)
            }
            container.removeEventListener('touchstart', handleTouchStart)
            container.removeEventListener('touchend', handleTouchEnd)
        }
    }, [mapReady, onDragStart, onDragEnd, onMapClick])

    return (
        <div className={`relative ${className}`} style={{ zIndex: 0, cursor: 'grab' }}>
            <MapContainer
                center={pickupLocation}
                zoom={zoomLevel}
                scrollWheelZoom={false}
                zoomControl={false}
                className="h-full w-full rounded-lg"
                style={{ zIndex: 0, cursor: 'grab' }}
                ref={(instance) => {
                    if (instance && !mapRef.current) {
                        mapRef.current = instance
                        // Trigger useEffect by setting mapReady
                        setTimeout(() => setMapReady(true), 100)
                    }
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={
                        resolvedTheme === 'dark'
                            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                    }
                />

                {/* Pickup Marker - Only show if explicitly requested */}
                {showDefaultPickupMarker && (
                    <Marker position={pickupLocation} icon={pickupIcon}>
                        <Popup className="custom-popup">
                            <div className="text-center">
                                <p className="font-semibold text-primary flex items-center justify-center gap-1">
                                    <AppIcon name="📍" className="text-base" />
                                    Pickup Location
                                </p>
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
                                <p className="font-semibold text-accent flex items-center justify-center gap-1">
                                    <AppIcon name="💖" className="text-base" />
                                    Drop-off Location
                                </p>
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
                                <p className="font-semibold text-primary flex items-center justify-center gap-1">
                                    <AppIcon name="📍" className="text-base" />
                                    Selected Pickup
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Selected Dropoff Location Marker */}
                {selectedDropoffLocation && (
                    <Marker position={selectedDropoffLocation} icon={selectedDropoffIcon}>
                        <Popup className="custom-popup">
                            <div className="text-center">
                                <p className="font-semibold text-red-500 flex items-center justify-center gap-1">
                                    <AppIcon name="📍" className="text-base" />
                                    Selected Drop-off
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}
