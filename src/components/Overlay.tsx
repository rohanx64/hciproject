interface OverlayProps {
    children: React.ReactNode
}

export function Overlay({ children }: OverlayProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
            {children}
        </div>
    )
}
