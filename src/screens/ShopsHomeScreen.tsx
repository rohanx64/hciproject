import { useState, useEffect } from 'react'
import { assets } from '../constants/assets'
import { shopCategories, shops } from '../constants/data'
import { BottomNav } from '../components/BottomNav'
import { RideMap } from '../components/RideMap'
import { DraggablePanel } from '../components/DraggablePanel'

interface ShopsHomeScreenProps {
    onNavigate?: (screen: string) => void
    onSelectShop: (shopId: string) => void
    location: string
    onOpenLocationSelect: () => void
}

export function ShopsHomeScreen({
    onNavigate,
    onSelectShop,
    location,
    onOpenLocationSelect,
}: ShopsHomeScreenProps) {
    const [panelHeight, setPanelHeight] = useState(42) // Standardized height for all screens
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null) // Start with no category selected

    // Filter shops based on category and search
    const filteredShops = shops.filter(shop => {
        if (!selectedCategory) return false // Don't show shops until category is selected
        const matchesCategory = shop.category === selectedCategory
        const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && (searchQuery === '' || matchesSearch)
    })

    // Auto-expand panel when category is selected
    useEffect(() => {
        if (selectedCategory) {
            // Smoothly expand to show shops
            setTimeout(() => setPanelHeight(70), 300)
        } else {
            // Reset to initial height when category is deselected
            setPanelHeight(42)
        }
    }, [selectedCategory])

    const handleCategorySelect = (categoryId: string) => {
        if (selectedCategory === categoryId) {
            // If clicking the same category, deselect it
            setSelectedCategory(null)
        } else {
            // Select new category
            setSelectedCategory(categoryId)
        }
    }

    return (
        <div className="mx-auto flex w-[440px] max-w-full flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl md:scale-90 h-screen relative">
            {/* Map Section - Full height, panel overlays */}
            <section className="absolute inset-0 overflow-hidden">
                <RideMap
                    pickupLocation={[24.8607, 67.0011]}
                    className="h-full w-full"
                />

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Profile Avatar - Blue gradient */}
                <button
                    className="absolute left-[4.26%] top-[7.64%] size-[58px] overflow-hidden rounded-[30px] border-2 border-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 z-20"
                    aria-label="Profile"
                    onClick={() => onNavigate?.('Settings')}
                >
                    <div className="h-full w-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">U</span>
                    </div>
                </button>

                {/* Add Button - Blue circle with plus */}
                <button
                    className="absolute right-[6.13%] top-[6.38%] size-[52px] rounded-full bg-[#3b82f6] shadow-lg flex items-center justify-center z-20 hover:bg-[#2563eb] active:scale-90 transition-all duration-200"
                    aria-label="Add shop"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                </button>

                {/* Location Bar - At top */}
                <button
                    onClick={onOpenLocationSelect}
                    className="absolute left-[14.3%] top-[7.74%] right-[14.3%] z-20 active:scale-95 transition-transform duration-200"
                >
                    <div className="rounded-3xl border-2 border-[#c8f0c0] bg-white/95 px-4 py-3 shadow-lg flex items-center gap-3">
                        <div className="flex-1 text-left">
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#c8c7cc] mb-1">Shops near:</p>
                            <p className="text-base font-normal text-text-dark truncate">{location}</p>
                        </div>
                        <svg className="w-5 h-5 text-[#3b82f6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                </button>
            </section>

            {/* Draggable Bottom Panel - Standardized initial, expands when category selected */}
            <DraggablePanel
                initialHeight={selectedCategory ? 70 : 42}
                minHeight={20}
                maxHeight={85}
                onHeightChange={setPanelHeight}
                hideBottomNav={selectedCategory !== null}
            >
                <div className="px-6 pb-6">
                    {/* Shops Title - Blue */}
                    <h1 className="font-display text-[42px] font-normal text-[#3b82f6] text-center mb-5 mt-6">
                        Shops
                    </h1>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3 rounded-2xl border-2 border-[#c8f0c0] bg-white px-4 py-3 shadow-sm focus-within:border-[#3b82f6] focus-within:shadow-md transition-all duration-200">
                            <img src={assets.searchIcon} alt="Search" className="h-5 w-5 opacity-60" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search any store or market in your city"
                                className="flex-1 border-none bg-transparent text-base font-normal text-text-dark placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Category Icons */}
                    <div className="mb-4">
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
                            {shopCategories.map((category) => {
                                const isActive = selectedCategory === category.id
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category.id)}
                                        className={`flex flex-col items-center gap-2 min-w-[70px] transition-all duration-200 ${
                                            isActive ? 'scale-105' : 'hover:scale-102 active:scale-95'
                                        }`}
                                    >
                                        <div
                                            className={`size-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-opacity-20 shadow-md border-2'
                                                    : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                            style={{
                                                backgroundColor: isActive ? `${category.color}20` : undefined,
                                                borderColor: isActive ? category.color : 'transparent',
                                            }}
                                        >
                                            {category.icon}
                                        </div>
                                        <span
                                            className={`text-xs font-semibold transition-colors duration-200 ${
                                                isActive ? 'text-text-dark' : 'text-gray-500'
                                            }`}
                                        >
                                            {category.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Shop Listings - Only show when category is selected */}
                    {selectedCategory && (
                        <div className="space-y-3">
                            {filteredShops.length > 0 ? (
                                filteredShops.map((shop) => {
                                    const category = shopCategories.find(cat => cat.id === shop.category)
                                    return (
                                        <button
                                            key={shop.id}
                                            onClick={() => onSelectShop(shop.id)}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#c8f0c0] bg-white hover:border-[#3b82f6] hover:shadow-md transition-all duration-200 active:scale-98 text-left"
                                        >
                                            <div
                                                className="size-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                                style={{
                                                    backgroundColor: category ? `${category.color}20` : '#f3f4f6',
                                                }}
                                            >
                                                {shop.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-semibold text-text-dark truncate">{shop.name}</p>
                                                <p className="text-sm font-normal text-gray-500 mt-1">{category?.label}</p>
                                            </div>
                                            <img src={assets.chevronIcon} alt="" className="h-5 w-5 opacity-50 flex-shrink-0" />
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-base">No shops found</p>
                                    <p className="text-gray-400 text-sm mt-2">Try a different search or category</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DraggablePanel>

            {/* Bottom Navigation - Hide when category is selected */}
            {!selectedCategory && (
                <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white transition-opacity duration-300">
                    <BottomNav active="Shops" onNavigate={onNavigate} />
                </div>
            )}
        </div>
    )
}
