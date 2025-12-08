import { useState } from 'react'
import { AppIcon } from '../components/AppIcon'

interface SignupScreenProps {
    onSignup: (phoneNumber: string) => void
    onSwitchToLogin: () => void
    onCallBykea: () => void
}

export function SignupScreen({ onSignup, onSwitchToLogin, onCallBykea }: SignupScreenProps) {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [showKeypad, setShowKeypad] = useState(false)

    const handleNumberClick = (num: string) => {
        if (phoneNumber.length < 10) {
            setPhoneNumber(prev => prev + num)
        }
    }

    const handleBackspace = () => {
        setPhoneNumber(prev => prev.slice(0, -1))
    }

    const handleNext = () => {
        if (phoneNumber.length === 10) {
            onSignup(phoneNumber)
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

            {/* Green Background with Cityscape */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-primary overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 440 200" preserveAspectRatio="none">
                    <path d="M0,200 L0,150 L20,150 L20,120 L40,120 L40,140 L60,140 L60,100 L80,100 L80,160 L100,160 L100,130 L120,130 L120,180 L140,180 L140,110 L160,110 L160,150 L180,150 L180,90 L200,90 L200,170 L220,170 L220,120 L240,120 L240,140 L260,140 L260,100 L280,100 L280,160 L300,160 L300,130 L320,130 L320,190 L340,190 L340,110 L360,110 L360,150 L380,150 L380,80 L400,400 L400,140 L420,140 L420,120 L440,120 L440,200 Z" fill="white" opacity="0.2" />
                </svg>
            </div>

            {/* White Card Container */}
            <div className="relative z-20 mt-48 flex-1 bg-white rounded-t-[40px] px-6 pt-8 pb-6 flex flex-col overflow-y-auto">
                {/* Tabs */}
                <div className="flex items-center gap-6 mb-6">
                    <button className="text-base font-bold text-text-dark relative">
                        Sign Up
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary -mb-1" />
                    </button>
                    <button
                        onClick={onSwitchToLogin}
                        className="text-base font-normal text-gray-400"
                    >
                        Sign In
                    </button>
                </div>

                {/* Instruction */}
                <p className="text-base font-normal text-text-dark mb-6">
                    Create account with your phone number
                </p>

                {/* Phone Number Input */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-4 py-4 shadow-sm focus-within:border-primary focus-within:shadow-md transition-all">
                        {/* Country Code */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <AppIcon name="🇵🇰" className="text-2xl text-primary" />
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-base font-semibold text-text-dark">+92</span>
                        </div>

                        {/* Phone Number Display */}
                        <div className="flex-1 flex items-center">
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="Enter phone number"
                                className="flex-1 text-lg font-normal text-text-dark bg-transparent border-none outline-none"
                                maxLength={10}
                                onFocus={() => setShowKeypad(true)}
                            />
                        </div>

                        {/* Clear Button */}
                        {phoneNumber.length > 0 && (
                            <button
                                onClick={() => setPhoneNumber('')}
                                className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={phoneNumber.length !== 10}
                    className={`w-full rounded-full px-6 py-4 text-center font-semibold text-white transition-all duration-200 mb-4 ${phoneNumber.length === 10
                        ? 'bg-primary hover:bg-primary-dark active:scale-95 shadow-lg'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>

                {/* Call AIR Button */}
                <button
                    onClick={onCallBykea}
                    className="w-full rounded-full px-6 py-4 text-center font-semibold text-primary border-2 border-primary bg-white hover:bg-primary hover:text-white transition-all duration-200 active:scale-95 mb-4 flex items-center justify-center gap-2"
                >
                    <AppIcon name="📞" className="text-xl" />
                    Call AIR
                </button>

                {/* Numeric Keypad */}
                {showKeypad && (
                    <div className="mt-auto grid grid-cols-3 gap-2 pb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumberClick(num.toString())}
                                className="h-12 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
                            >
                                <span className="text-xl font-semibold text-text-dark">{num}</span>
                            </button>
                        ))}
                        <button
                            onClick={() => handleNumberClick('*')}
                            className="h-12 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
                        >
                            <span className="text-xl font-semibold text-text-dark">*</span>
                        </button>
                        <button
                            onClick={() => handleNumberClick('0')}
                            className="h-12 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
                        >
                            <span className="text-xl font-semibold text-text-dark">0</span>
                        </button>
                        <button
                            onClick={handleBackspace}
                            className="h-12 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

