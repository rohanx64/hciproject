import { useState } from 'react'
import { assets } from '../../constants/assets'
import { Overlay } from '../Overlay'

interface Driver {
    id: string
    name: string
    rating: number
    reviewCount: number
    vehicleType: string
    vehicleNumber: string
    fare: number
    estimatedTime: string
    distance: string
    avatar?: string
}

interface RideOffersModalProps {
    onSelectRide: (driverId: string) => void
    onClose: () => void
}

const mockDrivers: Driver[] = [
    {
        id: '1',
        name: 'Ahmed Khan',
        rating: 4.8,
        reviewCount: 234,
        vehicleType: 'Bike',
        vehicleNumber: 'KHI-2341',
        fare: 850,
        estimatedTime: '2 min',
        distance: '0.5 km away',
    },
    {
        id: '2',
        name: 'Hassan Ali',
        rating: 4.9,
        reviewCount: 456,
        vehicleType: 'Bike',
        vehicleNumber: 'KHI-5678',
        fare: 900,
        estimatedTime: '3 min',
        distance: '0.8 km away',
    },
    {
        id: '3',
        name: 'Bilal Ahmed',
        rating: 4.7,
        reviewCount: 189,
        vehicleType: 'Bike',
        vehicleNumber: 'KHI-9012',
        fare: 920,
        estimatedTime: '4 min',
        distance: '1.2 km away',
    },
]

export function RideOffersModal({ onSelectRide, onClose }: RideOffersModalProps) {
    const [selectedDriver, setSelectedDriver] = useState<string | null>(null)

    return (
        <Overlay>
            <div className="w-[400px] max-h-[90vh] overflow-y-auto rounded-[32px] border-2 border-primary bg-white p-6 text-text-dark shadow-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-3xl font-semibold text-primary">Available Rides</h2>
                        <p className="mt-1 text-sm text-[#7d7d7d]">{mockDrivers.length} drivers found nearby</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="grid size-10 place-items-center rounded-full border border-zinc-200 text-2xl text-[#7d7d7d] transition hover:bg-zinc-100"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Driver cards */}
                <div className="space-y-3">
                    {mockDrivers.map((driver, index) => {
                        const isSelected = selectedDriver === driver.id
                        const isBestOffer = index === 0

                        return (
                            <div
                                key={driver.id}
                                onClick={() => setSelectedDriver(driver.id)}
                                className={`relative cursor-pointer rounded-2xl border-2 p-4 transition ${isSelected
                                        ? 'border-primary bg-primary/5 shadow-lg'
                                        : 'border-zinc-200 bg-white hover:border-primary/40 hover:shadow-md'
                                    }`}
                            >
                                {/* Best offer badge */}
                                {isBestOffer && (
                                    <div className="absolute -top-2 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                                        Best Offer
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    {/* Driver avatar */}
                                    <div className="relative">
                                        <div className="size-16 overflow-hidden rounded-full border-2 border-primary/20 bg-zinc-100">
                                            {driver.avatar ? (
                                                <img src={driver.avatar} alt={driver.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center text-2xl text-primary">
                                                    {driver.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        {/* Online indicator */}
                                        <div className="absolute bottom-0 right-0 size-4 rounded-full border-2 border-white bg-green-500" />
                                    </div>

                                    {/* Driver info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-text-dark">{driver.name}</h3>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-yellow-500">⭐</span>
                                                        <span className="text-sm font-semibold text-text-dark">{driver.rating}</span>
                                                        <span className="text-xs text-[#7d7d7d]">({driver.reviewCount})</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-extrabold text-primary">{driver.fare} Rs.</p>
                                                <p className="text-xs text-[#7d7d7d]">Total fare</p>
                                            </div>
                                        </div>

                                        {/* Vehicle and timing info */}
                                        <div className="mt-3 flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1">
                                                <img src={assets.motoIcon} alt="" className="h-4 w-4" />
                                                <span className="font-medium text-text-dark">{driver.vehicleType}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#7d7d7d]">
                                                <span>🕐</span>
                                                <span className="font-medium">{driver.estimatedTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#7d7d7d]">
                                                <span>📍</span>
                                                <span className="text-xs">{driver.distance}</span>
                                            </div>
                                        </div>

                                        {/* Vehicle number */}
                                        <div className="mt-2 inline-block rounded-md border border-zinc-300 bg-white px-2 py-1">
                                            <p className="text-xs font-mono font-semibold text-text-dark">{driver.vehicleNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-primary">
                                        <span className="text-sm text-white">✓</span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-2xl border-2 border-zinc-200 bg-white px-4 py-4 text-lg font-extrabold uppercase text-[#7d7d7d] transition hover:bg-zinc-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => selectedDriver && onSelectRide(selectedDriver)}
                        disabled={!selectedDriver}
                        className={`flex-1 rounded-2xl px-4 py-4 text-lg font-extrabold uppercase text-white shadow-card transition ${selectedDriver
                                ? 'bg-primary hover:bg-primary-dark'
                                : 'cursor-not-allowed bg-zinc-300'
                            }`}
                    >
                        Confirm Ride
                    </button>
                </div>

                {/* Info footer */}
                <p className="mt-4 text-center text-xs text-[#7d7d7d]">
                    Prices may vary based on traffic and demand
                </p>
            </div>
        </Overlay>
    )
}
