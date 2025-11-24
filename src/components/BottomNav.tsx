import { navItems } from '../constants/data'

interface BottomNavProps {
    active: string
    onNavigate?: (screen: string) => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
    return (
        <nav className="grid grid-cols-4 border-t border-gray-200 bg-white px-4 py-6 text-center text-sm font-semibold relative z-[1000]">
            {navItems.map((item) => {
                const isActive = item.label === active
                const isDelivery = item.label === 'Delivery'
                
                return (
                    <button
                        key={item.label}
                        onClick={() => onNavigate?.(item.label)}
                        className={`flex flex-col items-center gap-2 rounded-[11.7px] p-3 transition-all duration-200 ease-in-out ${
                            isActive && isDelivery
                                ? 'bg-[rgba(255,149,0,0.15)] border-[0.585px] border-[#ff9500] text-[#ff9500] shadow-sm'
                                : isActive && item.label === 'Rentals'
                                ? 'bg-[rgba(255,217,0,0.18)] border-[0.585px] border-[#ffd900] text-[#ffd900] shadow-sm'
                                : isActive && item.label === 'Shops'
                                ? 'bg-[rgba(59,130,246,0.15)] border-[0.585px] border-[#3b82f6] text-[#3b82f6] shadow-sm'
                                : isActive
                                ? 'bg-[#d5eecf] border-[0.585px] border-[rgba(50,153,29,0.64)] text-[#007311] shadow-sm'
                                : 'text-[#7d7d7d] hover:bg-zinc-100 active:scale-95'
                        }`}
                    >
                        <span className="grid size-14 place-items-center rounded-2xl bg-transparent">
                            <span className={`text-3xl ${isActive ? '' : 'opacity-70'}`}>
                                {item.icon}
                            </span>
                        </span>
                        <span className="text-[11.7px] font-normal">{item.label}</span>
                    </button>
                )
            })}
        </nav>
    )
}
