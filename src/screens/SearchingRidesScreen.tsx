import { useEffect, useState } from 'react'
import { assets } from '../constants/assets'
import { BottomNav } from '../components/BottomNav'

interface SearchingRidesProps {
    dropoffLabel: string
    onRidesFound: () => void
}

export function SearchingRidesScreen({ dropoffLabel, onRidesFound }: SearchingRidesProps) {
    const [dots, setDots] = useState('.')

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'))
        }, 500)

        // Simulate finding rides after 3 seconds
        const timeout = setTimeout(() => {
            onRidesFound()
        }, 3000)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [onRidesFound])

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-[844px]">
            <section className="relative h-[560px] overflow-hidden">
                <img src={assets.mapBase} alt="Map" className="absolute inset-0 h-full w-full object-cover" />
                <img src={assets.mapOverlay} alt="" className="absolute inset-0 h-full w-full object-cover opacity-95" />

                {/* Animated pulse overlay */}
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />

                {/* Route info card */}
                <div className="absolute left-6 right-6 top-16 space-y-3 rounded-3xl border-2 border-primary/60 bg-white/95 p-4 shadow-card">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8c7cc]">Pickup</p>
                        <p className="text-lg font-semibold text-text-dark">My current location</p>
                    </div>
                    <div className="border-l-2 border-dashed border-primary pl-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8c7cc]">Drop-off</p>
                        <p className="text-lg font-semibold text-text-dark">{dropoffLabel}</p>
                    </div>
                </div>

                {/* Animated searching indicator */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
                    {/* Ripple effect */}
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20" />
                        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30" style={{ animationDelay: '0.5s' }} />
                        <div className="relative grid size-24 place-items-center rounded-full bg-primary shadow-lg">
                            <img src={assets.motoIcon} alt="" className="h-12 w-12 brightness-0 invert" />
                        </div>
                    </div>

                    {/* Searching text */}
                    <div className="rounded-full bg-white/95 px-6 py-3 shadow-card">
                        <p className="text-lg font-semibold text-primary">
                            Searching for rides{dots}
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 pb-8 pt-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-display font-semibold text-text-dark">Finding your ride</p>
                        <div className="flex gap-1">
                            <span className="size-2 rounded-full bg-primary animate-bounce" />
                            <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <div className="grid size-12 place-items-center rounded-full bg-primary/10">
                                <span className="text-2xl">🔍</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-text-dark">Searching nearby drivers</p>
                                <p className="text-sm text-[#7d7d7d]">This usually takes a few seconds</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                            <div className="grid size-12 place-items-center rounded-full bg-zinc-100">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-text-dark">Your fare: 900 Rs.</p>
                                <p className="text-sm text-[#7d7d7d]">Estimated for 11 km</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full rounded-2xl border-2 border-[#ff544a] bg-white px-4 py-4 text-lg font-extrabold uppercase text-[#ff544a] transition hover:bg-[#ff544a] hover:text-white">
                        Cancel Search
                    </button>
                </div>
            </section>

            <BottomNav active="Ride" />
        </div>
    )
}
