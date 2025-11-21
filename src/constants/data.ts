import { assets } from './assets'
import type { Location, NavItem, BreakdownItem, QuickBookData } from '../types'

export const favoritePlaces = ['University Of Karachi', 'Hill Park', 'National Stadium']

export const navItems: NavItem[] = [
    { label: 'Ride', icon: assets.motoIcon },
    { label: 'Delivery', icon: assets.deliveryIcon },
    { label: 'Shops', icon: assets.shopsIcon },
    { label: 'Rentals', icon: assets.rentalsIcon },
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

export const quickBook: QuickBookData = {
    pickupLabel: 'Pickup',
    pickupAddress: 'My current location',
    dropoffLabel: 'Drop-off',
    dropoffAddress: '420 University Road, Karachi, PK',
    price: '330 Rs.',
}
