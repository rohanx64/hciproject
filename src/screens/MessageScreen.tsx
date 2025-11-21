import { useState, useRef, useEffect } from 'react'

interface Message {
    id: string
    text: string
    sender: 'user' | 'driver'
    timestamp: Date
}

interface MessageScreenProps {
    onNavigate?: (screen: string) => void
    onClose: () => void
    contactName: string
    contactAvatar?: string
    serviceType?: 'ride' | 'delivery' | 'shop'
}

export function MessageScreen({
    onNavigate,
    onClose,
    contactName,
    contactAvatar,
    serviceType = 'ride',
}: MessageScreenProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m on my way.',
            sender: 'driver',
            timestamp: new Date(Date.now() - 60000),
        },
    ])
    const [inputText, setInputText] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = () => {
        if (!inputText.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        }

        setMessages([...messages, newMessage])
        setInputText('')

        // Simulate response after 1 second
        setTimeout(() => {
            const response: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Got it! Thanks.',
                sender: 'driver',
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, response])
        }, 1000)
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    const serviceColors = {
        ride: 'primary',
        delivery: '[#ff9500]',
        shop: '[#3b82f6]',
    }

    const bgColor = serviceType === 'delivery' ? 'bg-[#ff9500]' : serviceType === 'shop' ? 'bg-[#3b82f6]' : 'bg-primary'
    const borderColor = serviceType === 'delivery' ? 'border-[#ff9500]' : serviceType === 'shop' ? 'border-[#3b82f6]' : 'border-primary'

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen relative">
            {/* Header */}
            <header className={`${bgColor} px-6 py-4 flex items-center justify-between z-20`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="size-10 flex items-center justify-center active:scale-90 transition-transform duration-200"
                        aria-label="Back"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {contactAvatar ? (
                        <div className="size-10 rounded-full overflow-hidden border-2 border-white">
                            <img src={contactAvatar} alt={contactName} className="h-full w-full object-cover" />
                        </div>
                    ) : (
                        <div className={`size-10 rounded-full ${bgColor} border-2 border-white flex items-center justify-center`}>
                            <span className="text-lg text-white font-bold">{contactName[0]}</span>
                        </div>
                    )}
                    <div>
                        <p className="text-base font-bold text-white">{contactName}</p>
                        <p className="text-xs text-white/80">Online</p>
                    </div>
                </div>
                <button
                    onClick={() => onNavigate?.('call')}
                    className="size-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all duration-200"
                    aria-label="Call"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </button>
            </header>

            {/* Messages Area */}
            <section className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                                message.sender === 'user'
                                    ? `${bgColor} text-white`
                                    : 'bg-white text-text-dark shadow-sm'
                            }`}>
                                <p className="text-base font-normal">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </section>

            {/* Input Area */}
            <footer className="bg-white px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <button
                        className="size-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all duration-200"
                        aria-label="Attach"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base focus:outline-none focus:border-primary"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className={`size-10 rounded-full ${bgColor} flex items-center justify-center shadow-lg hover:opacity-90 active:scale-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label="Send"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </footer>
        </div>
    )
}

