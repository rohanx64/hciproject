import { assets } from '../constants/assets'
import { favoritePlaces } from '../constants/data'
import { BottomNav } from '../components/BottomNav'

interface HomeRideProps {
    onOpenQuickBook: () => void
    onOpenDropoff: () => void
    dropoffLabel: string
}

export function HomeRideScreen({ onOpenQuickBook, onOpenDropoff, dropoffLabel }: HomeRideProps) {
    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90">
            <section className="relative h-[560px] overflow-hidden">
                <img src={assets.mapBase} alt="Map" className="absolute inset-0 h-full w-full object-cover" />
                <img src={assets.mapOverlay} alt="" className="absolute inset-0 h-full w-full object-cover opacity-95" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent" />

                <button
                    className="absolute left-6 top-6 size-14 overflow-hidden rounded-full border-2 border-white shadow-card"
                    aria-label="Profile"
                >
                    <img src={assets.avatar} alt="User avatar" className="h-full w-full object-cover" />
                </button>

                <div className="absolute left-1/2 top-32 w-[260px] -translate-x-1/2 space-y-3 text-center">
                    <button
                        className="flex w-full items-center justify-between rounded-3xl bg-primary px-6 py-3 text-lg font-extrabold uppercase tracking-wider text-white shadow-lg transition hover:bg-primary-dark"
                        onClick={onOpenQuickBook}
                    >
                        <span>Quick Book</span>
                        <img src={assets.quickBookArrow} alt="" className="h-5 w-5" />
                    </button>

                    <div className="rounded-[26px] border border-[#c8f0c0] bg-white/95 p-4 shadow-card">
                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#c8c7cc]">Pickup</p>
                        <div className="mt-1 flex items-center gap-3">
                            <p className="flex-1 text-lg font-semibold text-text-dark">My current location</p>
                            <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary text-sm font-bold">Now</span>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 top-64 flex flex-col items-center">
                    <img src={assets.pointer} alt="Pickup pin" className="h-60 w-60" />
                    <div className="mt-6 flex gap-10">
                        <button
                            className="grid size-14 place-items-center rounded-full border border-primary/60 bg-white shadow-card"
                            aria-label="Voice input"
                        >
                            <img src={assets.micButton} alt="" className="h-8 w-8" />
                        </button>
                        <button
                            className="grid size-14 place-items-center rounded-full border border-primary/60 bg-white shadow-card"
                            aria-label="Use my location"
                        >
                            <img src={assets.locationButton} alt="" className="h-8 w-8" />
                        </button>
                    </div>
                </div>
            </section>

            <section className="relative flex-1 bg-white px-6 pb-8 pt-4">
                <div className="absolute left-1/2 top-1 -translate-x-1/2">
                    <img src={assets.dragHandle} alt="" className="h-2 w-16" />
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <p className="font-display text-4xl font-semibold text-primary">Ride</p>
                    <span className="text-sm text-[#7d7d7d]">2 min away</span>
                </div>

                <div
                    className="mt-6 cursor-pointer rounded-3xl border border-[#cde5c9] bg-white/90 p-4 shadow-card"
                    onClick={onOpenDropoff}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#919191]">Drop-off</p>
                    <div className="mt-2 flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-full bg-[#fbe7ee] text-accent">♥</div>
                        <div className="flex-1 text-lg font-semibold text-text-dark">{dropoffLabel}</div>
                        <img src={assets.chevronIcon} alt="" className="h-4 w-4" />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {favoritePlaces.map((place) => (
                        <button
                            key={place}
                            className="rounded-full border border-primary/60 bg-white px-4 py-2 text-sm font-medium text-text-dark transition hover:bg-primary/10"
                        >
                            {place}
                        </button>
                    ))}
                </div>
            </section>

            <BottomNav active="Ride" />
        </div>
    )
}
