export type Screen = 'home' | 'dropoff' | 'selectVehicle' | 'rideExtended' | 'searchingRides'

export type PaymentMethod = 'cash' | 'digital'

export interface Location {
    label: string
    favorite: boolean
}

export interface NavItem {
    label: string
    icon: string
}

export interface BreakdownItem {
    label: string
    value: string
}

export interface QuickBookData {
    pickupLabel: string
    pickupAddress: string
    dropoffLabel: string
    dropoffAddress: string
    price: string
}
