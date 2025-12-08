import { useState, useRef, useEffect } from 'react'

interface DraggablePanelProps {
    children: React.ReactNode
    initialHeight?: number // Percentage of screen height (0-100)
    minHeight?: number // Minimum height percentage
    maxHeight?: number // Maximum height percentage
    onHeightChange?: (height: number) => void
    hideBottomNav?: boolean // If true, panel extends to bottom (no bottom nav space)
}

// Bottom navigation bar height in pixels
// Calculated: py-6 (24px top + 24px bottom) + button p-3 (12px top + 12px bottom) + icon size-14 (56px) + gap-2 (8px) + text (~14px)
// Total: 24 + 12 + 56 + 8 + 14 + 12 + 24 = 150px, but using 110px as safe estimate for better visibility
const BOTTOM_NAV_HEIGHT = 110

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
    const [containerHeight, setContainerHeight] = useState(844) // Default to iPhone height
    const panelRef = useRef<HTMLDivElement>(null)
    const startYRef = useRef(0)
    const startHeightRef = useRef(initialHeight)

    // Measure container height
    useEffect(() => {
        const measureContainer = () => {
            // Use viewport height for fixed positioning
            setContainerHeight(window.innerHeight)
        }
        measureContainer()
        window.addEventListener('resize', measureContainer)
        return () => window.removeEventListener('resize', measureContainer)
    }, [])

    // Update height when initialHeight prop changes
    useEffect(() => {
        setHeight(initialHeight)
        startHeightRef.current = initialHeight
    }, [initialHeight])

    // Calculate actual pixel height from percentage
    const getPixelHeight = (percent: number, containerHeight: number): number => {
        if (hideBottomNav) {
            return (containerHeight * percent) / 100
        }
        // Calculate based on available space (container - bottom nav)
        const availableHeight = containerHeight - BOTTOM_NAV_HEIGHT
        return (availableHeight * percent) / 100
    }

    // Calculate percentage from pixel height (currently unused but kept for future use)
    // const getPercentFromPixels = (pixels: number, containerHeight: number): number => {
    //     if (hideBottomNav) {
    //         return (pixels / containerHeight) * 100
    //     }
    //     const availableHeight = containerHeight - BOTTOM_NAV_HEIGHT
    //     return (pixels / availableHeight) * 100
    // }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !panelRef.current) return

            const currentContainerHeight = containerHeight
            const deltaY = startYRef.current - e.clientY // Inverted: dragging up increases height

            // Calculate delta as percentage of available space
            const availableHeight = hideBottomNav ? currentContainerHeight : currentContainerHeight - BOTTOM_NAV_HEIGHT
            const deltaPercent = (deltaY / availableHeight) * 100

            const newHeight = Math.max(
                minHeight,
                Math.min(maxHeight, startHeightRef.current + deltaPercent)
            )

            setHeight(newHeight)
            onHeightChange?.(newHeight)
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            // Snap to nearest state
            const midpoint = (minHeight + maxHeight) / 2
            const targetHeight = height > midpoint ? maxHeight : minHeight
            setHeight(targetHeight)
            onHeightChange?.(targetHeight)
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
    }, [isDragging, minHeight, maxHeight, onHeightChange, hideBottomNav, containerHeight, height])

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

        const currentContainerHeight = containerHeight
        const deltaY = startYRef.current - e.touches[0].clientY

        // Calculate delta as percentage of available space
        const availableHeight = hideBottomNav ? currentContainerHeight : currentContainerHeight - BOTTOM_NAV_HEIGHT
        const deltaPercent = (deltaY / availableHeight) * 100

        const newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeightRef.current + deltaPercent)
        )

        setHeight(newHeight)
        onHeightChange?.(newHeight)
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
        // Snap to nearest state
        const midpoint = (minHeight + maxHeight) / 2
        const targetHeight = height > midpoint ? maxHeight : minHeight
        setHeight(targetHeight)
        onHeightChange?.(targetHeight)
    }

    // Calculate actual pixel values for styling
    const getStyleHeight = (): string => {
        const pixelHeight = getPixelHeight(height, containerHeight)
        return `${pixelHeight}px`
    }

    return (
        <div
            ref={panelRef}
            className="fixed left-0 right-0 bg-white dark:bg-[rgb(var(--color-surface))] rounded-t-[28px] backdrop-blur-xl border-t border-gray-100/50 dark:border-gray-700/50 z-[400]"
            style={{
                height: getStyleHeight(),
                bottom: hideBottomNav ? '0' : `${BOTTOM_NAV_HEIGHT}px`,
                touchAction: 'none',
                transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: isDragging ? 'height' : 'auto',
            }}
        >
            {/* Top decorative gradient line - More subtle */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {/* Drag Handle - Enhanced with better feedback */}
            <div
                className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full cursor-grab active:cursor-grabbing transition-all duration-200 hover:from-gray-300 hover:via-gray-400 hover:to-gray-300 dark:hover:from-gray-500 dark:hover:via-gray-400 dark:hover:to-gray-500 hover:w-24 hover:shadow-md active:scale-95"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Subtle shine effect - More refined */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/8 to-transparent" />
            </div>

            {/* Content */}
            <div className="h-full overflow-y-auto pt-6 scrollbar-hide" style={{
                paddingBottom: hideBottomNav ? '24px' : `${BOTTOM_NAV_HEIGHT + 16}px`
            }}>
                {children}
            </div>
        </div>
    )
}

