interface FareDialogProps {
    fare: number
    onChangeFare: (value: number) => void
    onConfirm: () => void
    onViewBreakdown: () => void
}

export function FareDialog({ fare, onChangeFare, onConfirm, onViewBreakdown }: FareDialogProps) {
    return (
        <div className="w-[360px] rounded-[28px] border border-primary bg-white px-6 py-8 text-text-dark shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#919191]">Your Fare</p>
            <div className="mt-2 flex items-center justify-between text-4xl font-extrabold text-[#242e42]">
                <button
                    className="size-10 rounded-full border border-zinc-200 text-2xl"
                    onClick={() => onChangeFare(Math.max(50, fare - 50))}
                >
                    −
                </button>
                <span>
                    <span className="text-[#8d95a8]">PKR</span> {fare}
                </span>
                <button
                    className="size-10 rounded-full border border-zinc-200 text-2xl"
                    onClick={() => onChangeFare(fare + 50)}
                >
                    +
                </button>
            </div>
            <div className="mt-4 rounded-2xl bg-primary px-4 py-3 text-center text-white shadow-card">
                <button className="text-lg font-extrabold uppercase tracking-widest" onClick={onConfirm}>
                    Confirm
                </button>
            </div>
            <button
                className="mt-4 flex w-full items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3 text-left text-[#919191]"
                onClick={onViewBreakdown}
            >
                Fare Breakdown
                <span className="text-2xl">›</span>
            </button>
        </div>
    )
}
