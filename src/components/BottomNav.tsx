import { navItems } from '../constants/data'
import { AppIcon } from './AppIcon'
import { useLanguage } from '../contexts/LanguageContext'

interface BottomNavProps {
    active: string
    onNavigate?: (screen: string) => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
    const { t } = useLanguage()

    return (
        <nav className="grid grid-cols-4 border-t border-gray-200/80 bg-white/98 backdrop-blur-xl px-4 py-3 text-center text-xs font-semibold relative z-[1000]">
            {navItems.map((item) => {
                const translatedLabel = t(item.label)
                const isActive = item.label === active
                const isDelivery = item.label === 'Delivery'

                return (
                    <button
                        key={item.label}
                        onClick={() => onNavigate?.(item.label)}
                        className={`flex flex-col items-center gap-1.5 rounded-[14px] px-3 py-2.5 transition-all duration-300 ease-out relative group hover-lift ${isActive && isDelivery
                                ? 'bg-gradient-to-b from-[rgba(255,149,0,0.08)] to-[rgba(255,149,0,0.04)] border border-[#ff9500]/30 text-[#ff9500] shadow-[0_2px_6px_rgba(255,149,0,0.15)]'
                                : isActive && item.label === 'Rentals'
                                    ? 'bg-gradient-to-b from-[rgba(255,217,0,0.1)] to-[rgba(255,217,0,0.05)] border border-[#ffd900]/30 text-[#ffd900] shadow-[0_2px_6px_rgba(255,217,0,0.15)]'
                                    : isActive && item.label === 'Shops'
                                        ? 'bg-gradient-to-b from-[rgba(59,130,246,0.08)] to-[rgba(59,130,246,0.04)] border border-[#3b82f6]/30 text-[#3b82f6] shadow-[0_2px_6px_rgba(59,130,246,0.15)]'
                                        : isActive
                                            ? 'bg-gradient-to-b from-[rgba(50,153,29,0.08)] to-[rgba(50,153,29,0.04)] border border-primary/30 text-primary shadow-[0_2px_6px_rgba(50,153,29,0.12)]'
                                            : 'text-[#7d7d7d] hover:bg-gray-50/80 active:animate-button-press'
                            }`}
                    >
                        <span className={`grid size-12 place-items-center rounded-xl transition-all duration-300 overflow-hidden ${isActive ? 'scale-110 shadow-sm' : 'group-hover:scale-105'
                            }`}>
                            <AppIcon
                                name={item.icon}
                                className={`text-[40px] transition-all duration-300 ${isActive
                                        ? 'drop-shadow-sm'
                                        : 'opacity-60 group-hover:opacity-80'
                                    }`}
                            />
                        </span>
                        <span className={`text-[11px] font-semibold tracking-wide transition-all duration-300 ${isActive ? 'scale-105' : ''
                            }`}>{translatedLabel}</span>
                        {/* Active indicator dot */}
                        {isActive && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current animate-pulse" />
                        )}
                    </button>
                )
            })}
        </nav>
    )
}
