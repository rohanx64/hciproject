import { useState } from 'react'
import { assets } from '../constants/assets'

interface SelectVehicleProps {
    onCancel: () => void
    onConfirm: () => void
    dropoffLabel: string
    onOpenFareDialog: () => void
    onOpenPaymentModal: () => void
    fare: number
    paymentMethod: 'cash' | 'digital'
}

export function SelectVehicleScreen({
    onCancel,
    onConfirm,
    dropoffLabel,
    onOpenFareDialog,
    onOpenPaymentModal,
    fare,
    paymentMethod
}: SelectVehicleProps) {
    const [vehicle, setVehicle] = useState('Bike')

    const vehicles = [
        { id: 'Bike', icon: assets.motoIcon, label: 'Bike' },
        { id: 'Car', icon: assets.deliveryIcon, label: 'Car' },
        { id: 'Auto', icon: assets.shopsIcon, label: 'Auto' },
        { id: 'Plus', icon: assets.rentalsIcon, label: 'Plus' },
        { id: 'AC', icon: assets.motoIcon, label: 'AC' },
    ]

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90">
            {/* Map section */}
            <section className="relative h-[400px] overflow-hidden">
                <img src={assets.mapBase} alt="Map" className="absolute inset-0 h-full w-full object-cover" />
                <img src={assets.mapOverlay} alt="" className="absolute inset-0 h-full w-full opacity-90" />

                {/* Route cards at top */}
                <div className="absolute left-4 right-4 top-4 space-y-2">
                    {/* Pickup location */}
                    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                        <div className="grid size-6 place-items-center rounded-full bg-yellow-400">
                            <span className="text-xs">📍</span>
                        </div>
                        <p className="flex-1 text-sm font-semibold text-text-dark">My current location</p>
                    </div>

                    {/* Drop-off location */}
                    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                        <div className="grid size-6 place-items-center rounded-full bg-pink-500">
                            <span className="text-xs text-white">📍</span>
                        </div>
                        <p className="flex-1 text-sm font-semibold text-text-dark">{dropoffLabel}</p>
                    </div>
                </div>

                {/* Route visualization could go here */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-center text-6xl font-bold text-primary/20">
                        {/* Route line visualization placeholder */}
                    </div>
                </div>
            </section>

            {/* Bottom section */}
            <section className="bg-white px-6 pb-8 pt-6">
                <p className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#a0a0a0]">
                    Select Vehicle
                </p>

                {/* Vehicle selection */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    {vehicles.map((v) => {
                        const active = vehicle === v.id
                        return (
                            <button
                                key={v.id}
                                onClick={() => setVehicle(v.id)}
                                className={`flex min-w-[68px] flex-col items-center gap-2 rounded-2xl border-2 p-3 transition ${active
                                        ? 'border-primary bg-primary/5 shadow-md'
                                        : 'border-zinc-200 bg-white hover:border-primary/40'
                                    }`}
                            >
                                <div className={`grid size-12 place-items-center rounded-xl ${active ? 'bg-primary/10' : 'bg-zinc-50'
                                    }`}>
                                    <img
                                        src={v.icon}
                                        alt={v.label}
                                        className={`h-7 w-7 ${active ? 'opacity-100' : 'opacity-60'}`}
                                    />
                                </div>
                                <span className={`text-xs font-semibold ${active ? 'text-primary' : 'text-[#7d7d7d]'
                                    }`}>
                                    {v.label}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Fare and Payment cards */}
                <div className="mb-6 flex gap-3">
                    {/* Your Fare - Clickable */}
                    <button
                        onClick={onOpenFareDialog}
                        className="flex flex-1 items-center gap-3 rounded-2xl border-2 border-primary/30 bg-white px-4 py-3 text-left transition hover:border-primary hover:shadow-md"
                    >
                        <div className="grid size-10 place-items-center rounded-full bg-primary/10">
                            <span className="text-xl">✏️</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">
                                Your Fare
                            </p>
                            <p className="text-xl font-extrabold text-text-dark">{fare} Rs.</p>
                        </div>
                    </button>

                    {/* Payment Method - Clickable */}
                    <button
                        onClick={onOpenPaymentModal}
                        className="flex flex-1 items-center gap-3 rounded-2xl border-2 border-primary/30 bg-white px-4 py-3 text-left transition hover:border-primary hover:shadow-md"
                    >
                        <div className="grid size-10 place-items-center rounded-full bg-primary/10">
                            <img
                                src={paymentMethod === 'cash' ? assets.cashIcon : assets.cardIcon}
                                alt=""
                                className="h-6 w-6"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">
                                Payment Method
                            </p>
                            <p className="text-sm font-semibold text-text-dark">
                                {paymentMethod === 'cash' ? 'Cash' : 'Digital'}
                            </p>
                        </div>
                    </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        className="flex-1 rounded-2xl bg-[#ff544a] px-6 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-md transition hover:bg-[#ff3d33]"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 rounded-2xl bg-primary px-6 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-md transition hover:bg-primary-dark"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </section>
        </div>
    )
}
