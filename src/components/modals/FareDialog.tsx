import { useState, useEffect } from 'react'
import { AppIcon } from '../AppIcon'

interface FareDialogProps {
    fare: number
    onChangeFare: (value: number) => void
    onConfirm: () => void
    onViewBreakdown: () => void
    recommendedFare?: number
}

export function FareDialog({ fare, onChangeFare, onConfirm, onViewBreakdown, recommendedFare = 250 }: FareDialogProps) {
    const [inputValue, setInputValue] = useState(fare.toString())
    const [isEditing, setIsEditing] = useState(false)

    // Update input when fare prop changes
    useEffect(() => {
        setInputValue(fare.toString())
    }, [fare])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        // Allow only numbers
        if (value === '' || /^\d+$/.test(value)) {
            setInputValue(value)
        }
    }

    const handleInputBlur = () => {
        setIsEditing(false)
        const numValue = parseInt(inputValue, 10)
        if (!isNaN(numValue) && numValue >= 50) {
            onChangeFare(numValue)
        } else {
            // Reset to current fare if invalid
            setInputValue(fare.toString())
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur()
        }
    }

    const handleInputFocus = () => {
        setIsEditing(true)
        // Select all text when focusing
        setTimeout(() => {
            const input = document.activeElement as HTMLInputElement
            if (input && input.select) {
                input.select()
            }
        }, 0)
    }

    const handleDecrease = () => {
        onChangeFare(Math.max(50, fare - 50))
    }

    const handleIncrease = () => {
        onChangeFare(fare + 50)
    }

    return (
        <div className="w-[360px] rounded-[28px] border border-primary bg-white px-6 py-8 text-text-dark shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#919191]">YOUR FARE</p>
            <div className="mt-2 flex items-center justify-between text-4xl font-extrabold text-[#242e42]">
                <button
                    className="size-10 rounded-full border border-zinc-200 bg-white hover:bg-gray-50 text-2xl font-bold text-gray-600 hover-lift active:animate-button-press transition-all duration-200"
                    onClick={handleDecrease}
                >
                    −
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-[#8d95a8] text-2xl">PKR</span>
                    {isEditing ? (
                        <input
                            type="text"
                            inputMode="numeric"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onFocus={handleInputFocus}
                            onKeyDown={handleInputKeyDown}
                            className="w-32 text-4xl font-extrabold text-[#242e42] border-b-2 border-primary outline-none text-center bg-transparent"
                            autoFocus
                        />
                    ) : (
                        <span
                            onClick={() => setIsEditing(true)}
                            className="cursor-text hover:bg-gray-50 px-2 py-1 rounded transition-colors min-w-[80px] inline-block text-center"
                            title="Click to edit fare"
                        >
                            {fare}
                        </span>
                    )}
                </div>
                <button
                    className="size-10 rounded-full border border-zinc-200 bg-white hover:bg-gray-50 text-2xl font-bold text-gray-600 hover-lift active:animate-button-press transition-all duration-200"
                    onClick={handleIncrease}
                >
                    +
                </button>
            </div>
            {recommendedFare && (
                <p className="mt-3 text-center text-sm font-semibold text-[#919191]">
                    RECOMMENDED FARE: PKR {recommendedFare}
                </p>
            )}
            <div className="mt-4 rounded-2xl bg-primary px-4 py-3 text-center text-white shadow-card hover-lift active:animate-button-press transition-all duration-200">
                <button className="text-lg font-extrabold uppercase tracking-widest w-full" onClick={onConfirm}>
                    Confirm
                </button>
            </div>
            <button
                className="mt-4 flex w-full items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3 text-left text-[#919191] hover:bg-gray-50 hover-lift active:animate-button-press transition-all duration-200"
                onClick={onViewBreakdown}
            >
                Fare Breakdown
                <AppIcon name="›" className="text-2xl" />
            </button>
        </div>
    )
}
