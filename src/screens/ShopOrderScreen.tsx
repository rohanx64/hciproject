import { useState } from 'react'
import { assets } from '../constants/assets'
import { RideMap } from '../components/RideMap'
import { BottomNav } from '../components/BottomNav'
import { DraggablePanel } from '../components/DraggablePanel'
import type { BreakdownItem, PaymentMethod } from '../types'

interface ShopOrderScreenProps {
    onNavigate?: (screen: string) => void
    onConfirm: () => void
    shopName: string
    shopCategory: string
    deliveryLocation: string
    onEditLocation: () => void
    onOpenFareDialog?: () => void
    onOpenFareBreakdown?: () => void
    onOpenPaymentModal?: () => void
    fare: number
    breakdownItems: BreakdownItem[]
    paymentMethod: PaymentMethod
}

export function ShopOrderScreen({
    onNavigate,
    onConfirm,
    shopName,
    shopCategory,
    deliveryLocation,
    onEditLocation,
    onOpenFareDialog,
    onOpenFareBreakdown,
    onOpenPaymentModal,
    fare,
    breakdownItems,
    paymentMethod,
}: ShopOrderScreenProps) {
    const [panelHeight, setPanelHeight] = useState(72) // Auto-adjusted to show all content without dragging
    const [purchaseValue, setPurchaseValue] = useState(1500)
    const [isEditingPurchaseValue, setIsEditingPurchaseValue] = useState(false)

    const handlePurchaseValueChange = (delta: number) => {
        const newValue = Math.max(500, Math.min(2500, purchaseValue + delta))
        setPurchaseValue(newValue)
    }

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPurchaseValue(parseInt(e.target.value))
    }

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    dropoffLocation={[24.8707, 67.0211]}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Back Button */}
                <button
                    className="absolute left-[6.13%] top-[6.38%] size-[52px] rounded-full border-2 border-white bg-white shadow-lg flex items-center justify-center z-20 hover:bg-gray-50 active:scale-90 transition-all duration-200"
                    aria-label="Back"
                    onClick={() => onNavigate?.('Shops')}
                >
                    <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Drop-off Location Card */}
                <button
                    onClick={onEditLocation}
                    className="absolute left-[14.3%] top-[7.74%] right-[14.3%] z-20 active:scale-95 transition-transform duration-200"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3">
                        <div className="grid size-7 place-items-center">
                            <div className="size-5 rounded-full border-2 border-[#ff3b30] bg-[#ff3b30]"></div>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">Drop</p>
                            <p className="text-base font-normal text-text-dark truncate">{deliveryLocation}</p>
                        </div>
                        <svg className="w-5 h-5 text-[#3b82f6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                </button>
            </section>

            {/* Draggable Bottom Panel - Auto-adjusted to show all content */}
            <DraggablePanel
                initialHeight={72}
                minHeight={50}
                maxHeight={85}
                onHeightChange={setPanelHeight}
                hideBottomNav={true}
            >
                <div className="px-6 pb-6">
                    {/* Shop Order Title */}
                    <h1 className="font-display text-[42px] font-normal text-[#3b82f6] text-center mb-5 mt-6">
                        Order
                    </h1>

                    {/* Delivery Fare Card - Clickable */}
                    <button
                        onClick={() => onOpenFareDialog?.()}
                        className="w-full mb-4 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-4 shadow-sm hover:border-[#3b82f6] hover:shadow-md transition-all duration-200 active:scale-98"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#919191] mb-1">Delivery Fare Est:</p>
                                <p className="text-xl font-extrabold text-text-dark">{fare} Rs.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onOpenFareBreakdown?.()
                                    }}
                                    className="px-3 py-2 rounded-xl border-2 border-[#3b82f6] bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 transition-all duration-200 active:scale-95"
                                >
                                    <span className="text-xs font-semibold text-[#3b82f6]">Breakdown</span>
                                </button>
                                <button className="px-3 py-2 rounded-xl border-2 border-[#3b82f6] bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 transition-all duration-200 active:scale-95">
                                    <span className="text-xs font-semibold text-[#3b82f6]">Promo</span>
                                    <div className="size-4 rounded-full bg-[#3b82f6] flex items-center justify-center ml-1 inline-flex">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </button>

                    {/* Purchase Details Card */}
                    <div className="mb-6 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-4 shadow-sm">
                        <h3 className="text-base font-bold text-[#3b82f6] mb-4">Purchase Details</h3>

                        {/* Purchase Value - Editable with +/- buttons */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-extrabold uppercase tracking-wider text-[#919191]">Purchase Value</p>
                                {!isEditingPurchaseValue ? (
                                    <button
                                        onClick={() => setIsEditingPurchaseValue(true)}
                                        className="text-sm font-semibold text-[#3b82f6] hover:underline"
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditingPurchaseValue(false)}
                                        className="text-sm font-semibold text-[#3b82f6] hover:underline"
                                    >
                                        Done
                                    </button>
                                )}
                            </div>

                            {isEditingPurchaseValue ? (
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => handlePurchaseValueChange(-500)}
                                        className="size-10 rounded-full border-2 border-gray-300 bg-white text-2xl font-bold text-gray-600 hover:bg-gray-50 active:scale-90 transition-all duration-200"
                                    >
                                        −
                                    </button>
                                    <div className="text-center">
                                        <p className="text-3xl font-extrabold text-[#3b82f6]">{purchaseValue}</p>
                                        <p className="text-sm font-semibold text-gray-500">Rs.</p>
                                    </div>
                                    <button
                                        onClick={() => handlePurchaseValueChange(500)}
                                        className="size-10 rounded-full border-2 border-gray-300 bg-white text-2xl font-bold text-gray-600 hover:bg-gray-50 active:scale-90 transition-all duration-200"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Slider */}
                                    <div className="relative">
                                        <div className="relative h-3 bg-gray-200 rounded-full">
                                            <input
                                                type="range"
                                                min="500"
                                                max="2500"
                                                step="500"
                                                value={purchaseValue}
                                                onChange={handleSliderChange}
                                                className="absolute inset-0 w-full h-3 bg-transparent appearance-none cursor-pointer z-10"
                                            />
                                            <div
                                                className="absolute left-0 top-0 h-3 bg-[#3b82f6] rounded-full transition-all duration-200"
                                                style={{
                                                    width: `${((purchaseValue - 500) / 2000) * 100}%`
                                                }}
                                            />
                                            {/* Markers */}
                                            <div className="absolute inset-0 flex justify-between items-center">
                                                {[500, 1000, 1500, 2000, 2500].map((value) => {
                                                    const isActive = purchaseValue >= value
                                                    return (
                                                        <div
                                                            key={value}
                                                            className={`size-3 rounded-full transition-all duration-200 ${
                                                                isActive ? 'bg-[#3b82f6] shadow-md scale-125' : 'bg-gray-300'
                                                            }`}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-3">
                                            {[500, 1000, 1500, 2000, 2500].map((value) => (
                                                <span
                                                    key={value}
                                                    className={`text-xs font-semibold transition-colors duration-200 ${
                                                        purchaseValue === value ? 'text-[#3b82f6]' : 'text-gray-400'
                                                    }`}
                                                >
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-lg font-extrabold text-[#3b82f6]">{purchaseValue} Rs.</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Voice Note */}
                        <div className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-100 bg-gray-50">
                            <span className="text-sm font-semibold text-text-dark">Voice Note for Driver</span>
                            <button className="size-12 rounded-full bg-[#3b82f6] flex items-center justify-center shadow-lg hover:bg-[#2563eb] active:scale-90 transition-all duration-200">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
                                    <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z" />
                                    <path d="M12 18.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-3 0v-3a1.5 1.5 0 011.5-1.5z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Payment Method Card - Clickable */}
                    <button
                        onClick={() => onOpenPaymentModal?.()}
                        className="w-full mb-6 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-4 shadow-sm hover:border-[#3b82f6] hover:shadow-md transition-all duration-200 active:scale-98"
                    >
                        <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center">
                                <svg className="w-6 h-6 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.72-2.81 0-1.79-1.49-2.69-3.66-3.21z"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#919191] mb-1">Payment Method</p>
                                <p className="text-base font-semibold text-text-dark">{paymentMethod === 'cash' ? 'Cash' : 'Digital / Transfer'}</p>
                            </div>
                            <img src={assets.chevronIcon} alt="" className="h-5 w-5 opacity-50" />
                        </div>
                    </button>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => onNavigate?.('Shops')}
                            className="flex-1 rounded-[7px] border-[1.172px] border-[#ff4141] bg-[#ff544a] px-6 py-4 text-[19.931px] font-extrabold text-white transition-all duration-200 hover:bg-[#ff3d33] hover:shadow-lg hover:scale-102 active:scale-98 min-h-[52px]"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 rounded-[7px] bg-[#3b82f6] px-6 py-4 text-[19.931px] font-extrabold text-white shadow-[3.517px_3.517px_0px_0px_rgba(59,130,246,0.38)] transition-all duration-200 hover:bg-[#2563eb] hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,0.38)] hover:scale-102 active:scale-98 min-h-[52px]"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            </DraggablePanel>

            {/* Bottom Navigation - Hidden when panel is expanded */}
        </div>
    )
}
