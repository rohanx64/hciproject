import { BottomNav } from '../components/BottomNav'

interface HistoryEntry {
    id: string
    pickup: string
    dropoff: string
    price: string
    status: 'pending' | 'completed' | 'cancelled'
    date?: string
}

interface HistoryScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

const mockHistory: HistoryEntry[] = [
    {
        id: '1',
        pickup: 'Karachi University',
        dropoff: 'Habib University',
        price: 'RS. 120',
        status: 'pending',
    },
    {
        id: '2',
        pickup: 'Habib University',
        dropoff: 'Home',
        price: 'RS. 129',
        status: 'completed',
    },
    {
        id: '3',
        pickup: 'FAST',
        dropoff: 'Karachi University',
        price: 'Rs. 93',
        status: 'cancelled',
    },
]

export function HistoryScreen({ onNavigate, onBack, hideBottomNav = true }: HistoryScreenProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-primary'
            case 'cancelled':
                return 'text-gray-500'
            case 'pending':
                return 'text-blue-500'
            default:
                return 'text-gray-500'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Completed'
            case 'cancelled':
                return 'Cancelled'
            case 'pending':
                return 'Confirm'
            default:
                return status
        }
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Header */}
            <header className="bg-primary px-6 py-4 flex items-center gap-4 z-10 relative">
                <button
                    onClick={() => {
                        onNavigate?.('home')
                    }}
                    className="text-white hover:opacity-80 transition-opacity"
                    aria-label="Back to Home"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white">History</h1>
            </header>

            {/* History List */}
            <main className="flex-1 overflow-y-auto bg-white">
                <div className="px-6 py-4 space-y-4">
                    {mockHistory.map((entry) => (
                        <div
                            key={entry.id}
                            className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Pickup and Dropoff */}
                            <div className="flex flex-col gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-3 rounded-full bg-primary flex-shrink-0"></div>
                                    <span className="text-base font-normal text-text-dark">{entry.pickup}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[#ff3b30] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <span className="text-base font-normal text-text-dark">{entry.dropoff}</span>
                                </div>
                            </div>

                            {/* Price and Status */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">💰</span>
                                    <span className="text-base font-normal text-text-dark">{entry.price}</span>
                                </div>
                                {entry.status === 'pending' ? (
                                    <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors">
                                        <span className="text-base font-normal">{getStatusText(entry.status)}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <span className={`text-base font-normal ${getStatusColor(entry.status)}`}>
                                        {getStatusText(entry.status)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Bottom Navigation - Hidden when in sidebar screens */}
            {!hideBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white max-w-full">
                    <BottomNav active="Ride" onNavigate={onNavigate} />
                </div>
            )}
        </div>
    )
}

