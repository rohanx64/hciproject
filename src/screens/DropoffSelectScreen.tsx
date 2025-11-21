import { useState } from 'react'
import { assets } from '../constants/assets'

interface DropoffSelectProps {
    onCancel: () => void
    onApply: (value: string) => void
}

export function DropoffSelectScreen({ onCancel, onApply }: DropoffSelectProps) {
    const [value, setValue] = useState('')

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90">
            <section className="relative h-[780px] overflow-hidden">
                <img src={assets.mapOverlay} alt="Map" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-0 top-0 bg-white/70 py-6 px-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#919191]">Drop-off</p>
                    <div className="mt-2 flex items-center gap-3 rounded-3xl border-2 border-primary/40 bg-white px-4 py-3 shadow-card">
                        <img src={assets.searchIcon} alt="" className="h-5 w-5 opacity-60" />
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Type here..."
                            className="flex-1 border-none bg-transparent text-lg font-semibold text-text-dark placeholder:text-[#242e42]/50 focus:outline-none"
                        />
                        <img src={assets.chevronIcon} alt="" className="h-4 w-4 opacity-60" />
                    </div>
                </div>
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
                    <img src={assets.pointer} alt="Drop-off pin" className="h-24 w-24" />
                    <p className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-primary">Move pin to set drop-off</p>
                </div>
                <button
                    className="absolute bottom-32 right-6 grid size-14 place-items-center rounded-full border border-primary/40 bg-white shadow-card"
                    aria-label="Use my location"
                >
                    <img src={assets.locationButton} alt="" className="h-8 w-8" />
                </button>
            </section>

            <div className="flex gap-4 px-6 pb-8">
                <button
                    className="flex-1 rounded-2xl border border-primary px-4 py-4 text-lg font-extrabold uppercase text-primary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className="flex-1 rounded-2xl bg-primary px-4 py-4 text-lg font-extrabold uppercase text-white shadow-card"
                    onClick={() => onApply(value || 'Custom Drop-off')}
                >
                    Apply
                </button>
            </div>
        </div>
    )
}
