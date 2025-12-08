import { useState, useEffect } from 'react'
import { assets } from '../../constants/assets'
import { Overlay } from '../Overlay'
import { AppIcon } from '../AppIcon'

export interface QuickBookRoute {
    id: string
    pickupLabel: string
    pickupAddress: string
    dropoffLabel: string
    dropoffAddress: string
    price: string
}

interface QuickBookModalProps {
    onConfirm: (route: QuickBookRoute) => void
    onCancel: () => void
    routes: QuickBookRoute[]
    onRoutesChange: (routes: QuickBookRoute[]) => void
    initialNewRoute?: Partial<QuickBookRoute>
    onSelectLocation: (type: 'pickup' | 'dropoff', currentRoute: Partial<QuickBookRoute>, isEditingId?: string) => void
}

export function QuickBookModal({
    onConfirm,
    onCancel,
    routes,
    onRoutesChange,
    initialNewRoute,
    onSelectLocation
}: QuickBookModalProps) {
    const [showAddForm, setShowAddForm] = useState(!!initialNewRoute?.pickupAddress || !!initialNewRoute?.dropoffAddress)
    const [editingId, setEditingId] = useState<string | undefined>(initialNewRoute?.id)

    const [newRoute, setNewRoute] = useState<Partial<QuickBookRoute>>({
        pickupLabel: 'PICKUP',
        pickupAddress: 'Select pickup location',
        dropoffLabel: 'DROP-OFF',
        dropoffAddress: 'Select drop-off location',
        price: '',
        ...initialNewRoute
    })

    // Update local state if initialNewRoute changes (e.g. returning from selection)
    useEffect(() => {
        if (initialNewRoute) {
            setNewRoute(prev => ({ ...prev, ...initialNewRoute }))
            setShowAddForm(true)
            if (initialNewRoute.id) {
                setEditingId(initialNewRoute.id)
            }
        }
    }, [initialNewRoute])

    const handleLocationClick = (type: 'pickup' | 'dropoff') => {
        onSelectLocation(type, newRoute, editingId)
    }

    const handleSaveRoute = () => {
        if (newRoute.pickupAddress && newRoute.dropoffAddress && newRoute.price &&
            newRoute.pickupAddress !== 'Select pickup location' &&
            newRoute.dropoffAddress !== 'Select drop-off location') {

            if (editingId) {
                // Update existing route
                const updatedRoutes = routes.map(r =>
                    r.id === editingId
                        ? { ...r, ...newRoute } as QuickBookRoute
                        : r
                )
                onRoutesChange(updatedRoutes)
            } else {
                // Add new route
                const route: QuickBookRoute = {
                    id: Date.now().toString(),
                    pickupLabel: newRoute.pickupLabel || 'PICKUP',
                    pickupAddress: newRoute.pickupAddress!,
                    dropoffLabel: newRoute.dropoffLabel || 'DROP-OFF',
                    dropoffAddress: newRoute.dropoffAddress!,
                    price: newRoute.price!
                }
                onRoutesChange([...routes, route])
            }

            // Reset form
            setNewRoute({
                pickupLabel: 'PICKUP',
                pickupAddress: 'Select pickup location',
                dropoffLabel: 'DROP-OFF',
                dropoffAddress: 'Select drop-off location',
                price: '',
            })
            setEditingId(undefined)
            setShowAddForm(false)
        }
    }

    const handleDeleteRoute = (id: string) => {
        onRoutesChange(routes.filter(r => r.id !== id))
    }

    const handleEditRoute = (route: QuickBookRoute) => {
        setNewRoute(route)
        setEditingId(route.id)
        setShowAddForm(true)
    }

    return (
        <Overlay>
            <div className="w-[400px] max-h-[85vh] rounded-[12px] border-2 border-primary/20 bg-white p-6 text-text-dark shadow-2xl overflow-hidden relative z-[3000]">
                {/* Header */}
                <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide text-primary">
                    Quick Book
                </h2>

                {/* Add button */}
                {!showAddForm && (
                    <button
                        onClick={() => {
                            setNewRoute({
                                pickupLabel: 'PICKUP',
                                pickupAddress: 'Select pickup location',
                                dropoffLabel: 'DROP-OFF',
                                dropoffAddress: 'Select drop-off location',
                                price: '',
                            })
                            setEditingId(undefined)
                            setShowAddForm(true)
                        }}
                        className="mb-4 flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-[#7d7d7d] transition hover:bg-zinc-50"
                    >
                        <span className="grid size-6 place-items-center rounded-full bg-zinc-200 text-lg font-light text-zinc-600">
                            +
                        </span>
                        Add..
                    </button>
                )}

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="mb-4 rounded-lg border-2 border-primary/30 bg-green-50 p-4 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-primary">
                                {editingId ? 'Edit Route' : 'Add New Route'}
                            </h3>
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
                                    setEditingId(undefined)
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Pickup Location Selector */}
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">
                                Pickup Location
                            </label>
                            <button
                                onClick={() => handleLocationClick('pickup')}
                                className="w-full px-3 py-2 rounded-md border-2 border-gray-300 bg-white text-sm text-left hover:border-primary transition-colors flex items-center justify-between"
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
                                onClick={() => handleLocationClick('dropoff')}
                                className="w-full px-3 py-2 rounded-md border-2 border-gray-300 bg-white text-sm text-left hover:border-primary transition-colors flex items-center justify-between"
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
                                className="w-full px-3 py-2 rounded-md border-2 border-gray-300 text-sm focus:outline-none focus:border-primary"
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
                                    setEditingId(undefined)
                                }}
                                className="flex-1 py-2 rounded-md border border-gray-300 bg-white text-sm font-semibold text-text-dark hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRoute}
                                className="flex-1 py-2 rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary-dark"
                            >
                                {editingId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Route cards */}
                <div className="mb-6 space-y-3 max-h-[400px] overflow-y-auto">
                    {routes.map((route) => (
                        <div key={route.id} className="rounded-lg border-2 border-primary bg-white p-4 shadow-md">
                            <div className="flex gap-3">
                                {/* Location icons */}
                                <div className="flex flex-col items-center gap-1 pt-1">
                                    <div className="grid size-5 place-items-center rounded-lg bg-yellow-400 text-white">
                                        <AppIcon name="📍" className="text-xs" />
                                    </div>
                                    <div className="h-6 w-0.5 bg-zinc-300" />
                                    <div className="grid size-5 place-items-center rounded-lg bg-pink-500 text-white">
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
                                    <div className="rounded-md bg-primary/10 p-2">
                                        <img src={assets.motoIcon} alt="" className="h-8 w-8" />
                                    </div>
                                    <p className="text-lg font-bold text-primary">{route.price}</p>
                                </div>
                            </div>

                            {/* Action buttons row */}
                            <div className="mt-3 flex items-center gap-2">
                                <button
                                    onClick={() => handleDeleteRoute(route.id)}
                                    className="grid size-10 place-items-center rounded-md bg-[#ff6b6b] text-white transition hover:bg-[#ff5555]"
                                >
                                    <AppIcon name="🗑️" className="text-lg" />
                                </button>
                                <button
                                    onClick={() => handleEditRoute(route)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-text-dark transition hover:bg-zinc-50"
                                >
                                    <AppIcon name="✏️" className="text-base" />
                                    Edit
                                </button>
                                <button
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                                    onClick={() => onConfirm(route)}
                                >
                                    <AppIcon name="✓" className="text-lg" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cancel button */}
                <button
                    className="w-full rounded-full border-2 border-primary bg-white px-6 py-3 text-center font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </Overlay>
    )
}
