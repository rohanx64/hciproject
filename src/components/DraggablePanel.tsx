import { useState, useRef, useEffect } from 'react'

interface DraggablePanelProps {
    children: React.ReactNode
    initialHeight?: number // Percentage of screen height (0-100)
    minHeight?: number // Minimum height percentage
    maxHeight?: number // Maximum height percentage
    onHeightChange?: (height: number) => void
    hideBottomNav?: boolean // If true, panel extends to bottom (no bottom nav space)
}

export function DraggablePanel({
    children,
    initialHeight = 40,
    minHeight = 20,
    maxHeight = 90,
    onHeightChange,
    hideBottomNav = false,
}: DraggablePanelProps) {
    const [height, setHeight] = useState(initialHeight)
    const [isDragging, setIsDragging] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)
    const startYRef = useRef(0)
    const startHeightRef = useRef(initialHeight)

    // Update height when initialHeight prop changes
    useEffect(() => {
        setHeight(initialHeight)
        startHeightRef.current = initialHeight
    }, [initialHeight])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !panelRef.current) return

            const container = panelRef.current.parentElement
            if (!container) return

            const containerHeight = container.clientHeight
            const deltaY = startYRef.current - e.clientY // Inverted: dragging up increases height
            const deltaPercent = (deltaY / containerHeight) * 100
            const newHeight = Math.max(
                minHeight,
                Math.min(maxHeight, startHeightRef.current + deltaPercent)
            )

            setHeight(newHeight)
            onHeightChange?.(newHeight)
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = 'grabbing'
            document.body.style.userSelect = 'none'
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }
    }, [isDragging, minHeight, maxHeight, onHeightChange])

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        startYRef.current = e.clientY
        startHeightRef.current = height
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true)
        startYRef.current = e.touches[0].clientY
        startHeightRef.current = height
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !panelRef.current) return

        const container = panelRef.current.parentElement
        if (!container) return

        const containerHeight = container.clientHeight
        const deltaY = startYRef.current - e.touches[0].clientY
        const deltaPercent = (deltaY / containerHeight) * 100
        const newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeightRef.current + deltaPercent)
        )

        setHeight(newHeight)
        onHeightChange?.(newHeight)
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
    }

    return (
        <div
            ref={panelRef}
            className="absolute left-0 right-0 bg-white rounded-t-[18px] transition-all duration-300 ease-out z-[500]"
            style={{
                height: hideBottomNav ? `${height}%` : `calc(${height}% - 88px)`, // Account for bottom nav height (88px) if visible
                bottom: hideBottomNav ? '0' : '88px', // Position at bottom if nav hidden, above nav if visible
                touchAction: 'none',
            }}
        >
            {/* Drag Handle */}
            <div
                className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />

            {/* Content */}
            <div className="h-full overflow-y-auto pt-6 pb-4 scrollbar-hide">
                {children}
            </div>
        </div>
    )
}

