import { assets } from '../../constants/assets'
import { quickBook } from '../../constants/data'
import { Overlay } from '../Overlay'

interface QuickBookModalProps {
    onConfirm: () => void
    onCancel: () => void
}

export function QuickBookModal({ onConfirm, onCancel }: QuickBookModalProps) {
    return (
        <Overlay>
            <div className="w-[320px] rounded-[24px] border-2 border-primary/20 bg-white p-6 text-text-dark shadow-2xl">
                {/* Header */}
                <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide text-primary">
                    Quick Book
                </h2>

                {/* Add button */}
                <button className="mb-4 flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-[#7d7d7d] transition hover:bg-zinc-50">
                    <span className="grid size-6 place-items-center rounded-full bg-zinc-200 text-lg font-light text-zinc-600">
                        +
                    </span>
                    Add..
                </button>

                {/* Route card */}
                <div className="mb-6 rounded-2xl border-2 border-primary bg-white p-4 shadow-md">
                    <div className="flex gap-3">
                        {/* Location icons */}
                        <div className="flex flex-col items-center gap-1 pt-1">
                            <div className="grid size-5 place-items-center rounded-full bg-yellow-400">
                                <span className="text-xs">📍</span>
                            </div>
                            <div className="h-6 w-0.5 bg-zinc-300" />
                            <div className="grid size-5 place-items-center rounded-full bg-pink-500">
                                <span className="text-xs text-white">📍</span>
                            </div>
                        </div>

                        {/* Location details */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a0a0a0]">
                                    {quickBook.pickupLabel}
                                </p>
                                <p className="text-sm font-semibold text-text-dark">{quickBook.pickupAddress}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a0a0a0]">
                                    {quickBook.dropoffLabel}
                                </p>
                                <p className="text-sm font-semibold text-text-dark">{quickBook.dropoffAddress}</p>
                            </div>
                        </div>

                        {/* Price and vehicle */}
                        <div className="flex flex-col items-end justify-between">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <img src={assets.motoIcon} alt="" className="h-8 w-8" />
                            </div>
                            <p className="text-lg font-bold text-primary">{quickBook.price}</p>
                        </div>
                    </div>

                    {/* Action buttons row */}
                    <div className="mt-3 flex items-center gap-2">
                        <button className="grid size-10 place-items-center rounded-lg bg-[#ff6b6b] text-white transition hover:bg-[#ff5555]">
                            <span className="text-lg">🗑️</span>
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-text-dark transition hover:bg-zinc-50">
                            ✏️ Edit
                        </button>
                        <button
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                            onClick={onConfirm}
                        >
                            ✓
                        </button>
                    </div>
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
