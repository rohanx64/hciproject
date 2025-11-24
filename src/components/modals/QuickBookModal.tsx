import { useState } from 'react'
import { assets } from '../../constants/assets'
import { quickBook, recentLocations } from '../../constants/data'
import { Overlay } from '../Overlay'
import { AppIcon } from '../AppIcon'

interface QuickBookModalProps {
    onConfirm: () => void
    onCancel: () => void
    onAddQuickBook?: (data: {
        pickupLabel: string
        pickupAddress: string
        dropoffLabel: string
        dropoffAddress: string
        price: string
    }) => void
}

interface QuickBookRoute {
    id: string
    pickupLabel: string
    pickupAddress: string
    dropoffLabel: string
    dropoffAddress: string
    price: string
}

export function QuickBookModal({ onConfirm, onCancel, onAddQuickBook }: QuickBookModalProps) {
    const [routes, setRoutes] = useState<QuickBookRoute[]>([
        {
            id: '1',
            pickupLabel: quickBook.pickupLabel,
            pickupAddress: quickBook.pickupAddress,
            dropoffLabel: quickBook.dropoffLabel,
            dropoffAddress: quickBook.dropoffAddress,
            price: quickBook.price,
        },
    ])
    const [showAddForm, setShowAddForm] = useState(false)
    const [newRoute, setNewRoute] = useState({
        pickupLabel: 'PICKUP',
        pickupAddress: 'Select pickup location',
        dropoffLabel: 'DROP-OFF',
        dropoffAddress: 'Select drop-off location',
        price: '',
    })
    const [selectingLocation, setSelectingLocation] = useState<'pickup' | 'dropoff' | null>(null)

    const handleLocationSelect = (location: string) => {
        if (selectingLocation === 'pickup') {
            setNewRoute({ ...newRoute, pickupAddress: location })
        } else if (selectingLocation === 'dropoff') {
            setNewRoute({ ...newRoute, dropoffAddress: location })
        }
        setSelectingLocation(null)
    }

    const handleAddRoute = () => {
        if (newRoute.pickupAddress && newRoute.dropoffAddress && newRoute.price && 
            newRoute.pickupAddress !== 'Select pickup location' && 
            newRoute.dropoffAddress !== 'Select drop-off location') {
            const route: QuickBookRoute = {
                id: Date.now().toString(),
                ...newRoute,
            }
            setRoutes([...routes, route])
            onAddQuickBook?.(route)
            setNewRoute({
                pickupLabel: 'PICKUP',
                pickupAddress: 'Select pickup location',
                dropoffLabel: 'DROP-OFF',
                dropoffAddress: 'Select drop-off location',
                price: '',
            })
            setShowAddForm(false)
        }
    }

    const handleDeleteRoute = (id: string) => {
        setRoutes(routes.filter(r => r.id !== id))
    }

    const handleEditRoute = (route: QuickBookRoute) => {
        // In a real app, this would open an edit form
        console.log('Edit route:', route)
    }

    return (
        <Overlay>
            <div className="w-[400px] max-h-[85vh] rounded-[24px] border-2 border-primary/20 bg-white p-6 text-text-dark shadow-2xl overflow-hidden relative z-[3000]">
                {/* Header */}
                <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide text-primary">
                    Quick Book
                </h2>

                {/* Add button */}
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="mb-4 flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-[#7d7d7d] transition hover:bg-zinc-50"
                    >
                        <span className="grid size-6 place-items-center rounded-full bg-zinc-200 text-lg font-light text-zinc-600">
                            +
                        </span>
                        Add..
                    </button>
                )}

                {/* Add Form */}
                {showAddForm && !selectingLocation && (
                    <div className="mb-4 rounded-2xl border-2 border-primary/30 bg-green-50 p-4 space-y-3">
                        {/* Pickup Location Selector */}
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">
                                Pickup Location
                            </label>
                            <button
                                onClick={() => setSelectingLocation('pickup')}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-white text-sm text-left hover:border-primary transition-colors flex items-center justify-between"
                            >
                                <span className={newRoute.pickupAddress === 'Select pickup location' ? 'text-gray-400' : 'text-text-dark'}>
                                    {newRoute.pickupAddress}
                                </span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Drop-off Location Selector */}
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">
                                Drop-off Location
                            </label>
                            <button
                                onClick={() => setSelectingLocation('dropoff')}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-white text-sm text-left hover:border-primary transition-colors flex items-center justify-between"
                            >
                                <span className={newRoute.dropoffAddress === 'Select drop-off location' ? 'text-gray-400' : 'text-text-dark'}>
                                    {newRoute.dropoffAddress}
                                </span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Price Input */}
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">
                                Price
                            </label>
                            <input
                                type="text"
                                value={newRoute.price}
                                onChange={(e) => setNewRoute({ ...newRoute, price: e.target.value })}
                                placeholder="e.g., RS. 120"
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowAddForm(false)
                                    setNewRoute({
                                        pickupLabel: 'PICKUP',
                                        pickupAddress: 'Select pickup location',
                                        dropoffLabel: 'DROP-OFF',
                                        dropoffAddress: 'Select drop-off location',
                                        price: '',
                                    })
                                    setSelectingLocation(null)
                                }}
                                className="flex-1 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-text-dark hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRoute}
                                className="flex-1 py-2 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                )}

                {/* Location Selection Overlay */}
                {selectingLocation && (
                    <div className="absolute inset-0 bg-white rounded-[24px] z-[3001] p-6 flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-text-dark">
                                Select {selectingLocation === 'pickup' ? 'Pickup' : 'Drop-off'} Location
                            </h3>
                            <button
                                onClick={() => setSelectingLocation(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto">
                            {/* Current Location Option */}
                            <button
                                onClick={() => handleLocationSelect('My current location')}
                                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-green-50 transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="grid size-10 place-items-center rounded-full bg-primary/10 flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-semibold text-text-dark">My current location</span>
                                </div>
                            </button>
                            {/* Recent Locations */}
                            {recentLocations.map((location, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleLocationSelect(location.label)}
                                    className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-green-50 transition-all text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <svg className="w-6 h-6 text-[#ff3b30] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-lg font-semibold text-text-dark">{location.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Route cards - Only show when not selecting location */}
                {!selectingLocation && (
                    <div className="mb-6 space-y-3 max-h-[400px] overflow-y-auto">
                        {routes.map((route) => (
                            <div key={route.id} className="rounded-2xl border-2 border-primary bg-white p-4 shadow-md">
                                <div className="flex gap-3">
                                    {/* Location icons */}
                                    <div className="flex flex-col items-center gap-1 pt-1">
                                        <div className="grid size-5 place-items-center rounded-full bg-yellow-400 text-white">
                                            <AppIcon name="📍" className="text-xs" />
                                        </div>
                                        <div className="h-6 w-0.5 bg-zinc-300" />
                                        <div className="grid size-5 place-items-center rounded-full bg-pink-500 text-white">
                                            <AppIcon name="📍" className="text-xs" />
                                        </div>
                                    </div>

                                    {/* Location details */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a0a0a0]">
                                                {route.pickupLabel}
                                            </p>
                                            <p className="text-sm font-semibold text-text-dark">{route.pickupAddress}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a0a0a0]">
                                                {route.dropoffLabel}
                                            </p>
                                            <p className="text-sm font-semibold text-text-dark">{route.dropoffAddress}</p>
                                        </div>
                                    </div>

                                    {/* Price and vehicle */}
                                    <div className="flex flex-col items-end justify-between">
                                        <div className="rounded-lg bg-primary/10 p-2">
                                            <img src={assets.motoIcon} alt="" className="h-8 w-8" />
                                        </div>
                                        <p className="text-lg font-bold text-primary">{route.price}</p>
                                    </div>
                                </div>

                                {/* Action buttons row */}
                                <div className="mt-3 flex items-center gap-2">
                                    <button
                                        onClick={() => handleDeleteRoute(route.id)}
                                        className="grid size-10 place-items-center rounded-lg bg-[#ff6b6b] text-white transition hover:bg-[#ff5555]"
                                    >
                                        <AppIcon name="🗑️" className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => handleEditRoute(route)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-text-dark transition hover:bg-zinc-50"
                                    >
                                        <AppIcon name="✏️" className="text-base" />
                                        Edit
                                    </button>
                                    <button
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                                        onClick={onConfirm}
                                    >
                                        <AppIcon name="✓" className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Cancel button - Only show when not selecting location */}
                {!selectingLocation && (
                    <button
                        className="w-full rounded-full border-2 border-primary bg-white px-6 py-3 text-center font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </Overlay>
    )
}
