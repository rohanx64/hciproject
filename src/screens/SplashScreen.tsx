import { useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface SplashScreenProps {
    onContinue: () => void
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
    const { t } = useLanguage()
    useEffect(() => {
        // Auto-advance after 2 seconds
        const timer = setTimeout(() => {
            onContinue()
        }, 2000)

        return () => clearTimeout(timer)
    }, [onContinue])

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-primary relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 px-6 py-2 flex items-center justify-between z-10">
                <span className="text-white font-semibold">9:45</span>
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

            {/* Logo and Tagline */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                {/* App Logo */}
                <div className="mb-6">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-2xl">
                        <div className="text-center">
                            <div className="text-4xl font-extrabold text-white mb-1">AIR</div>
                            <div className="flex items-center justify-center gap-1">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413a1 1 0 00-1.707-.707L6.586 11.586A1 1 0 006 13v0z" />
                                </svg>
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413a1 1 0 00-1.707-.707L6.586 11.586A1 1 0 006 13v0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tagline */}
                <h1 className="text-3xl font-extrabold text-white text-center mb-8">
                    {t('Your Ride, Your Way')}
                </h1>
            </div>

            {/* Cityscape Silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 440 200" preserveAspectRatio="none">
                    {/* Cityscape buildings */}
                    <path d="M0,200 L0,150 L20,150 L20,120 L40,120 L40,140 L60,140 L60,100 L80,100 L80,160 L100,160 L100,130 L120,130 L120,180 L140,180 L140,110 L160,110 L160,150 L180,150 L180,90 L200,90 L200,170 L220,170 L220,120 L240,120 L240,140 L260,140 L260,100 L280,100 L280,160 L300,160 L300,130 L320,130 L320,190 L340,190 L340,110 L360,110 L360,150 L380,150 L380,80 L400,400 L400,140 L420,140 L420,120 L440,120 L440,200 Z" fill="white" opacity="0.3" />
                    {/* Domes and minarets */}
                    <circle cx="220" cy="80" r="25" fill="white" opacity="0.3" />
                    <rect x="215" y="80" width="10" height="40" fill="white" opacity="0.3" />
                    <circle cx="100" cy="90" r="20" fill="white" opacity="0.3" />
                    <rect x="97" y="90" width="6" height="30" fill="white" opacity="0.3" />
                    <circle cx="340" cy="85" r="22" fill="white" opacity="0.3" />
                    <rect x="337" y="85" width="6" height="35" fill="white" opacity="0.3" />
                </svg>
            </div>
        </div>
    )
}

