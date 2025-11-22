import { useState, useEffect } from 'react'

interface CallScreenProps {
    onNavigate?: (screen: string) => void
    onClose: () => void
    contactName: string
    contactAvatar?: string
    contactPhone?: string
    serviceType?: 'ride' | 'delivery' | 'shop' | 'rental'
    isIncoming?: boolean
}

export function CallScreen({
    onNavigate,
    onClose,
    contactName,
    contactAvatar,
    contactPhone,
    serviceType = 'ride',
    isIncoming = false,
}: CallScreenProps) {
    const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'active' | 'ended'>(
        isIncoming ? 'ringing' : 'connecting'
    )
    const [callDuration, setCallDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [isSpeakerOn, setIsSpeakerOn] = useState(false)

    useEffect(() => {
        if (callStatus === 'connecting') {
            // Simulate connection
            setTimeout(() => setCallStatus('ringing'), 1000)
        }
        if (callStatus === 'ringing') {
            // Simulate answer after 2 seconds
            setTimeout(() => setCallStatus('active'), 2000)
        }
        if (callStatus === 'active') {
            // Start timer
            const interval = setInterval(() => {
                setCallDuration((prev) => prev + 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [callStatus])

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleEndCall = () => {
        setCallStatus('ended')
        setTimeout(() => {
            onClose()
        }, 500)
    }

    const handleAnswer = () => {
        setCallStatus('active')
    }

    const serviceColors = {
        ride: 'primary',
        delivery: '[#ff9500]',
        shop: '[#3b82f6]',
    }

    const bgColor = serviceType === 'delivery' ? 'bg-[#ff9500]' : serviceType === 'shop' ? 'bg-[#3b82f6]' : 'bg-primary'
    const gradientColor = serviceType === 'delivery' ? 'from-[#ff9500] to-[#e68600]' : serviceType === 'shop' ? 'from-[#3b82f6] to-[#2563eb]' : 'from-primary to-primary-dark'

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-[844px] relative">
            {/* Background with gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${gradientColor} opacity-95`} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-12">
                {/* Contact Avatar */}
                <div className="mb-8">
                    {contactAvatar ? (
                        <div className="size-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                            <img src={contactAvatar} alt={contactName} className="h-full w-full object-cover" />
                        </div>
                    ) : (
                        <div className={`size-32 rounded-full ${bgColor} border-4 border-white shadow-2xl flex items-center justify-center`}>
                            <span className="text-5xl text-white font-bold">{contactName[0]}</span>
                        </div>
                    )}
                </div>

                {/* Contact Name */}
                <h1 className="text-3xl font-extrabold text-white mb-2">{contactName}</h1>

                {/* Call Status */}
                <p className="text-lg text-white/90 mb-1">
                    {callStatus === 'connecting' && 'Connecting...'}
                    {callStatus === 'ringing' && (isIncoming ? 'Incoming call' : 'Ringing...')}
                    {callStatus === 'active' && formatDuration(callDuration)}
                    {callStatus === 'ended' && 'Call ended'}
                </p>

                {/* Phone Number */}
                {contactPhone && (
                    <p className="text-base text-white/70 mb-8">{contactPhone}</p>
                )}

                {/* Call Controls - Only show when active */}
                {callStatus === 'active' && (
                    <div className="w-full max-w-sm space-y-4 mb-8">
                        {/* Mute Button */}
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`w-full rounded-2xl px-6 py-4 flex items-center justify-center gap-3 ${
                                isMuted ? 'bg-white/20' : 'bg-white/10'
                            } backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 active:scale-95 transition-all duration-200`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMuted ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                )}
                            </svg>
                            <span className="font-semibold">{isMuted ? 'Unmute' : 'Mute'}</span>
                        </button>

                        {/* Speaker Button */}
                        <button
                            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                            className={`w-full rounded-2xl px-6 py-4 flex items-center justify-center gap-3 ${
                                isSpeakerOn ? 'bg-white/20' : 'bg-white/10'
                            } backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 active:scale-95 transition-all duration-200`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                            <span className="font-semibold">{isSpeakerOn ? 'Speaker On' : 'Speaker Off'}</span>
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-6 w-full max-w-sm">
                    {callStatus === 'ringing' && isIncoming ? (
                        <>
                            {/* Decline */}
                            <button
                                onClick={handleEndCall}
                                className="size-16 rounded-full bg-[#ff3b30] flex items-center justify-center shadow-lg hover:bg-[#cc2920] active:scale-90 transition-all duration-200"
                                aria-label="Decline"
                            >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {/* Answer */}
                            <button
                                onClick={handleAnswer}
                                className="size-20 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary-dark active:scale-90 transition-all duration-200"
                                aria-label="Answer"
                            >
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        /* End Call Button */
                        <button
                            onClick={handleEndCall}
                            className="size-20 rounded-full bg-[#ff3b30] flex items-center justify-center shadow-lg hover:bg-[#cc2920] active:scale-90 transition-all duration-200"
                            aria-label="End call"
                        >
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

