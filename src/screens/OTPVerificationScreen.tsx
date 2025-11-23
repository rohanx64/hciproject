import { useState, useRef, useEffect } from 'react'
import { useVoiceFeedback } from '../contexts/VoiceFeedbackContext'

interface OTPVerificationScreenProps {
    phoneNumber: string
    onVerify: (otp: string) => void
    onBack: () => void
    isSignup?: boolean
}

export function OTPVerificationScreen({ phoneNumber: _phoneNumber, onVerify, onBack, isSignup: _isSignup = false }: OTPVerificationScreenProps) {
    const { speakError } = useVoiceFeedback()
    const [otp, setOtp] = useState(['', '', '', ''])
    const [showKeypad, setShowKeypad] = useState(true)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        // Auto-focus first input
        inputRefs.current[0]?.focus()
    }, [])

    const handleNumberClick = (num: string) => {
        const emptyIndex = otp.findIndex(digit => digit === '')
        if (emptyIndex !== -1) {
            const newOtp = [...otp]
            newOtp[emptyIndex] = num
            setOtp(newOtp)

            // Auto-focus next input
            if (emptyIndex < 3) {
                inputRefs.current[emptyIndex + 1]?.focus()
            } else {
                // All digits filled, verify automatically
                setTimeout(() => {
                    onVerify(newOtp.join(''))
                }, 300)
            }
        }
    }

    const handleBackspace = () => {
        // Find last filled index (compatible with older browsers)
        let lastFilledIndex = -1
        for (let i = otp.length - 1; i >= 0; i--) {
            if (otp[i] !== '') {
                lastFilledIndex = i
                break
            }
        }
        if (lastFilledIndex !== -1) {
            const newOtp = [...otp]
            newOtp[lastFilledIndex] = ''
            setOtp(newOtp)
            inputRefs.current[lastFilledIndex]?.focus()
        }
    }

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 4).split('')
            const newOtp = [...otp]
            digits.forEach((digit, i) => {
                if (index + i < 4) {
                    newOtp[index + i] = digit
                }
            })
            setOtp(newOtp)
            if (digits.length === 4) {
                setTimeout(() => onVerify(newOtp.join('')), 300)
            }
        } else {
            const newOtp = [...otp]
            newOtp[index] = value.replace(/\D/g, '')
            setOtp(newOtp)
            if (value && index < 3) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerify = () => {
        if (otp.every(digit => digit !== '')) {
            onVerify(otp.join(''))
        } else {
            speakError('Please enter the complete 4-digit code')
        }
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 px-6 py-2 flex items-center justify-between z-10 bg-primary">
                <span className="text-white font-semibold">9:41</span>
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="w-6 h-3 border-2 border-white rounded-sm">
                        <div className="w-full h-full bg-white rounded-sm" style={{ width: '70%' }} />
                    </div>
                </div>
            </div>

            {/* Green Background */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-primary" />

            {/* Content */}
            <div className="relative z-20 mt-48 flex-1 bg-white rounded-t-[40px] px-6 pt-8 pb-4 flex flex-col">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute top-8 left-6 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-2 mt-4">Phone Verification</h1>
                <p className="text-base font-normal text-white/90 mb-8">
                    Enter your OTP code here
                </p>

                {/* OTP Input Fields */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onFocus={() => setShowKeypad(true)}
                            className="w-16 h-20 text-center text-3xl font-bold text-text-dark border-b-4 border-gray-300 focus:border-primary outline-none transition-colors"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={!otp.every(digit => digit !== '')}
                    className={`w-full rounded-full px-6 py-4 text-center font-semibold text-white transition-all duration-200 mb-4 ${otp.every(digit => digit !== '')
                            ? 'bg-primary hover:bg-primary-dark active:scale-95 shadow-lg'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    Verify Now
                </button>

                {/* Numeric Keypad */}
                {showKeypad && (
                    <div className="mt-auto grid grid-cols-3 gap-3 pb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumberClick(num.toString())}
                                className="aspect-square rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex flex-col items-center justify-center"
                            >
                                <span className="text-2xl font-semibold text-text-dark">{num}</span>
                                {num === 2 && <span className="text-xs text-gray-500">ABC</span>}
                                {num === 3 && <span className="text-xs text-gray-500">DEF</span>}
                                {num === 4 && <span className="text-xs text-gray-500">GHI</span>}
                                {num === 5 && <span className="text-xs text-gray-500">JKL</span>}
                                {num === 6 && <span className="text-xs text-gray-500">MNO</span>}
                                {num === 7 && <span className="text-xs text-gray-500">PQRS</span>}
                                {num === 8 && <span className="text-xs text-gray-500">TUV</span>}
                                {num === 9 && <span className="text-xs text-gray-500">WXYZ</span>}
                            </button>
                        ))}
                        <button
                            onClick={() => handleNumberClick('*')}
                            className="aspect-square rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
                        >
                            <span className="text-2xl font-semibold text-text-dark">*</span>
                        </button>
                        <button
                            onClick={() => handleNumberClick('0')}
                            className="aspect-square rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
                        >
                            <span className="text-2xl font-semibold text-text-dark">0</span>
                        </button>
                        <button
                            onClick={handleBackspace}
                            className="aspect-square rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
                        >
                            <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
