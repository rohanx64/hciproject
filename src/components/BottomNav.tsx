import { navItems } from '../constants/data'

interface BottomNavProps {
    active: string
}

export function BottomNav({ active }: BottomNavProps) {
    return (
        <nav className="grid grid-cols-4 border-t px-4 py-6 text-center text-sm font-semibold text-text-muted">
            {navItems.map((item) => (
                <button
                    key={item.label}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-3 transition ${item.label === active ? 'bg-[#d5eecf] text-primary shadow-card' : 'text-text-muted hover:bg-zinc-100'
                        }`}
                >
                    <span className="grid size-14 place-items-center rounded-2xl bg-transparent">
                        <img
                            src={item.icon}
                            alt={`${item.label} icon`}
                            className={`h-9 w-9 ${item.label === active ? '' : 'opacity-70'}`}
                        />
                    </span>
                    {item.label}
                </button>
            ))}
        </nav>
    )
}
