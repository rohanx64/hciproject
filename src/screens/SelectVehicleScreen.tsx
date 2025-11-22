import { useState } from 'react'
import { assets } from '../constants/assets'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'

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
    const [panelHeight, setPanelHeight] = useState(68) // Auto-adjusted to show all content
    const [vehicle, setVehicle] = useState('Bike')

    const vehicles = [
        { id: 'Bike', icon: '🏍️', label: 'Bike' },
        { id: 'Car', icon: '🚗', label: 'Car' },
        { id: 'Auto', icon: '🛺', label: 'Auto' },
        { id: 'Plus', icon: '🚙', label: 'Plus' },
        { id: 'AC', icon: '🚕', label: 'AC' },
    ]

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-[844px] relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    dropoffLocation={dropoffLabel !== 'Where to?' ? [24.8707, 67.0211] : undefined}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Back Button */}
                <button
                    className="absolute left-[6.13%] top-[6.38%] size-[52px] rounded-full border-2 border-white bg-white shadow-lg flex items-center justify-center z-20 hover:bg-gray-50 active:scale-90 transition-all duration-200"
                    aria-label="Back"
                    onClick={onCancel}
                >
                    <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Pickup Location Card */}
                <div className="absolute left-[14.3%] top-[7.74%] right-[14.3%] z-20">
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3">
                        <div className="grid size-7 place-items-center">
                            <div className="size-5 rounded-full border-2 border-primary bg-primary"></div>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-base font-normal text-text-dark truncate">My current location</p>
                        </div>
                    </div>
                </div>

                {/* Drop-off Location Card */}
                <div className="absolute left-[14.3%] top-[16%] right-[14.3%] z-20">
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3">
                        <div className="grid size-7 place-items-center">
                            <div className="size-5 rounded-full border-2 border-[#ff3b30] bg-[#ff3b30]"></div>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">DROP-OFF</p>
                            <p className="text-base font-normal text-text-dark truncate">{dropoffLabel}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Draggable Bottom Panel - Auto-adjusted to show all content */}
            <DraggablePanel
                initialHeight={68}
                minHeight={50}
                maxHeight={85}
                onHeightChange={setPanelHeight}
                hideBottomNav={true}
            >
                <div className="px-6 pb-6">
                    {/* Ride Title */}
                    <h1 className="font-display text-[42px] font-normal text-primary text-center mb-5 mt-6">
                        Ride
                    </h1>

                    {/* SELECT VEHICLE Section */}
                    <div className="mb-6">
                        <p className="text-center text-[19.931px] font-light text-[#919191] mb-4">
                            SELECT VEHICLE
                        </p>
                        <div className="flex gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
                            {vehicles.map((v) => {
                                const active = vehicle === v.id
                                return (
                                    <button
                                        key={v.id}
                                        onClick={() => setVehicle(v.id)}
                                        className={`flex min-w-[70px] flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-200 active:scale-95 ${
                                            active
                                                ? 'border-primary bg-primary/10 shadow-md scale-105'
                                                : 'border-gray-200 bg-white hover:border-primary/40 hover:scale-102'
                                        }`}
                                    >
                                        <div className={`grid size-14 place-items-center rounded-xl transition-all duration-200 ${
                                            active ? 'bg-primary/20 scale-110' : 'bg-gray-50'
                                        }`}>
                                            <span className={`text-3xl transition-all duration-200 ${
                                                active ? 'opacity-100 scale-110' : 'opacity-70'
                                            }`}>
                                                {v.icon}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-semibold transition-colors duration-200 ${
                                            active ? 'text-primary' : 'text-gray-500'
                                        }`}>
                                            {v.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* YOUR FARE Card - Clickable */}
                    <button
                        onClick={onOpenFareDialog}
                        className="w-full mb-4 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-4 shadow-sm hover:border-primary hover:shadow-md transition-all duration-200 active:scale-98"
                    >
                        <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-full bg-primary/10">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#919191] mb-1">YOUR FARE</p>
                                <p className="text-xl font-extrabold text-text-dark">{fare} Rs.</p>
                            </div>
                            <img src={assets.chevronIcon} alt="" className="h-5 w-5 opacity-50" />
                        </div>
                    </button>

                    {/* PAYMENT METHOD Card - Clickable */}
                    <button
                        onClick={onOpenPaymentModal}
                        className="w-full mb-6 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-4 shadow-sm hover:border-primary hover:shadow-md transition-all duration-200 active:scale-98"
                    >
                        <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-full bg-primary/10">
                                <span className="text-2xl">
                                    {paymentMethod === 'cash' ? '💵' : '💳'}
                                </span>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#919191] mb-1">PAYMENT METHOD</p>
                                <p className="text-base font-semibold text-text-dark">
                                    {paymentMethod === 'cash' ? 'Cash' : 'Digital'}
                                </p>
                            </div>
                            <img src={assets.chevronIcon} alt="" className="h-5 w-5 opacity-50" />
                        </div>
                    </button>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 rounded-[7px] border-[1.172px] border-[#ff4141] bg-[#ff544a] px-6 py-4 text-[19.931px] font-extrabold text-white transition-all duration-200 hover:bg-[#ff3d33] hover:shadow-lg hover:scale-102 active:scale-98 min-h-[52px]"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 rounded-[7px] bg-primary px-6 py-4 text-[19.931px] font-extrabold text-white shadow-[3.517px_3.517px_0px_0px_rgba(50,153,29,0.38)] transition-all duration-200 hover:bg-primary-dark hover:shadow-[4px_4px_0px_0px_rgba(50,153,29,0.38)] hover:scale-102 active:scale-98 min-h-[52px]"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            </DraggablePanel>
        </div>
    )
}
