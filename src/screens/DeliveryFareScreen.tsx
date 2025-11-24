import { RideMap } from '../components/RideMap'
import type { BreakdownItem } from '../types'

interface DeliveryFareScreenProps {
    fare: number
    breakdownItems: BreakdownItem[]
    pickupLocation: [number, number]
    deliveryLocation: [number, number]
    onCancel: () => void
    onConfirm: () => void
}

export function DeliveryFareScreen({
    fare,
    breakdownItems,
    pickupLocation,
    deliveryLocation,
    onCancel,
    onConfirm,
}: DeliveryFareScreenProps) {
    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-[844px]">
            {/* Map Section */}
            <section className="relative h-[30%] overflow-hidden">
                <RideMap
                    pickupLocation={pickupLocation}
                    dropoffLocation={deliveryLocation}
                    className="h-full w-full"
                />
            </section>

            {/* Fare Breakdown Section */}
            <section className="flex-1 bg-white px-6 py-6 overflow-y-auto">
                {/* Fare Display */}
                <div className="text-center mb-6">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-2">Estimated Fare</p>
                    <h2 className="font-display text-5xl font-normal text-[#ff9500]">PKR {fare}</h2>
                </div>

                {/* Fare Breakdown */}
                <div className="bg-gray-50 rounded-3xl p-6 mb-6">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-4">Fare Breakdown</h3>
                    <div className="space-y-3">
                        {breakdownItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-base font-normal text-text-dark">{item.label}</span>
                                <span className="text-base font-bold text-text-dark">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t-2 border-gray-300">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">TOTAL</span>
                            <span className="text-xl font-bold text-[#ff9500]">RS. {fare}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-3xl border-2 border-gray-300 bg-white px-6 py-4 text-base font-bold text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-3xl bg-[#ff9500] px-6 py-4 text-base font-bold text-white transition hover:bg-[#e68600] shadow-lg"
                    >
                        Confirm
                    </button>
                </div>
            </section>
        </div>
    )
}
