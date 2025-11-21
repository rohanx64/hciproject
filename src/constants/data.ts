import type { Location, NavItem, BreakdownItem, QuickBookData, DeliveryTypeOption, ShopCategory, Shop } from '../types'

export const favoritePlaces = ['University Of Karachi', 'Hill Park', 'National Stadium']

export const navItems: NavItem[] = [
    { label: 'Ride', icon: '🏍️' },
    { label: 'Delivery', icon: '📦' },
    { label: 'Shops', icon: '🛍️' },
    { label: 'Rentals', icon: '🚗' },
]

export const deliveryTypes: DeliveryTypeOption[] = [
    { type: 'bike', icon: '🏍️', label: 'Bike' },
    { type: 'package', icon: '📦', label: 'Package' },
    { type: 'restaurant', icon: '🍽️', label: 'Restaurant' },
    { type: 'groceries', icon: '🛒', label: 'Groceries' },
]

export const recentLocations: Location[] = [
    { label: 'University Of Karachi', favorite: false },
    { label: 'Hill Park', favorite: true },
    { label: 'National Stadium', favorite: false },
    { label: 'Nishtar Park', favorite: false },
    { label: 'Karachi Art Gallery', favorite: false },
    { label: 'Jinnah Airport', favorite: false },
]

export const breakdownItems: BreakdownItem[] = [
    { label: 'Distance', value: '11 km' },
    { label: 'Base Fare', value: 'Rs. 450' },
    { label: 'Ride Service', value: 'Rs. 300' },
    { label: 'Peak Factor', value: '1.1x' },
    { label: 'Total', value: 'Rs. 900' },
]

export const deliveryBreakdownItems: BreakdownItem[] = [
    { label: 'Distance', value: '1 KM' },
    { label: 'Base Fare', value: 'Rs. 60' },
    { label: 'Bike Service', value: 'Rs. 90' },
    { label: 'Platform', value: '1 %' },
]

export const shopsBreakdownItems: BreakdownItem[] = [
    { label: 'Distance', value: '2 KM' },
    { label: 'Base Fare', value: 'Rs. 80' },
    { label: 'Delivery Service', value: 'Rs. 100' },
    { label: 'Platform Fee', value: 'Rs. 20' },
]

export const quickBook: QuickBookData = {
    pickupLabel: 'Pickup',
    pickupAddress: 'My current location',
    dropoffLabel: 'Drop-off',
    dropoffAddress: '420 University Road, Karachi, PK',
    price: '330 Rs.',
}

// Shop categories
export const shopCategories: ShopCategory[] = [
    { id: 'food', label: 'Food', icon: '🍽️', color: '#ef4444' },
    { id: 'pharmacy', label: 'Pharmacy', icon: '💊', color: '#f97316' },
    { id: 'grocery', label: 'Grocery', icon: '🛒', color: '#3b82f6' },
    { id: 'bakery', label: 'Bakery', icon: '🍰', color: '#92400e' },
    { id: 'cafe', label: 'Cafe', icon: '☕', color: '#dc2626' },
]

// Shop listings
export const shops: Shop[] = [
    { id: '1', name: 'PG Canteen Karachi University', category: 'food', icon: '🍽️' },
    { id: '2', name: 'Qasim Samosa Shop', category: 'food', icon: '🍽️' },
    { id: '3', name: 'MedPlus Pharmacy', category: 'pharmacy', icon: '💊' },
    { id: '4', name: 'Al-Karam Grocery Store', category: 'grocery', icon: '🛒' },
    { id: '5', name: 'Sweet Dreams Bakery', category: 'bakery', icon: '🍰' },
    { id: '6', name: 'Coffee House', category: 'cafe', icon: '☕' },
    { id: '7', name: 'Burger Point', category: 'food', icon: '🍽️' },
    { id: '8', name: 'City Pharmacy', category: 'pharmacy', icon: '💊' },
]
