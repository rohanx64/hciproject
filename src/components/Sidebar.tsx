import { useState } from 'react'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    onNavigate: (screen: string) => void
    onLogout?: () => void
    userName?: string
    userAvatar?: string
}

export function Sidebar({ isOpen, onClose, onNavigate, onLogout, userName = 'Rohan Riaz', userAvatar }: SidebarProps) {
    const menuItems = [
        { id: 'wallet', label: 'My Wallet', icon: '💳' },
        { id: 'history', label: 'History', icon: '🕐' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'voiceFeedback', label: 'Voice Feedback', icon: '🔊' },
        { id: 'callBykea', label: 'Call Bykea', icon: '📞' },
        { id: 'language', label: 'Language', icon: '🌐' },
        { id: 'helpSupport', label: 'Help & Support', icon: '❓' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
        { id: 'logout', label: 'Logout', icon: '🚪' },
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
                className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl z-[2001] rounded-l-[40px] transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
                }`}
            >
                {/* Header with Profile */}
                <div className="bg-primary px-6 pt-16 pb-8">
                    <div className="flex flex-col items-center gap-3">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="size-20 rounded-full border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="size-20 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                                <span className="text-4xl text-white font-bold">{userName.charAt(0)}</span>
                            </div>
                        )}
                        <h2 className="text-xl font-bold text-white">{userName}</h2>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex flex-col py-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuItemClick(item.id)}
                            className={`flex items-center gap-4 px-6 py-4 text-left transition-colors duration-200 ${
                                item.id === 'logout'
                                    ? 'text-red-500 hover:bg-red-50'
                                    : 'text-text-dark hover:bg-gray-50'
                            }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-base font-normal">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </>
    )
}

