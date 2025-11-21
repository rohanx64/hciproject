export type Screen =
    | 'home'
    | 'dropoff'
    | 'selectVehicle'
    | 'rideExtended'
    | 'searchingRides'
    | 'rideConfirmed'
    | 'rideStarted'
    | 'deliveryHome'
    | 'deliveryPickupSelect'
    | 'deliveryForm'
    | 'deliveryMap'
    | 'deliveryFare'
    | 'deliverySuccess'
    | 'deliveryConfirmed'
    | 'deliveryInProgress'
    | 'rentalsHome'
    | 'rentalsPickupSelect'
    | 'rentalsConfirm'
    | 'shopsHome'
    | 'shopsLocationSelect'
    | 'shopOrder'
    | 'shopOrderConfirmed'
    | 'shopOrderInProgress'
    | 'sos'
    | 'message'
    | 'call'

export type PaymentMethod = 'cash' | 'digital'

export type DeliveryType = 'bike' | 'package' | 'restaurant' | 'groceries'

export type PaymentOption = 'half-pay' | 'receiver-will-pay'

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

export interface DeliveryData {
    pickupLocation: string
    deliveryLocation: string
    parcelDetails: string
    deliveryType: DeliveryType
    paymentOption: PaymentOption
    fare: number
}

export interface DeliveryTypeOption {
    type: DeliveryType
    icon: string
    label: string
}

export interface ShopCategory {
    id: string
    label: string
    icon: string
    color: string
}

export interface Shop {
    id: string
    name: string
    category: string
    icon: string
}
