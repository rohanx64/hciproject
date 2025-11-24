import type { BreakdownItem } from '../../types'

interface FareBreakdownProps {
    fare: number
    items: BreakdownItem[]
    onConfirm: () => void
    onClose: () => void
}

export function FareBreakdownModal({ fare, items, onConfirm, onClose }: FareBreakdownProps) {
    return (
        <div className="w-[360px] rounded-[36px] border border-primary bg-white px-6 py-8 text-text-dark shadow-2xl">
            <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#919191]">YOUR FARE</p>
                <p className="text-4xl font-extrabold text-[#242e42]">
                    <span className="text-[#8d95a8]">PKR</span> {fare}
                </p>
            </div>
            <div className="mt-4 rounded-2xl bg-primary px-4 py-3 text-center text-white shadow-card">
                <button className="text-lg font-extrabold uppercase tracking-widest" onClick={onConfirm}>
                    Confirm
                </button>
            </div>
            <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.25em] text-[#919191] mb-4">
                    <span>FARE BREAKDOWN</span>
                    <span className="text-xl">⌄</span>
                </div>
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-lg font-semibold text-[#919191]">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button className="mt-6 w-full text-sm text-[#7d7d7d] hover:text-text-dark transition-colors duration-200" onClick={onClose}>
                Close
            </button>
        </div>
    )
}
