import { useState } from 'react'
import {
  HomeRideScreen,
  DropoffSelectScreen,
  SelectVehicleScreen,
  RideExtendedScreen,
  SearchingRidesScreen,
  RideConfirmedScreen,
  RideStartedScreen,
  DeliveryHomeScreen,
  DeliveryPickupSelectScreen,
  DeliveryFormScreen,
  DeliveryMapScreen,
  DeliveryFareScreen,
  DeliverySuccessScreen,
  DeliveryConfirmedScreen,
  DeliveryInProgressScreen,
  RentalsHomeScreen,
  RentalsPickupSelectScreen,
  RentalsConfirmScreen,
  ShopsHomeScreen,
  ShopsLocationSelectScreen,
  ShopOrderScreen,
  ShopOrderConfirmedScreen,
  SOSScreen,
  MessageScreen,
  CallScreen,
} from './screens'
import { QuickBookModal, CancelDialog, FareDialog, PaymentMethodsModal, FareBreakdownModal, RideOffersModal } from './components/modals'
import { Overlay } from './components/Overlay'
import { recentLocations, breakdownItems, deliveryBreakdownItems, shopsBreakdownItems, shops } from './constants/data'
import type { Screen, PaymentMethod, DeliveryType, PaymentOption } from './types'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [isQuickBookOpen, setQuickBookOpen] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showFareDialog, setShowFareDialog] = useState(false)
  const [fare, setFare] = useState(900)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [dropoffLabel, setDropoffLabel] = useState('Where to?')
  const [showRideOffers, setShowRideOffers] = useState(false)

  // Delivery state
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('bike')
  const [deliveryPickup, setDeliveryPickup] = useState('My current location')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [parcelDetails, setParcelDetails] = useState('')
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('half-pay')
  const [deliveryFare] = useState(180)
  const [deliveryLocationCoords, setDeliveryLocationCoords] = useState<[number, number] | null>(null)

  // Rentals state
  const [rentalsPickup, setRentalsPickup] = useState('My current location')
  const [rentalsHours, setRentalsHours] = useState(2)
  const [rentalsVehicle, setRentalsVehicle] = useState('Bike')
  const [rentalsFare] = useState(900)

  // Shops state
  const [shopsLocation, setShopsLocation] = useState('75270 KU Circular Rd University Of')
  const [selectedShop, setSelectedShop] = useState<{ id: string; name: string; category: string } | null>(null)
  const [shopsFare, setShopsFare] = useState(180)
  const [shopsPaymentMethod, setShopsPaymentMethod] = useState<PaymentMethod>('cash')
  const [shopsPurchaseValue, setShopsPurchaseValue] = useState(1500)

  // Previous screen for back navigation from SOS/Message/Call
  const [previousScreen, setPreviousScreen] = useState<Screen>('rideStarted')
  const [currentContact, setCurrentContact] = useState<{ name: string; avatar: string; phone?: string; serviceType?: 'ride' | 'delivery' | 'shop' }>({
    name: 'Driver',
    avatar: '',
    serviceType: 'ride',
  })

  // Driver/Rider data (mock)
  const mockDriver = {
    name: 'Ghulam Shabir',
    rating: 5,
    avatar: 'http://localhost:3845/assets/9f7bed72ad54a59b5b7b5fffbd65db756c18d88d.png',
    phone: '+92 300 1234567',
  }
  const mockRider = {
    name: 'Ahmed Ali',
    rating: 5,
    avatar: 'http://localhost:3845/assets/9f7bed72ad54a59b5b7b5fffbd65db756c18d88d.png',
    phone: '+92 300 7654321',
  }

  const openDropoff = () => setScreen('dropoff')

  const handleQuickBookConfirm = () => {
    setQuickBookOpen(false)
    setShowFareDialog(true)
  }

  // Handle bottom navigation
  const handleNavigate = (navLabel: string) => {
    if (navLabel === 'Ride') {
      setScreen('home')
    } else if (navLabel === 'Delivery') {
      setScreen('deliveryHome')
    } else if (navLabel === 'Rentals') {
      // Reset rentals state to initial when navigating to Rentals
      setRentalsPickup('My current location')
      setScreen('rentalsHome')
    } else if (navLabel === 'Shops') {
      setScreen('shopsHome')
    }
  }

  const renderScreen = () => {
    // Ride screens
    if (screen === 'home') {
      return (
        <HomeRideScreen
          onOpenQuickBook={() => setQuickBookOpen(true)}
          onOpenDropoff={openDropoff}
          dropoffLabel={dropoffLabel}
          onNavigate={handleNavigate}
        />
      )
    }

    if (screen === 'dropoff') {
      return (
        <DropoffSelectScreen
          onCancel={() => setScreen('home')}
          onApply={(value) => {
            if (value.trim()) {
              setDropoffLabel(value.trim())
            }
            setScreen('selectVehicle')
          }}
        />
      )
    }

    if (screen === 'selectVehicle') {
      return (
        <SelectVehicleScreen
          onCancel={() => setScreen('dropoff')}
          onConfirm={() => setScreen('searchingRides')}
          dropoffLabel={dropoffLabel}
          onOpenFareDialog={() => setShowFareDialog(true)}
          onOpenPaymentModal={() => setShowPaymentModal(true)}
          fare={fare}
          paymentMethod={paymentMethod}
        />
      )
    }

    if (screen === 'searchingRides') {
      return (
        <SearchingRidesScreen
          dropoffLabel={dropoffLabel}
          onRidesFound={() => setShowRideOffers(true)}
        />
      )
    }

    if (screen === 'rideExtended') {
      return (
        <RideExtendedScreen
          dropoffLabel={dropoffLabel}
          onEditDropoff={openDropoff}
          recentLocations={recentLocations}
          onNavigate={handleNavigate}
        />
      )
    }

    if (screen === 'rideConfirmed') {
      return (
        <RideConfirmedScreen
          onNavigate={handleNavigate}
          onRideStarted={() => setScreen('rideStarted')}
          onCancel={() => setScreen('home')}
          driverName={mockDriver.name}
          driverRating={mockDriver.rating}
          driverAvatar={mockDriver.avatar}
          pickupLocation="Karachi University"
          dropoffLocation={dropoffLabel}
          distance="0.2 km"
          time="2 min"
          price={fare}
          vehicleType="Bike"
          onCallDriver={() => {
            setPreviousScreen('rideConfirmed')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'ride' })
            setScreen('call')
          }}
          onChatDriver={() => {
            setPreviousScreen('rideConfirmed')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'ride' })
            setScreen('message')
          }}
        />
      )
    }

    if (screen === 'rideStarted') {
      return (
        <RideStartedScreen
          onNavigate={handleNavigate}
          driverName={mockDriver.name}
          driverRating={mockDriver.rating}
          driverAvatar={mockDriver.avatar}
          pickupLocation="Karachi University"
          dropoffLocation={dropoffLabel}
          price={fare}
          onCallDriver={() => {
            setPreviousScreen('rideStarted')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'ride' })
            setScreen('call')
          }}
          onChatDriver={() => {
            setPreviousScreen('rideStarted')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'ride' })
            setScreen('message')
          }}
          onSOS={() => {
            setPreviousScreen('rideStarted')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'ride' })
            setScreen('sos')
          }}
        />
      )
    }

    // Delivery screens
    if (screen === 'deliveryHome') {
      return (
        <DeliveryHomeScreen
          onNavigate={handleNavigate}
          onProceedToForm={() => setScreen('deliveryForm')}
          onSelectLocation={(location) => {
            setDeliveryLocation(location)
            setScreen('deliveryForm')
          }}
          selectedType={deliveryType}
          onSelectType={setDeliveryType}
          pickupLocation={deliveryPickup}
          onChangePickup={setDeliveryPickup}
          onOpenPickupSelect={() => setScreen('deliveryPickupSelect')}
        />
      )
    }

    if (screen === 'deliveryPickupSelect') {
      return (
        <DeliveryPickupSelectScreen
          onCancel={() => setScreen('deliveryHome')}
          onApply={(value) => {
            setDeliveryPickup(value)
            setScreen('deliveryHome')
          }}
          currentLocation={deliveryPickup}
        />
      )
    }

    if (screen === 'deliveryForm') {
      return (
        <DeliveryFormScreen
          pickupLocation={deliveryPickup}
          deliveryLocation={deliveryLocation}
          parcelDetails={parcelDetails}
          paymentOption={paymentOption}
          onChangePickup={setDeliveryPickup}
          onChangeDelivery={setDeliveryLocation}
          onChangeParcel={setParcelDetails}
          onChangePayment={setPaymentOption}
          onCancel={() => setScreen('deliveryHome')}
          onApply={() => setScreen('deliveryFare')}
          onOpenMap={() => setScreen('deliveryMap')}
        />
      )
    }

    if (screen === 'deliveryMap') {
      return (
        <DeliveryMapScreen
          pickupLocation={[24.8607, 67.0011]}
          deliveryLocation={deliveryLocationCoords || [24.8707, 67.0211]}
          onCancel={() => setScreen('deliveryForm')}
          onApply={(coords) => {
            if (coords) {
              setDeliveryLocationCoords(coords)
              setDeliveryLocation(`${coords[0]}, ${coords[1]}`) // In real app, reverse geocode this
            }
            setScreen('deliveryForm')
          }}
        />
      )
    }

    if (screen === 'deliveryFare') {
      return (
        <DeliveryFareScreen
          fare={deliveryFare}
          breakdownItems={deliveryBreakdownItems}
          pickupLocation={[24.8607, 67.0011]}
          deliveryLocation={[24.8707, 67.0211]}
          onCancel={() => setScreen('deliveryForm')}
          onConfirm={() => setScreen('deliverySuccess')}
        />
      )
    }

    if (screen === 'deliverySuccess') {
      return (
        <DeliverySuccessScreen
          onDone={() => setScreen('deliveryConfirmed')}
          onNavigate={handleNavigate}
        />
      )
    }

    if (screen === 'deliveryConfirmed') {
      return (
        <DeliveryConfirmedScreen
          onNavigate={handleNavigate}
          onDeliveryStarted={() => setScreen('deliveryInProgress')}
          onCancel={() => setScreen('deliveryHome')}
          riderName={mockRider.name}
          riderRating={mockRider.rating}
          riderAvatar={mockRider.avatar}
          pickupLocation={deliveryPickup}
          deliveryLocation={deliveryLocation || 'Where to?'}
          distance="1 km"
          time="5 min"
          price={deliveryFare}
          vehicleType="Bike"
          onCallRider={() => {
            setPreviousScreen('deliveryConfirmed')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'delivery' })
            setScreen('call')
          }}
          onChatRider={() => {
            setPreviousScreen('deliveryConfirmed')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'delivery' })
            setScreen('message')
          }}
        />
      )
    }

    if (screen === 'deliveryInProgress') {
      return (
        <DeliveryInProgressScreen
          onNavigate={handleNavigate}
          riderName={mockRider.name}
          riderRating={mockRider.rating}
          riderAvatar={mockRider.avatar}
          pickupLocation={deliveryPickup}
          deliveryLocation={deliveryLocation || 'Where to?'}
          price={deliveryFare}
          onCallRider={() => {
            setPreviousScreen('deliveryInProgress')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'delivery' })
            setScreen('call')
          }}
          onChatRider={() => {
            setPreviousScreen('deliveryInProgress')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'delivery' })
            setScreen('message')
          }}
          onSOS={() => {
            setPreviousScreen('deliveryInProgress')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'delivery' })
            setScreen('sos')
          }}
        />
      )
    }

    // Rentals screens
    if (screen === 'rentalsHome') {
      return (
        <RentalsHomeScreen
          onNavigate={handleNavigate}
          onProceedToConfirm={(hours, vehicle) => {
            setRentalsHours(hours)
            setRentalsVehicle(vehicle)
            setScreen('rentalsConfirm')
          }}
          pickupLocation={rentalsPickup}
          onChangePickup={(location) => {
            setRentalsPickup(location)
          }}
          onOpenFareDialog={() => setShowFareDialog(true)}
          onOpenPaymentModal={() => setShowPaymentModal(true)}
          onOpenPickupSelect={() => setScreen('rentalsPickupSelect')}
        />
      )
    }

    if (screen === 'rentalsPickupSelect') {
      return (
        <RentalsPickupSelectScreen
          onCancel={() => setScreen('rentalsHome')}
          onApply={(value) => {
            // Always set a location value (even if "My current location", it means user confirmed it)
            // If user typed something, use that; otherwise use the value provided
            const locationToSet = value && value.trim() ? value.trim() : 'My current location'
            setRentalsPickup(locationToSet)
            setScreen('rentalsHome')
          }}
          currentLocation={rentalsPickup}
        />
      )
    }

    if (screen === 'rentalsConfirm') {
      return (
        <RentalsConfirmScreen
          onNavigate={handleNavigate}
          onDone={() => setScreen('rentalsHome')}
          pickupLocation={rentalsPickup}
          selectedHours={rentalsHours}
          selectedVehicle={rentalsVehicle}
          fare={rentalsFare}
        />
      )
    }

    // Shops screens
    if (screen === 'shopsHome') {
      return (
        <ShopsHomeScreen
          onNavigate={handleNavigate}
          onSelectShop={(shopId) => {
            const shop = shops.find(s => s.id === shopId)
            if (shop) {
              setSelectedShop(shop)
              setScreen('shopOrder')
            }
          }}
          location={shopsLocation}
          onOpenLocationSelect={() => setScreen('shopsLocationSelect')}
        />
      )
    }

    if (screen === 'shopsLocationSelect') {
      return (
        <ShopsLocationSelectScreen
          onCancel={() => setScreen('shopsHome')}
          onApply={(value) => {
            setShopsLocation(value)
            setScreen('shopsHome')
          }}
          currentLocation={shopsLocation}
        />
      )
    }

    if (screen === 'shopOrder') {
      if (!selectedShop) {
        setScreen('shopsHome')
        return null
      }
      return (
        <ShopOrderScreen
          onNavigate={handleNavigate}
          onConfirm={() => {
            setScreen('shopOrderConfirmed')
          }}
          shopName={selectedShop.name}
          shopCategory={selectedShop.category}
          deliveryLocation={shopsLocation}
          onEditLocation={() => setScreen('shopsLocationSelect')}
          onOpenFareDialog={() => setShowFareDialog(true)}
          onOpenFareBreakdown={() => {
            setShowFareDialog(false)
            setShowBreakdown(true)
          }}
          onOpenPaymentModal={() => setShowPaymentModal(true)}
          fare={shopsFare}
          breakdownItems={shopsBreakdownItems}
          paymentMethod={shopsPaymentMethod}
        />
      )
    }

    if (screen === 'shopOrderConfirmed') {
      if (!selectedShop) {
        setScreen('shopsHome')
        return null
      }
      return (
        <ShopOrderConfirmedScreen
          onNavigate={handleNavigate}
          onOrderStarted={() => setScreen('shopOrderInProgress')}
          onCancel={() => setScreen('shopsHome')}
          shopName={selectedShop.name}
          riderName={mockRider.name}
          riderRating={mockRider.rating}
          riderAvatar={mockRider.avatar}
          shopLocation={shopsLocation}
          deliveryLocation={shopsLocation}
          distance="2 km"
          time="10 min"
          price={shopsFare}
          purchaseValue={shopsPurchaseValue}
          onCallRider={() => {
            setPreviousScreen('shopOrderConfirmed')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'shop' })
            setScreen('call')
          }}
          onChatRider={() => {
            setPreviousScreen('shopOrderConfirmed')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'shop' })
            setScreen('message')
          }}
        />
      )
    }

    if (screen === 'shopOrderInProgress') {
      // Similar to DeliveryInProgressScreen but for shops
      return (
        <DeliveryInProgressScreen
          onNavigate={handleNavigate}
          riderName={mockRider.name}
          riderRating={mockRider.rating}
          riderAvatar={mockRider.avatar}
          pickupLocation={shopsLocation}
          deliveryLocation={shopsLocation}
          price={shopsFare}
          onCallRider={() => {
            setPreviousScreen('shopOrderInProgress')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'shop' })
            setScreen('call')
          }}
          onChatRider={() => {
            setPreviousScreen('shopOrderInProgress')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'shop' })
            setScreen('message')
          }}
          onSOS={() => {
            setPreviousScreen('shopOrderInProgress')
            setCurrentContact({ name: mockRider.name, avatar: mockRider.avatar, phone: mockRider.phone, serviceType: 'shop' })
            setScreen('sos')
          }}
        />
      )
    }

    // SOS Screen
    if (screen === 'sos') {
      return (
        <SOSScreen
          onNavigate={handleNavigate}
          onClose={() => setScreen(previousScreen)}
          contactName={currentContact.name}
          contactPhone={currentContact.phone}
          serviceType={currentContact.serviceType}
        />
      )
    }

    // Message Screen
    if (screen === 'message') {
      return (
        <MessageScreen
          onNavigate={handleNavigate}
          onClose={() => setScreen(previousScreen)}
          contactName={currentContact.name}
          contactAvatar={currentContact.avatar}
          serviceType={currentContact.serviceType}
        />
      )
    }

    // Call Screen
    if (screen === 'call') {
      return (
        <CallScreen
          onNavigate={handleNavigate}
          onClose={() => setScreen(previousScreen)}
          contactName={currentContact.name}
          contactAvatar={currentContact.avatar}
          contactPhone={currentContact.phone}
          serviceType={currentContact.serviceType}
        />
      )
    }

    // Default fallback
    return null
  }

  return (
    <main className="min-h-screen bg-zinc-100 py-8 text-text-dark">
      {renderScreen()}

      {isQuickBookOpen && (
        <QuickBookModal
          onConfirm={handleQuickBookConfirm}
          onCancel={() => setShowCancelConfirm(true)}
        />
      )}

      {showCancelConfirm && (
        <Overlay>
          <CancelDialog
            onConfirm={() => {
              setShowCancelConfirm(false)
              setQuickBookOpen(false)
            }}
            onDismiss={() => setShowCancelConfirm(false)}
          />
        </Overlay>
      )}

      {showFareDialog && (
        <Overlay>
          <FareDialog
            fare={screen === 'shopOrder' ? shopsFare : fare}
            onChangeFare={screen === 'shopOrder' ? setShopsFare : setFare}
            onConfirm={() => setShowFareDialog(false)}
            onViewBreakdown={() => {
              setShowFareDialog(false)
              setShowBreakdown(true)
            }}
            recommendedFare={screen === 'shopOrder' ? 200 : 250}
          />
        </Overlay>
      )}

      {showPaymentModal && (
        <Overlay>
          <PaymentMethodsModal
            selected={screen === 'shopOrder' ? shopsPaymentMethod : paymentMethod}
            onSelect={screen === 'shopOrder' ? setShopsPaymentMethod : setPaymentMethod}
            onConfirm={() => setShowPaymentModal(false)}
            onClose={() => setShowPaymentModal(false)}
          />
        </Overlay>
      )}

      {showBreakdown && (
        <Overlay>
          <FareBreakdownModal
            fare={screen === 'shopOrder' ? shopsFare : fare}
            items={screen === 'shopOrder' ? shopsBreakdownItems : breakdownItems}
            onConfirm={() => {
              setShowBreakdown(false)
              if (screen === 'shopOrder') {
                // Stay on shop order screen
              } else {
              setScreen('selectVehicle')
              }
            }}
            onClose={() => setShowBreakdown(false)}
          />
        </Overlay>
      )}

      {showRideOffers && (
        <RideOffersModal
          onSelectRide={(driverId) => {
            console.log('Selected driver:', driverId)
            setShowRideOffers(false)
            setScreen('rideConfirmed')
          }}
          onClose={() => {
            setShowRideOffers(false)
            setScreen('selectVehicle')
          }}
        />
      )}
    </main>
  )
}

export default App
