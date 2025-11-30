import { AppIcon } from './AppIcon'
import { useLanguage } from '../contexts/LanguageContext'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    onNavigate: (screen: string) => void
    onLogout?: () => void
    userName?: string
    userAvatar?: string
}

export function Sidebar({ isOpen, onClose, onNavigate, onLogout, userName = 'Rohan Riaz', userAvatar }: SidebarProps) {
    const { t } = useLanguage()
    
    const menuItems = [
        { id: 'history', label: t('History'), icon: '🕐' },
        { id: 'voiceFeedback', label: t('Voice Feedback'), icon: '🔊' },
        { id: 'callBykea', label: t('Call AIR'), icon: '📞' },
        { id: 'language', label: t('Language'), icon: '🌐' },
        { id: 'helpSupport', label: t('Help & Support'), icon: '❓' },
        { id: 'settings', label: t('Settings'), icon: '⚙️' },
        { id: 'logout', label: t('Logout'), icon: '🚪' },
    ]

    const handleMenuItemClick = (itemId: string) => {
        if (itemId === 'logout') {
            // Handle logout
            onLogout?.()
            onClose()
        } else {
            onNavigate(itemId)
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 z-[2000] transition-all duration-300 rounded-[40px] ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`absolute left-0 top-0 h-full w-[300px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.15)] backdrop-blur-xl z-[2001] rounded-l-[40px] transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
                } flex flex-col border-r border-gray-100/50`}
            >
                {/* Header with Profile - Enhanced */}
                <div className="bg-primary px-6 pt-16 pb-10 relative overflow-hidden">
                    {/* Subtle decorative background pattern - More refined */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12" />
                    </div>
                    
                    {/* Brand Logo/Name */}
                    <div className="relative z-10 mb-6">
                        <div className="flex items-center gap-2 justify-center">
                            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-lg font-extrabold text-white">A</span>
                            </div>
                            <span className="text-lg font-extrabold text-white tracking-tight">AIR</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 relative z-10">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="size-24 rounded-full border-4 border-white shadow-xl ring-4 ring-white/20 transition-transform duration-300 hover:scale-105"
                            />
                        ) : (
                            <div className="size-24 rounded-full border-4 border-white shadow-xl ring-4 ring-white/20 bg-gradient-to-br from-white/25 to-white/8 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                                <span className="text-5xl text-white font-bold drop-shadow-lg">{userName.charAt(0)}</span>
                            </div>
                        )}
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white drop-shadow-md mb-1">{userName}</h2>
                            <div className="flex items-center gap-2 justify-center">
                                <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse shadow-sm" />
                                <span className="text-xs text-white/90 font-medium">{t('Active')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items - Enhanced */}
                <nav className="flex-1 flex flex-col py-2 overflow-y-auto pr-2 scrollbar-hide">
                    {menuItems.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuItemClick(item.id)}
                            className={`flex items-center gap-4 px-6 py-3.5 mx-2 rounded-xl text-left transition-all duration-200 group relative hover-lift ${
                                item.id === 'logout'
                                    ? 'text-red-500 hover:bg-red-50/80'
                                    : 'text-text-dark hover:bg-primary/3'
                            }`}
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            {/* Icon container with background - Enhanced shadows */}
                            <div className={`grid size-10 place-items-center rounded-xl transition-all duration-200 shadow-sm ${
                                item.id === 'logout'
                                    ? 'bg-red-50 group-hover:bg-red-100 group-hover:shadow-md'
                                    : 'bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-md'
                            }`}>
                                <AppIcon 
                                    name={item.icon} 
                                    className={`text-xl transition-transform duration-200 ${
                                        item.id === 'logout' ? 'text-red-500' : 'text-primary'
                                    } group-hover:scale-110`} 
                                />
                            </div>
                            <span className="text-base font-semibold flex-1">{item.label}</span>
                            {/* Arrow indicator - Enhanced */}
                            <svg 
                                className={`w-5 h-5 text-gray-400 transition-all duration-200 group-hover:translate-x-1.5 ${
                                    item.id === 'logout' ? 'group-hover:text-red-400' : 'group-hover:text-primary'
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}
                </nav>
            </div>
        </>
    )
}

