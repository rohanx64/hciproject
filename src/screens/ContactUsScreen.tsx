import { useState } from 'react'

interface ContactUsScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

export function ContactUsScreen({ onBack }: ContactUsScreenProps) {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = () => {
        // Handle form submission
        console.log('Contact form submitted:', { subject, message })
        alert('Thank you for contacting us! We will get back to you soon.')
        setSubject('')
        setMessage('')
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Header */}
            <header className="bg-primary px-6 py-4 flex items-center gap-4 z-10 relative">
                <button
                    onClick={onBack}
                    className="text-white hover:opacity-80 transition-opacity"
                    aria-label="Back"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white">Contact us</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white px-6 py-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-text-dark mb-2">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="What can we help you with?"
                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-dark mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Please describe your issue or question..."
                            rows={8}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!subject.trim() || !message.trim()}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-semibold text-base hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send Message
                    </button>

                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-base font-semibold text-text-dark mb-3">Other Ways to Reach Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📧</span>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-base text-text-dark">support@bykea.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📞</span>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-base text-text-dark">+92 300 123 4567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

