import { useState } from 'react'
import { Overlay } from '../Overlay'

interface VoiceActivationModalProps {
    onClose: () => void
    onProceed: (command: {
        action: 'ride' | 'delivery' | 'rental' | 'shop'
        pickup?: string
        dropoff?: string
        details?: string
    }) => void
}

interface VoiceCommand {
    id: string
    text: string
    action: 'ride' | 'delivery' | 'rental' | 'shop'
    pickup?: string
    dropoff?: string
    details?: string
}

// Demo voice command for accessibility
const demoCommand: VoiceCommand = {
    id: '1',
    text: 'Book a ride from where I am right now to Karachi University',
    action: 'ride',
    pickup: 'My current location',
    dropoff: 'Karachi University',
}

export function VoiceActivationModal({ onClose, onProceed }: VoiceActivationModalProps) {
    const [step, setStep] = useState<'initial' | 'recording' | 'processing' | 'confirm'>('initial')
    const [selectedCommand, setSelectedCommand] = useState<VoiceCommand | null>(null)
    const [, setIsRecording] = useState(false)

    const handleStartRecording = () => {
        setIsRecording(true)
        setStep('recording')
        // Simulate recording for 2 seconds
        setTimeout(() => {
            setIsRecording(false)
            setStep('processing')
            // Simulate processing
            setTimeout(() => {
                // For demo, use the demo command
                setSelectedCommand(demoCommand)
                setStep('confirm')
            }, 1500)
        }, 2000)
    }

    const handleUseDemoCommand = (command: VoiceCommand) => {
        setSelectedCommand(command)
        setStep('confirm')
    }

    const handleConfirm = () => {
        if (selectedCommand) {
            onProceed({
                action: selectedCommand.action,
                pickup: selectedCommand.pickup,
                dropoff: selectedCommand.dropoff,
                details: selectedCommand.details,
            })
        }
    }

    const defaultScript = "You can say things like:\n• 'Book a ride from my location to [destination]'\n• 'I need a delivery from [pickup] to [dropoff]'\n• 'Rent a [vehicle] for [duration]'\n• 'Order from shop and deliver to [location]'"

    return (
        <Overlay>
            <div className="w-[400px] max-h-[90vh] rounded-[24px] border-2 border-primary/20 bg-white p-6 text-text-dark shadow-2xl overflow-y-auto relative z-[3000]">
                {step === 'initial' && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-primary">Voice Activation</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-base text-gray-700 mb-4">
                                This feature helps users with physical disabilities or difficulty operating mobile phones to use AIR through voice commands.
                            </p>
                            <div className="bg-green-50 rounded-xl p-4 border-2 border-primary/20">
                                <p className="text-sm font-semibold text-primary mb-2">Default Script:</p>
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{defaultScript}</pre>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-600 mb-3">Try Demo Command:</p>
                            <button
                                onClick={() => handleUseDemoCommand(demoCommand)}
                                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-green-50 transition-all text-left"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="grid size-10 place-items-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
                                            <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z" />
                                            <path d="M12 18.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-3 0v-3a1.5 1.5 0 011.5-1.5z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-text-dark">{demoCommand.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {demoCommand.action.charAt(0).toUpperCase() + demoCommand.action.slice(1)}
                                            {demoCommand.pickup && ` • From: ${demoCommand.pickup}`}
                                            {demoCommand.dropoff && ` • To: ${demoCommand.dropoff}`}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-300 bg-white text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStartRecording}
                                className="flex-1 py-3 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z" />
                                    <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z" />
                                    <path d="M12 18.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-3 0v-3a1.5 1.5 0 011.5-1.5z" />
                                </svg>
                                Record Voice
                            </button>
                        </div>
                    </>
                )}

                {step === 'recording' && (
                    <div className="text-center py-8">
                        <div className="mb-6">
                            <div className="mx-auto size-24 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                                <div className="size-16 rounded-full bg-red-600"></div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-text-dark mb-2">Recording...</h3>
                        <p className="text-sm text-gray-600">Speak your command now</p>
                        <button
                            onClick={() => {
                                setIsRecording(false)
                                setStep('initial')
                            }}
                            className="mt-6 px-6 py-2 rounded-xl bg-gray-200 text-sm font-semibold text-text-dark hover:bg-gray-300 transition-colors"
                        >
                            Stop Recording
                        </button>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="text-center py-8">
                        <div className="mb-6">
                            <div className="mx-auto size-24 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg className="w-12 h-12 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-text-dark mb-2">Processing...</h3>
                        <p className="text-sm text-gray-600">AI is understanding your command</p>
                    </div>
                )}

                {step === 'confirm' && selectedCommand && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-primary">Confirm Command</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="bg-green-50 rounded-xl p-4 border-2 border-primary/20 mb-4">
                                <p className="text-xs font-semibold text-primary mb-2">Your Command:</p>
                                <p className="text-base font-semibold text-text-dark">{selectedCommand.text}</p>
                            </div>

                            <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-3">Deciphered Details:</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Action:</span>
                                        <span className="text-sm font-semibold text-text-dark capitalize">{selectedCommand.action}</span>
                                    </div>
                                    {selectedCommand.pickup && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Pickup:</span>
                                            <span className="text-sm font-semibold text-text-dark">{selectedCommand.pickup}</span>
                                        </div>
                                    )}
                                    {selectedCommand.dropoff && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Drop-off:</span>
                                            <span className="text-sm font-semibold text-text-dark">{selectedCommand.dropoff}</span>
                                        </div>
                                    )}
                                    {selectedCommand.details && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Details:</span>
                                            <span className="text-sm font-semibold text-text-dark">{selectedCommand.details}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setStep('initial')
                                    setSelectedCommand(null)
                                }}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-300 bg-white text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Re-record
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
                            >
                                Yes, Proceed
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Overlay>
    )
}

