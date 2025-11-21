import { assets } from '../constants/assets'
import { BottomNav } from '../components/BottomNav'
import type { Location } from '../types'

interface RideExtendedProps {
    dropoffLabel: string
    onEditDropoff: () => void
    recentLocations: Location[]
}

export function RideExtendedScreen({ dropoffLabel, onEditDropoff, recentLocations }: RideExtendedProps) {
    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90">
            <section className="relative h-[400px] overflow-hidden">
                <img src={assets.mapBase} alt="Map" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute left-6 top-6 flex gap-3">
                    <button className="size-14 overflow-hidden rounded-full border-2 border-white shadow-card">
                        <img src={assets.avatar} alt="Avatar" className="h-full w-full object-cover" />
                    </button>
                </div>
            </section>

            <section className="bg-white px-6 pb-10 pt-6">
                <div className="mx-auto mb-4 w-16 rounded-full border border-zinc-200" />
                <p className="mb-4 text-4xl font-display text-primary">Ride</p>

                <div className="space-y-3">
                    <div className="rounded-3xl border-2 border-primary/40 bg-white px-4 py-3">
                        <div className="flex items-start gap-3">
                            <span className="grid size-10 place-items-center rounded-full border-2 border-primary text-primary text-xs font-bold">
                                •
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8c7cc]">Pickup</p>
                                <p className="text-lg font-semibold text-text-dark">My current location</p>
                            </div>
                            <img src={assets.locationButton} alt="" className="ml-auto h-6 w-6" />
                        </div>
                    </div>
                    <button
                        className="flex w-full items-center gap-3 rounded-3xl border-2 border-primary/40 bg-white px-4 py-3 text-left"
                        onClick={onEditDropoff}
                    >
                        <span className="grid size-10 place-items-center rounded-full bg-[#fde1e8] text-accent text-xs font-bold">
                            ↓
                        </span>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8c7cc]">Drop-off</p>
                            <p className="text-lg font-semibold text-text-dark">{dropoffLabel}</p>
                        </div>
                        <img src={assets.chevronIcon} alt="" className="h-4 w-4" />
                    </button>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#c8c7cc]">Recent locations</p>
                <div className="mt-2 space-y-4">
                    {recentLocations.map((loc) => (
                        <div key={loc.label} className="flex items-center justify-between rounded-2xl bg-white">
                            <div className="flex items-center gap-3">
                                <span className="text-lg text-primary">📍</span>
                                <p className="text-lg font-semibold text-text-dark">{loc.label}</p>
                            </div>
                            <span className="text-2xl">{loc.favorite ? '⭐' : '☆'}</span>
                        </div>
                    ))}
                </div>
            </section>

            <BottomNav active="Ride" />
        </div>
    )
}
