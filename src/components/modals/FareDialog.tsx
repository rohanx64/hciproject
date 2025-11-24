import { AppIcon } from '../AppIcon'

interface FareDialogProps {
    fare: number
    onChangeFare: (value: number) => void
    onConfirm: () => void
    onViewBreakdown: () => void
    recommendedFare?: number
}

export function FareDialog({ fare, onChangeFare, onConfirm, onViewBreakdown, recommendedFare = 250 }: FareDialogProps) {
    return (
        <div className="w-[360px] rounded-[28px] border border-primary bg-white px-6 py-8 text-text-dark shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#919191]">YOUR FARE</p>
            <div className="mt-2 flex items-center justify-between text-4xl font-extrabold text-[#242e42]">
                <button
                    className="size-10 rounded-full border border-zinc-200 bg-white hover:bg-gray-50 text-2xl font-bold text-gray-600 active:scale-90 transition-all duration-200"
                    onClick={() => onChangeFare(Math.max(50, fare - 50))}
                >
                    −
                </button>
                <span>
                    <span className="text-[#8d95a8]">PKR</span> {fare}
                </span>
                <button
                    className="size-10 rounded-full border border-zinc-200 bg-white hover:bg-gray-50 text-2xl font-bold text-gray-600 active:scale-90 transition-all duration-200"
                    onClick={() => onChangeFare(fare + 50)}
                >
                    +
                </button>
            </div>
            {recommendedFare && (
                <p className="mt-3 text-center text-sm font-semibold text-[#919191]">
                    RECOMMENDED FARE: PKR {recommendedFare}
                </p>
            )}
            <div className="mt-4 rounded-2xl bg-primary px-4 py-3 text-center text-white shadow-card">
                <button className="text-lg font-extrabold uppercase tracking-widest" onClick={onConfirm}>
                    Confirm
                </button>
            </div>
            <button
                className="mt-4 flex w-full items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3 text-left text-[#919191] hover:bg-gray-50 transition-all duration-200 active:scale-95"
                onClick={onViewBreakdown}
            >
                Fare Breakdown
                <AppIcon name="›" className="text-2xl" />
            </button>
        </div>
    )
}
