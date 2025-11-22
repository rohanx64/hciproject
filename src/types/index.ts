export type Screen =
    | 'splash'
    | 'login'
    | 'signup'
    | 'otpVerification'
    | 'onboarding'
    | 'onboardingTutorial'
    | 'home'
    | 'dropoff'
    | 'ridePickupSelect'
    | 'selectVehicle'
    | 'rideExtended'
    | 'searchingRides'
    | 'rideConfirmed'
    | 'rideStarted'
    | 'rideCompleted'
    | 'deliveryHome'
    | 'deliveryPickupSelect'
    | 'deliveryForm'
    | 'deliveryMap'
    | 'deliveryFare'
    | 'deliverySuccess'
    | 'deliveryConfirmed'
    | 'deliveryInProgress'
    | 'deliveryCompleted'
    | 'rentalsHome'
    | 'rentalsPickupSelect'
    | 'rentalsConfirm'
    | 'rentalsStarted'
    | 'rentalsCompleted'
    | 'shopsHome'
    | 'shopsLocationSelect'
    | 'shopOrder'
    | 'shopOrderConfirmed'
    | 'shopOrderInProgress'
    | 'shopOrderCompleted'
    | 'sos'
    | 'message'
    | 'call'
    | 'history'
    | 'settings'
    | 'myAccount'
    | 'wallet'
    | 'notifications'
    | 'callBykea'
    | 'helpSupport'
    | 'voiceFeedback'
    | 'notificationsSettings'
    | 'changeSizeSettings'
    | 'languageSettings'
    | 'changeThemeSettings'
    | 'termsPrivacy'
    | 'contactUs'

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
