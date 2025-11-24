interface TermsPrivacyScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    hideBottomNav?: boolean
}

export function TermsPrivacyScreen({ onNavigate, onBack, hideBottomNav = true }: TermsPrivacyScreenProps) {
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
                <h1 className="text-xl font-bold text-white">Terms & Privacy Policy</h1>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white px-6 py-6">
                <div className="space-y-6 text-text-dark">
                    <section>
                        <h2 className="text-lg font-bold mb-3">Terms of Service</h2>
                        <p className="text-base leading-relaxed text-gray-700 mb-4">
                            Welcome to Bykea. By using our services, you agree to be bound by these Terms of Service. 
                            Please read them carefully.
                        </p>
                        <p className="text-base leading-relaxed text-gray-700 mb-4">
                            Our platform connects riders with drivers for transportation services. By using our app, 
                            you acknowledge that you are at least 18 years old and have the legal capacity to enter 
                            into this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3">Privacy Policy</h2>
                        <p className="text-base leading-relaxed text-gray-700 mb-4">
                            We are committed to protecting your privacy. This Privacy Policy explains how we collect, 
                            use, and safeguard your personal information.
                        </p>
                        <p className="text-base leading-relaxed text-gray-700 mb-4">
                            We collect information you provide directly to us, such as when you create an account, 
                            request a ride, or contact us for support. We also automatically collect certain information 
                            about your device and how you interact with our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3">Data Security</h2>
                        <p className="text-base leading-relaxed text-gray-700 mb-4">
                            We implement appropriate technical and organizational measures to protect your personal 
                            information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3">Contact Us</h2>
                        <p className="text-base leading-relaxed text-gray-700">
                            If you have any questions about these Terms or our Privacy Policy, please contact us 
                            through the app or at support@bykea.com
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}

