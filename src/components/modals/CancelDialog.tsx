interface CancelDialogProps {
    onConfirm: () => void
    onDismiss: () => void
}

export function CancelDialog({ onConfirm, onDismiss }: CancelDialogProps) {
    return (
        <div className="w-[360px] rounded-[28px] border border-primary bg-white px-6 py-8 text-center text-text-dark shadow-2xl">
            <p className="text-xl font-medium">
                Cancelling will <span className="font-extrabold">remove all details you have added</span>, are you sure?
            </p>
            <div className="mt-6 flex gap-4">
                <button
                    className="flex-1 rounded-2xl bg-[#ff544a] px-4 py-3 text-base font-extrabold uppercase tracking-wide text-white shadow-[3px_3px_0_rgba(245,45,86,0.3)] transition hover:brightness-95"
                    onClick={onConfirm}
                >
                    Yes, Cancel
                </button>
                <button
                    className="flex-1 rounded-2xl bg-primary px-4 py-3 text-base font-extrabold uppercase tracking-wide text-white shadow-[3px_3px_0_rgba(50,153,29,0.33)] transition hover:bg-primary-dark"
                    onClick={onDismiss}
                >
                    No
                </button>
            </div>
        </div>
    )
}
