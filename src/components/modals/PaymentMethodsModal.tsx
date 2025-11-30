import type { PaymentMethod } from '../../types'
import { AppIcon } from '../AppIcon'

interface PaymentMethodsModalProps {
    selected: PaymentMethod
    onSelect: (value: PaymentMethod) => void
    onConfirm: () => void
    onClose: () => void
}

export function PaymentMethodsModal({ selected, onSelect, onConfirm, onClose }: PaymentMethodsModalProps) {
    const options = [
        { id: 'cash' as const, label: 'Cash', icon: '💵' },
        { id: 'digital' as const, label: 'Digital / Transfer', icon: '💳' },
    ]

    return (
        <div className="w-[360px] rounded-[28px] border border-primary bg-white px-6 py-8 text-text-dark shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#919191]">Payment Method</p>
            <div className="mt-4 space-y-4">
                {options.map((option) => (
                    <button
                        key={option.id}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 hover-lift active:animate-button-press ${selected === option.id ? 'border-primary bg-primary/10 shadow-sm' : 'border-zinc-200 hover:border-primary/40'
                            }`}
                        onClick={() => onSelect(option.id)}
                    >
                        <span
                            className={`grid size-6 place-items-center rounded-full border ${selected === option.id ? 'border-primary bg-primary' : 'border-zinc-300'
                                }`}
                        >
                            <span className="text-white">{selected === option.id ? '•' : ''}</span>
                        </span>
                        <AppIcon name={option.icon} className="text-2xl text-primary" />
                        <p className="text-lg font-semibold text-text-dark">{option.label}</p>
                    </button>
                ))}
            </div>
            <div className="mt-6 flex gap-4">
                <button className="flex-1 rounded-2xl border border-primary px-4 py-3 text-lg font-extrabold uppercase text-primary hover-lift active:animate-button-press transition-all duration-200" onClick={onClose}>
                    Cancel
                </button>
                <button className="flex-1 rounded-2xl bg-primary px-4 py-3 text-lg font-extrabold uppercase text-white hover-lift active:animate-button-press transition-all duration-200 shadow-sm hover:shadow-md" onClick={onConfirm}>
                    Confirm
                </button>
            </div>
        </div>
    )
}
