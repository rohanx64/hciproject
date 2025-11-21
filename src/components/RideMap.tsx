import { useEffect, useRef } from 'react'
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

// Component to handle map recentering when center changes
function MapRecenter({ center }: MapRecenterProps) {
    const map = useMap()

    useEffect(() => {
        map.setView(center, map.getZoom())
    }, [center, map])

    return null
}

interface RideMapProps {
    pickupLocation?: [number, number]
    dropoffLocation?: [number, number]
    className?: string
    onMapClick?: (lat: number, lng: number) => void
}

export function RideMap({
    pickupLocation = [24.8607, 67.0011], // Default: Karachi, Pakistan
    dropoffLocation,
    className = '',
    onMapClick,
}: RideMapProps) {
    const mapRef = useRef<L.Map | null>(null)

    return (
        <div className={`relative ${className}`} style={{ zIndex: 0 }}>
            <MapContainer
                center={pickupLocation}
                zoom={13}
                scrollWheelZoom={false}
                zoomControl={true}
                className="h-full w-full rounded-lg"
                style={{ zIndex: 0 }}
                ref={mapRef}
                whenReady={(map) => {
                    if (onMapClick) {
                        map.target.on('click', (e: L.LeafletMouseEvent) => {
                            onMapClick(e.latlng.lat, e.latlng.lng)
                        })
                    }
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Pickup Marker */}
                <Marker position={pickupLocation} icon={pickupIcon}>
                    <Popup className="custom-popup">
                        <div className="text-center">
                            <p className="font-semibold text-primary">📍 Pickup Location</p>
                            <p className="text-xs text-gray-600 mt-1">Your current location</p>
                        </div>
                    </Popup>
                </Marker>

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

                <MapRecenter center={pickupLocation} />
            </MapContainer>
        </div>
    )
}
