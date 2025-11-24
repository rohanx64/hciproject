import { useState, useEffect } from 'react'
import { assets } from '../constants/assets'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'
import { BottomNav } from '../components/BottomNav'
import type { PaymentOption } from '../types'

interface DeliveryFormScreenProps {
    pickupLocation: string
    deliveryLocation: string
    parcelDetails: string
    paymentOption: PaymentOption
    onChangePickup: (value: string) => void
    onChangeDelivery: (value: string) => void
    onChangeParcel: (value: string) => void
    onChangePayment: (option: PaymentOption) => void
    onCancel: () => void
    onApply: () => void
    onOpenMap: () => void
    onNavigate?: (screen: string) => void
}

interface DeliveryFormData {
    pickupName: string
    pickupMobile: string
    deliveryName: string
    deliveryMobile: string
    parcelValue: string
    receiveCash: boolean
}

export function DeliveryFormScreen({
    pickupLocation,
    deliveryLocation,
    parcelDetails,
    paymentOption,
    onChangePickup,
    onChangeDelivery,
    onChangeParcel,
    onChangePayment,
    onCancel,
    onApply,
    onOpenMap,
    onNavigate,
}: DeliveryFormScreenProps) {
    const [panelHeight, setPanelHeight] = useState(70) // Auto-adjusted to show all essential content
    const [formData, setFormData] = useState<DeliveryFormData>({
        pickupName: 'John Doe',
        pickupMobile: '03001245236',
        deliveryName: 'John Doe',
        deliveryMobile: '03001245236',
        parcelValue: '',
        receiveCash: false,
    })

    const handleFormChange = (field: keyof DeliveryFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-[844px] relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    dropoffLocation={deliveryLocation ? [24.8707, 67.0211] : undefined}
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
                <button
                    onClick={onOpenMap}
                    className="absolute left-[14.3%] top-[7.74%] right-[14.3%] z-20 active:scale-95 transition-transform duration-200"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3">
                        <div className="grid size-7 place-items-center">
                            <div className="size-5 rounded-full border-2 border-primary bg-primary"></div>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">PICKUP</p>
                            <p className="text-base font-normal text-text-dark truncate">{pickupLocation}</p>
                        </div>
                        <svg className="w-5 h-5 text-[#ff9500] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                </button>

                {/* Delivery Location Pin - Orange */}
                {deliveryLocation && (
                    <div className="absolute left-1/2 top-[35%] -translate-x-1/2 z-20 pointer-events-none">
                        <div className="relative">
                            <div className="absolute inset-0 translate-y-1 bg-black/20 blur-sm rounded-full" />
                            <div className="relative size-12 rounded-full bg-[#ff9500] shadow-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Draggable Bottom Panel - Auto-adjusted to show all form content */}
            <DraggablePanel
                initialHeight={70}
                minHeight={50}
                maxHeight={85}
                onHeightChange={setPanelHeight}
                hideBottomNav={true}
            >
                <div className="px-6 pb-6">
                    {/* Delivery Details Title */}
                    <h1 className="font-display text-[42px] font-normal text-[#ff9500] text-center mb-5 mt-6">
                        Delivery Details
                    </h1>

                    {/* Pick From Section */}
                    <div className="mb-5">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-3 block">
                            PICK FROM
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={pickupLocation}
                                onChange={(e) => onChangePickup(e.target.value)}
                                placeholder="Enter pickup address"
                                className="flex-1 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-[#ff9500] focus:outline-none"
                            />
                            <button 
                                onClick={onOpenMap}
                                className="px-4 py-3 rounded-2xl border-2 border-[#c8f0c0] bg-white hover:bg-green-50 transition active:scale-95"
                            >
                                <img src={assets.locationButton} alt="Location" className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={formData.pickupName}
                                onChange={(e) => handleFormChange('pickupName', e.target.value)}
                                placeholder="NAME"
                                className="w-full rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-[#ff9500] focus:outline-none"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="tel"
                                    value={formData.pickupMobile}
                                    onChange={(e) => handleFormChange('pickupMobile', e.target.value)}
                                    placeholder="MOBILE NUMBER"
                                    className="flex-1 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-[#ff9500] focus:outline-none"
                                />
                                <button className="px-4 py-3 rounded-2xl border-2 border-[#c8f0c0] bg-white hover:bg-green-50 transition active:scale-95">
                                    <svg className="w-6 h-6 text-[#6cc44a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Deliver To Section */}
                    <div className="mb-5">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-3 block">
                            DELIVER TO
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={deliveryLocation}
                                onChange={(e) => onChangeDelivery(e.target.value)}
                                placeholder="Enter delivery address"
                                className="flex-1 rounded-2xl border-2 border-red-300 bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-red-500 focus:outline-none"
                            />
                            <button 
                                onClick={onOpenMap}
                                className="px-4 py-3 rounded-2xl border-2 border-red-300 bg-white hover:bg-red-50 transition active:scale-95"
                            >
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={formData.deliveryName}
                                onChange={(e) => handleFormChange('deliveryName', e.target.value)}
                                placeholder="NAME"
                                className="w-full rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-[#ff9500] focus:outline-none"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="tel"
                                    value={formData.deliveryMobile}
                                    onChange={(e) => handleFormChange('deliveryMobile', e.target.value)}
                                    placeholder="MOBILE NUMBER"
                                    className="flex-1 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-[#ff9500] focus:outline-none"
                                />
                                <button className="px-4 py-3 rounded-2xl border-2 border-[#c8f0c0] bg-white hover:bg-green-50 transition active:scale-95">
                                    <svg className="w-6 h-6 text-[#6cc44a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Parcel Details Section */}
                    <div className="mb-5">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-3 block">
                            PARCEL DETAILS
                        </label>
                        <input
                            type="text"
                            value={parcelDetails}
                            onChange={(e) => onChangeParcel(e.target.value)}
                            placeholder="e.g., Documents, Food, etc."
                            className="w-full rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-[#ff9500] focus:outline-none mb-3"
                        />
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="text"
                                value={formData.parcelValue}
                                onChange={(e) => handleFormChange('parcelValue', e.target.value)}
                                placeholder="PARCEL VALUE"
                                className="flex-1 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 text-base font-normal text-text-dark focus:border-[#ff9500] focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-[#c8f0c0] bg-white">
                            <span className="text-sm font-normal text-text-dark">RECEIVE CASH FOR PARCEL?</span>
                            <button
                                onClick={() => handleFormChange('receiveCash', !formData.receiveCash)}
                                className={`relative w-14 h-7 rounded-full transition-colors ${formData.receiveCash ? 'bg-[#6cc44a]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${formData.receiveCash ? 'translate-x-7' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Payment Options */}
                    <div className="mb-6">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-3 block">
                            WHO WILL PAY DELIVERY CHARGES
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => onChangePayment('half-pay')}
                                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-95 ${paymentOption === 'half-pay'
                                        ? 'bg-[#ff9500] text-white shadow-lg'
                                        : 'bg-white text-[#ff9500] border-2 border-[#ff9500] hover:bg-orange-50'
                                    }`}
                            >
                                I will pay
                            </button>
                            <button
                                onClick={() => onChangePayment('receiver-will-pay')}
                                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-95 ${paymentOption === 'receiver-will-pay'
                                        ? 'bg-[#ff9500] text-white shadow-lg'
                                        : 'bg-white text-[#ff9500] border-2 border-[#ff9500] hover:bg-orange-50'
                                    }`}
                            >
                                Receiver will pay
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 rounded-[7px] border-[1.172px] border-gray-300 bg-white px-6 py-4 text-[19.931px] font-extrabold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-98 min-h-[52px]"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onApply}
                            className="flex-1 rounded-[7px] bg-[#ff9500] px-6 py-4 text-[19.931px] font-extrabold text-white shadow-[3.517px_3.517px_0px_0px_rgba(255,149,0,0.38)] transition-all duration-200 hover:bg-[#e68600] hover:shadow-[4px_4px_0px_0px_rgba(255,149,0,0.38)] active:scale-98 min-h-[52px]"
                        >
                            APPLY
                        </button>
                    </div>
                </div>
            </DraggablePanel>
        </div>
    )
}
