import { useState, useEffect } from 'react'
import { assets } from '../constants/assets'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'
import { AppIcon } from '../components/AppIcon'
import { useVoiceFeedback } from '../contexts/VoiceFeedbackContext'

interface SelectVehicleProps {
    onCancel: () => void
    onConfirm: () => void
    dropoffLabel: string
    onOpenFareDialog: () => void
    onOpenPaymentModal: () => void
    fare: number
    paymentMethod: 'cash' | 'digital'
    pickupLocation?: string
    onOpenPickupSelect?: () => void
    onOpenDropoffSelect?: () => void
}

export function SelectVehicleScreen({
    onCancel,
    onConfirm,
    dropoffLabel,
    onOpenFareDialog,
    onOpenPaymentModal,
    fare,
    paymentMethod,
    pickupLocation = 'My current location',
    onOpenPickupSelect,
    onOpenDropoffSelect
}: SelectVehicleProps) {
    const { speakAction } = useVoiceFeedback()
    const [panelHeight, setPanelHeight] = useState(58)
    const [vehicle, setVehicle] = useState('Bike')
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    // Vehicle data with estimated fares
    const vehicles = [
        { id: 'Bike', icon: '🏍️', label: 'Bike', fare: 250 },
        { id: 'Car', icon: '🚗', label: 'Car', fare: 450 },
        { id: 'Auto', icon: '🛺', label: 'Auto', fare: 350 },
        { id: 'Plus', icon: '🚙', label: 'Plus', fare: 550 },
        { id: 'AC', icon: '🚕', label: 'AC', fare: 650 },
    ]

    // Auto-open fare dialog when screen loads
    useEffect(() => {
        const timer = setTimeout(() => {
            onOpenFareDialog()
            speakAction(`Your estimated fare is ${fare} rupees`)
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    // Detect when panel is expanded (height > 75%)
    useEffect(() => {
        setIsExpanded(panelHeight > 75)
    }, [panelHeight])

    const handleVehicleSelect = (vehicleId: string) => {
        setVehicle(vehicleId)
        speakAction(`${vehicleId} selected`)
        // Collapse panel after selection
        setPanelHeight(58)
    }

    const handleCancelClick = () => {
        setShowCancelDialog(true)
        speakAction('Do you want to cancel?')
    }

    const handleConfirmCancel = () => {
        setShowCancelDialog(false)
        onCancel()
        speakAction('Cancelled')
    }


    return (
        <div className="relative flex w-full flex-col overflow-hidden bg-white h-screen">
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
                    onClick={handleCancelClick}
                >
                    <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Pickup Location Card */}
                <button
                    onClick={onOpenPickupSelect}
                    className="absolute left-[calc(6.13%+52px+16px)] right-4 top-[6.38%] z-20 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-2 shadow-lg flex items-center gap-3 hover:border-primary hover:shadow-xl transition-all duration-200">
                        <div className="grid size-7 place-items-center">
                            <div className="size-5 rounded-full border-2 border-primary bg-primary"></div>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-base font-normal text-text-dark truncate">{pickupLocation}</p>
                        </div>
                    </div>
                </button>

                {/* Drop-off Location Card */}
                <button
                    onClick={onOpenDropoffSelect}
                    className="absolute left-[calc(6.13%+52px+16px)] right-4 top-[calc(6.38%+52px+8px)] z-20 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-2 shadow-lg flex items-center gap-3 hover:border-primary hover:shadow-xl transition-all duration-200">
                        <div className="grid size-7 place-items-center">
                            <div className="size-5 rounded-full border-2 border-[#ff3b30] bg-[#ff3b30]"></div>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">DROP-OFF</p>
                            <p className="text-base font-normal text-text-dark truncate">{dropoffLabel}</p>
                        </div>
                    </div>
                </button>
            </section>

            {/* Draggable Bottom Panel */}
            <DraggablePanel
                initialHeight={58}
                minHeight={55}
                maxHeight={85}
                onHeightChange={setPanelHeight}
                hideBottomNav={true}
            >
                <div className="px-6 pb-6">
                    {/* SELECT VEHICLE Section */}
                    <div className="mb-6 mt-6">
                        <p className="text-center text-[19.931px] font-light text-[#919191] mb-4">
                            SELECT VEHICLE
                        </p>

                        {/* Horizontal view (collapsed) */}
                        {!isExpanded && (
                            <div className="flex gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
                                {vehicles.map((v) => {
                                    const active = vehicle === v.id
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => handleVehicleSelect(v.id)}
                                            className={`flex min-w-[70px] flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-200 active:scale-95 ${active
                                                ? 'border-primary bg-primary/10 shadow-md scale-105'
                                                : 'border-gray-200 bg-white hover:border-primary/40 hover:scale-102'
                                                }`}
                                        >
                                            <div className={`grid size-14 place-items-center rounded-xl transition-all duration-200 ${active ? 'bg-primary/20 scale-110' : 'bg-gray-50'
                                                }`}>
                                                <AppIcon
                                                    name={v.icon}
                                                    className={`text-3xl transition-all duration-200 ${active ? 'text-primary scale-110' : 'text-gray-500'}`}
                                                />
                                            </div>
                                            <span className={`text-xs font-semibold transition-colors duration-200 ${active ? 'text-primary' : 'text-gray-500'
                                                }`}>
                                                {v.label}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Vertical view (expanded) with fares */}
                        {isExpanded && (
                            <div className="space-y-3 max-h-[320px] overflow-y-auto">
                                {vehicles.map((v) => {
                                    const active = vehicle === v.id
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => handleVehicleSelect(v.id)}
                                            className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 active:scale-98 ${active
                                                ? 'border-primary bg-primary/10 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-primary/40'
                                                }`}
                                        >
                                            <div className={`grid size-16 place-items-center rounded-xl transition-all duration-200 ${active ? 'bg-primary/20' : 'bg-gray-50'
                                                }`}>
                                                <AppIcon name={v.icon} className="text-3xl text-primary" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className={`text-lg font-bold ${active ? 'text-primary' : 'text-gray-700'
                                                    }`}>
                                                    {v.label}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Estimated arrival: 5 min
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xl font-extrabold ${active ? 'text-primary' : 'text-gray-700'
                                                    }`}>
                                                    PKR {v.fare}
                                                </p>
                                                <p className="text-xs text-gray-500">Est. fare</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Pull up hint when collapsed */}
                        {!isExpanded && (
                            <p className="text-center text-xs text-gray-400 mt-3">
                                Pull up to see all vehicles with fares
                            </p>
                        )}
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
                                    <AppIcon name={paymentMethod === 'cash' ? '💵' : '💳'} className="text-2xl text-primary" />
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
                            onClick={handleCancelClick}
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

            {/* Cancel Confirmation Dialog */}
            {showCancelDialog && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                    <div className="w-[360px] rounded-[28px] border border-primary bg-white px-6 py-8 text-center text-text-dark shadow-2xl mx-4">
                        <p className="text-xl font-medium">
                            Cancelling will <span className="font-extrabold">remove all details you have added</span>, are you sure?
                        </p>
                        <div className="mt-6 flex gap-4">
                            <button
                                className="flex-1 rounded-2xl bg-[#ff544a] px-4 py-3 text-base font-extrabold uppercase tracking-wide text-white shadow-[3px_3px_0_rgba(245,45,86,0.3)] transition hover:brightness-95 active:scale-95"
                                onClick={handleConfirmCancel}
                            >
                                Yes, Cancel
                            </button>
                            <button
                                className="flex-1 rounded-2xl bg-primary px-4 py-3 text-base font-extrabold uppercase tracking-wide text-white shadow-[3px_3px_0_rgba(50,153,29,0.33)] transition hover:bg-primary-dark active:scale-95"
                                onClick={() => setShowCancelDialog(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
