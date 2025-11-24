import { useState, useEffect } from 'react'
import {
  SplashScreen,
  LoginScreen,
  SignupScreen,
  OTPVerificationScreen,
  OnboardingScreen,
  OnboardingTutorialScreen,
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
  DeliveryCompletedScreen,
  RentalsHomeScreen,
  RentalsPickupSelectScreen,
  RentalsConfirmScreen,
  RentalsStartedScreen,
  RentalsCompletedScreen,
  ShopsHomeScreen,
  ShopsLocationSelectScreen,
  ShopOrderScreen,
  ShopOrderConfirmedScreen,
  ShopOrderInProgressScreen,
  ShopOrderCompletedScreen,
  SOSScreen,
  MessageScreen,
  CallScreen,
  HistoryScreen,
  SettingsScreen,
  MyAccountScreen,
  NotificationsSettingsScreen,
  ChangeSizeSettingsScreen,
  LanguageSettingsScreen,
  ChangeThemeSettingsScreen,
  TermsPrivacyScreen,
  ContactUsScreen,
  HelpSupportScreen,
  CallBykeaScreen,
  VoiceFeedbackScreen,
  RideCompletedScreen,
} from './screens'
import { Sidebar } from './components/Sidebar'
import { QuickBookModal, CancelDialog, FareDialog, PaymentMethodsModal, FareBreakdownModal, RideOffersModal, VoiceActivationModal } from './components/modals'
import { Overlay } from './components/Overlay'
import { recentLocations, breakdownItems, deliveryBreakdownItems, shopsBreakdownItems, shops } from './constants/data'
import type { Screen, PaymentMethod, DeliveryType, PaymentOption } from './types'

import { useVoiceFeedback } from './contexts/VoiceFeedbackContext'

function App() {
  const { setVoiceFeedbackEnabled, speakAction, speakNavigation } = useVoiceFeedback()

  const [screen, setScreen] = useState<Screen>(() => {
    const savedAuth = localStorage.getItem('isAuthenticated')
    return savedAuth === 'true' ? 'home' : 'splash'
  })

  // Announce screen changes
  useEffect(() => {
    // Convert camelCase to readable text
    const readableScreen = screen.replace(/([A-Z])/g, ' $1').trim()
    speakNavigation(`Navigated to ${readableScreen}`)

    // Add specific instructions for certain screens
    if (screen === 'dropoff') {
      speakNavigation('Please enter your dropoff location')
    } else if (screen === 'ridePickupSelect' || screen === 'deliveryPickupSelect') {
      speakNavigation('Please confirm your pickup location')
    } else if (screen === 'selectVehicle') {
      speakNavigation('Please select a vehicle for your ride')
    } else if (screen === 'deliveryForm') {
      speakNavigation('Please fill in the delivery details')
    }
  }, [screen, speakNavigation])
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  // Handle logout
  const handleLogout = () => {
    speakAction('Logged out')
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    setScreen('login')
  }
  const [isQuickBookOpen, setQuickBookOpen] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showFareDialog, setShowFareDialog] = useState(false)
  const [showVoiceActivation, setShowVoiceActivation] = useState(false)
  const [fare, setFare] = useState(900)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [dropoffLabel, setDropoffLabel] = useState('Where to?')
  const [ridePickup, setRidePickup] = useState('My current location')
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
  const [shopsPurchaseValue] = useState(1500)

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // User data
  const [userName] = useState('Rohan Riaz')
  const [userEmail] = useState('rohan@gmail.com')
  const [userGender] = useState('Male')
  const [userBirthday] = useState('May 8th 2002')
  const [userPhone] = useState('+92 23183 3818')
  const [userAvatar] = useState<string | undefined>(undefined)

  // Previous screen for back navigation from SOS/Message/Call
  const [previousScreen, setPreviousScreen] = useState<Screen>('rideStarted')
  const [pickupSuccessScreen, setPickupSuccessScreen] = useState<Screen | null>(null)
  const [currentContact, setCurrentContact] = useState<{ name: string; avatar: string; phone?: string; serviceType?: 'ride' | 'delivery' | 'shop' | 'rental' }>({
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
    speakAction('Quick book confirmed')
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
    } else if (navLabel === 'history') {
      setIsSidebarOpen(false)
      setScreen('history')
    } else if (navLabel === 'settings') {
      setIsSidebarOpen(false)
      setScreen('settings')
    } else if (navLabel === 'myAccount') {
      setIsSidebarOpen(false)
      setScreen('myAccount')
    } else if (navLabel === 'wallet' || navLabel === 'notifications') {
      setIsSidebarOpen(false)
      setScreen(navLabel as Screen)
    } else if (navLabel === 'voiceFeedback') {
      setIsSidebarOpen(false)
      setScreen('voiceFeedback')
    } else if (navLabel === 'home') {
      setIsSidebarOpen(false)
      setScreen('home')
    } else if (navLabel === 'callBykea') {
      setIsSidebarOpen(false)
      setScreen('callBykea')
    } else if (navLabel === 'helpSupport') {
      setIsSidebarOpen(false)
      setScreen('helpSupport')
    } else if (navLabel === 'language') {
      setIsSidebarOpen(false)
      setScreen('languageSettings')
    } else if (navLabel === 'settings') {
      setIsSidebarOpen(false)
      setScreen('settings')
    } else if (navLabel === 'notificationsSettings' || navLabel === 'changeSizeSettings' || navLabel === 'languageSettings' || navLabel === 'changeThemeSettings' || navLabel === 'termsPrivacy' || navLabel === 'contactUs') {
      setIsSidebarOpen(false)
      setScreen(navLabel as Screen)
    }
  }

  // Handle opening sidebar from profile button
  const handleOpenSidebar = () => {
    setIsSidebarOpen(true)
  }

  const renderScreen = () => {
    // Authentication screens
    if (screen === 'splash') {
      return (
        <SplashScreen
          onContinue={() => setScreen('login')}
        />
      )
    }

    if (screen === 'login') {
      return (
        <LoginScreen
          onLogin={(phone) => {
            setPhoneNumber(phone)
            setScreen('otpVerification')
            setIsSignup(false)
          }}
          onSwitchToSignup={() => setScreen('signup')}
          onCallBykea={() => setScreen('callBykea')}
        />
      )
    }

    if (screen === 'signup') {
      return (
        <SignupScreen
          onSignup={(phone) => {
            setPhoneNumber(phone)
            setScreen('otpVerification')
            setIsSignup(true)
          }}
          onSwitchToLogin={() => setScreen('login')}
          onCallBykea={() => setScreen('callBykea')}
        />
      )
    }

    if (screen === 'otpVerification') {
      return (
        <OTPVerificationScreen
          phoneNumber={phoneNumber}
          isSignup={isSignup}
          onVerify={(otp) => {
            // In a real app, verify OTP with backend
            console.log('OTP verified:', otp)
            if (isSignup) {
              setScreen('onboarding')
            } else {
              setIsAuthenticated(true)
              localStorage.setItem('isAuthenticated', 'true')
              setScreen('home')
            }
          }}
          onBack={() => setScreen(isSignup ? 'signup' : 'login')}
        />
      )
    }

    if (screen === 'onboarding') {
      return (
        <OnboardingScreen
          onComplete={(data) => {
            console.log('Onboarding completed:', data)
            setVoiceFeedbackEnabled(data.voiceFeedback)
            // Move to tutorial screen after onboarding
            setScreen('onboardingTutorial')
          }}
        />
      )
    }

    if (screen === 'onboardingTutorial') {
      return (
        <OnboardingTutorialScreen
          onComplete={() => {
            setIsAuthenticated(true)
            localStorage.setItem('isAuthenticated', 'true')
            setScreen('home')
          }}
        />
      )
    }

    // Allow callBykea without authentication
    if (screen === 'callBykea') {
      return (
        <CallBykeaScreen
          onNavigate={handleNavigate}
          onBack={() => {
            if (isAuthenticated) {
              setIsSidebarOpen(true)
            } else {
              setScreen('login')
            }
          }}
        />
      )
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return (
        <LoginScreen
          onLogin={(phone) => {
            setPhoneNumber(phone)
            setScreen('otpVerification')
            setIsSignup(false)
          }}
          onSwitchToSignup={() => setScreen('signup')}
          onCallBykea={() => setScreen('callBykea')}
        />
      )
    }

    // Ride screens
    if (screen === 'home') {
      return (
        <HomeRideScreen
          onOpenQuickBook={() => setQuickBookOpen(true)}
          onOpenDropoff={openDropoff}
          dropoffLabel={dropoffLabel}
          onNavigate={handleNavigate}
          onOpenPickupSelect={() => {
            setPreviousScreen('home')
            setPickupSuccessScreen('dropoff')
            setScreen('ridePickupSelect')
          }}
          pickupLocation={ridePickup}
          onOpenSidebar={handleOpenSidebar}
          onOpenVoiceActivation={() => setShowVoiceActivation(true)}
        />
      )
    }

    if (screen === 'ridePickupSelect') {
      return (
        <DeliveryPickupSelectScreen
          onCancel={() => {
            setPickupSuccessScreen(null)
            setScreen(previousScreen)
          }}
          onApply={(value) => {
            setRidePickup(value)
            const targetScreen = pickupSuccessScreen ?? previousScreen
            setScreen(targetScreen)
            setPickupSuccessScreen(null)
          }}
          currentLocation={ridePickup}
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
          pickupLocation={ridePickup}
          onOpenPickupSelect={() => {
            setPreviousScreen('selectVehicle')
            setPickupSuccessScreen('selectVehicle')
            setScreen('ridePickupSelect')
          }}
          onOpenDropoffSelect={() => setScreen('dropoff')}
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
          onRideCompleted={() => setScreen('rideCompleted')}
        />
      )
    }

    if (screen === 'rideCompleted') {
      return (
        <RideCompletedScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('home')}
          driverName={mockDriver.name}
          driverRating={mockDriver.rating}
          driverAvatar={mockDriver.avatar}
          pickupLocation="Karachi University"
          dropoffLocation={dropoffLabel}
          distance="5.2 km"
          time="15 min"
          price={`RS. ${fare}`}
          vehicleType="Bike"
          onAddToQuickBook={(data) => {
            console.log('Added to Quick Book:', data)
            // In a real app, this would save to QuickBook routes
          }}
          onDone={() => setScreen('home')}
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
          onOpenSidebar={handleOpenSidebar}
          onOpenVoiceActivation={() => setShowVoiceActivation(true)}
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
          onDeliveryCompleted={() => setScreen('deliveryCompleted')}
        />
      )
    }

    if (screen === 'deliveryCompleted') {
      return (
        <DeliveryCompletedScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('deliveryHome')}
          riderName={mockRider.name}
          riderRating={mockRider.rating}
          riderAvatar={mockRider.avatar}
          pickupLocation={deliveryPickup}
          deliveryLocation={deliveryLocation || 'Where to?'}
          distance="5.2 km"
          time="15 min"
          price={`RS. ${deliveryFare}`}
          vehicleType="Bike"
          onDone={() => setScreen('deliveryHome')}
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
          onOpenSidebar={handleOpenSidebar}
          onOpenVoiceActivation={() => setShowVoiceActivation(true)}
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
          onRentalStarted={() => setScreen('rentalsStarted')}
          onCancel={() => setScreen('rentalsHome')}
          driverName={mockDriver.name}
          driverRating={mockDriver.rating}
          driverAvatar={mockDriver.avatar}
          pickupLocation={rentalsPickup}
          selectedHours={rentalsHours}
          selectedVehicle={rentalsVehicle}
          fare={rentalsFare}
          onCallDriver={() => {
            setPreviousScreen('rentalsConfirm')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'rental' })
            setScreen('call')
          }}
          onChatDriver={() => {
            setPreviousScreen('rentalsConfirm')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'rental' })
            setScreen('message')
          }}
        />
      )
    }

    if (screen === 'rentalsStarted') {
      return (
        <RentalsStartedScreen
          onNavigate={handleNavigate}
          driverName={mockDriver.name}
          driverRating={mockDriver.rating}
          driverAvatar={mockDriver.avatar}
          pickupLocation={rentalsPickup}
          selectedHours={rentalsHours}
          selectedVehicle={rentalsVehicle}
          price={rentalsFare}
          onCallDriver={() => {
            setPreviousScreen('rentalsStarted')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'rental' })
            setScreen('call')
          }}
          onChatDriver={() => {
            setPreviousScreen('rentalsStarted')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'rental' })
            setScreen('message')
          }}
          onSOS={() => {
            setPreviousScreen('rentalsStarted')
            setCurrentContact({ name: mockDriver.name, avatar: mockDriver.avatar, phone: mockDriver.phone, serviceType: 'rental' })
            setScreen('sos')
          }}
          onRentalCompleted={() => setScreen('rentalsCompleted')}
        />
      )
    }

    if (screen === 'rentalsCompleted') {
      return (
        <RentalsCompletedScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('rentalsHome')}
          driverName={mockDriver.name}
          driverRating={mockDriver.rating}
          driverAvatar={mockDriver.avatar}
          pickupLocation={rentalsPickup}
          selectedHours={rentalsHours}
          selectedVehicle={rentalsVehicle}
          price={`RS. ${rentalsFare}`}
          onDone={() => setScreen('rentalsHome')}
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
          onOpenSidebar={handleOpenSidebar}
          onOpenVoiceActivation={() => setShowVoiceActivation(true)}
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
      if (!selectedShop) {
        setScreen('shopsHome')
        return null
      }
      return (
        <ShopOrderInProgressScreen
          onNavigate={handleNavigate}
          shopName={selectedShop.name}
          riderName={mockRider.name}
          riderRating={mockRider.rating}
          riderAvatar={mockRider.avatar}
          shopLocation={shopsLocation}
          deliveryLocation={shopsLocation}
          price={shopsFare}
          purchaseValue={shopsPurchaseValue}
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
          onOrderCompleted={() => setScreen('shopOrderCompleted')}
        />
      )
    }

    if (screen === 'shopOrderCompleted') {
      if (!selectedShop) {
        setScreen('shopsHome')
        return null
      }
      return (
        <ShopOrderCompletedScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('shopsHome')}
          shopName={selectedShop.name}
          riderName={mockRider.name}
          riderRating={mockRider.rating}
          riderAvatar={mockRider.avatar}
          shopLocation={shopsLocation}
          deliveryLocation={shopsLocation}
          distance="2 km"
          time="10 min"
          price={`RS. ${shopsFare}`}
          purchaseValue={`RS. ${shopsPurchaseValue}`}
          onDone={() => setScreen('shopsHome')}
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

    // History Screen
    if (screen === 'history') {
      return (
        <HistoryScreen
          onNavigate={handleNavigate}
          onBack={() => setIsSidebarOpen(true)}
        />
      )
    }

    // Settings Screen
    if (screen === 'settings') {
      return (
        <SettingsScreen
          onNavigate={handleNavigate}
          onBack={() => setIsSidebarOpen(true)}
          userName={userName}
          userAvatar={userAvatar}
        />
      )
    }

    // My Account Screen
    if (screen === 'myAccount') {
      return (
        <MyAccountScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('settings')}
          userName={userName}
          userEmail={userEmail}
          userGender={userGender}
          userBirthday={userBirthday}
          userPhone={userPhone}
          userAvatar={userAvatar}
          onUpdateUser={(updates) => {
            // Update user data (in a real app, this would save to backend)
            if (updates.name) console.log('Name updated:', updates.name)
            if (updates.email) console.log('Email updated:', updates.email)
            if (updates.phone) console.log('Phone updated:', updates.phone)
            if (updates.gender) console.log('Gender updated:', updates.gender)
            if (updates.birthday) console.log('Birthday updated:', updates.birthday)
          }}
        />
      )
    }

    // Settings Sub-screens
    if (screen === 'notificationsSettings') {
      return (
        <NotificationsSettingsScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('settings')}
        />
      )
    }

    if (screen === 'changeSizeSettings') {
      return (
        <ChangeSizeSettingsScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('settings')}
        />
      )
    }

    if (screen === 'languageSettings') {
      return (
        <LanguageSettingsScreen
          onNavigate={handleNavigate}
          onBack={() => {
            // If coming from sidebar, go to settings. If from settings, go back to settings.
            setScreen('settings')
          }}
        />
      )
    }

    if (screen === 'changeThemeSettings') {
      return (
        <ChangeThemeSettingsScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('settings')}
        />
      )
    }

    if (screen === 'termsPrivacy') {
      return (
        <TermsPrivacyScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('settings')}
        />
      )
    }

    if (screen === 'contactUs') {
      return (
        <ContactUsScreen
          onNavigate={handleNavigate}
          onBack={() => setScreen('settings')}
        />
      )
    }

    // Sidebar screens
    if (screen === 'helpSupport') {
      return (
        <HelpSupportScreen
          onNavigate={handleNavigate}
          onBack={() => setIsSidebarOpen(true)}
        />
      )
    }

    if (screen === 'voiceFeedback') {
      return (
        <VoiceFeedbackScreen
          onNavigate={handleNavigate}
          onBack={() => {
            handleNavigate('home')
          }}
        />
      )
    }

    // Default fallback
    return null
  }

  return (
    <main className="min-h-screen bg-zinc-100 py-8 text-text-dark flex items-center justify-center">
      <div className="relative mx-auto w-[440px] max-w-full h-[844px] md:scale-90 overflow-hidden rounded-[40px]">
        {/* Sidebar - Inside mobile container */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userName={userName}
          userAvatar={userAvatar}
        />

        {/* Screen content - Each screen already has its own container, so we need to adjust */}
        {renderScreen()}
      </div>

      {isQuickBookOpen && (
        <QuickBookModal
          onConfirm={handleQuickBookConfirm}
          onCancel={() => setShowCancelConfirm(true)}
          onAddQuickBook={(data) => {
            // Save quick book route (in a real app, this would save to backend)
            console.log('Quick book route added:', data)
          }}
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

      {showVoiceActivation && (
        <VoiceActivationModal
          onClose={() => setShowVoiceActivation(false)}
          onProceed={(command) => {
            setShowVoiceActivation(false)
            // Process voice command
            if (command.action === 'ride') {
              if (command.pickup) {
                setRidePickup(command.pickup)
              }
              if (command.dropoff) {
                setDropoffLabel(command.dropoff)
                setScreen('selectVehicle')
              } else {
                setScreen('dropoff')
              }
            } else if (command.action === 'delivery') {
              if (command.pickup) {
                setDeliveryPickup(command.pickup)
              }
              if (command.dropoff) {
                setDeliveryLocation(command.dropoff)
                setScreen('deliveryForm')
              } else {
                setScreen('deliveryHome')
              }
            } else if (command.action === 'rental') {
              if (command.pickup) {
                setRentalsPickup(command.pickup)
              }
              if (command.details) {
                const hoursMatch = command.details.match(/(\d+)\s*hour/i)
                if (hoursMatch) {
                  setRentalsHours(parseInt(hoursMatch[1]))
                }
              }
              setScreen('rentalsHome')
            } else if (command.action === 'shop') {
              if (command.dropoff) {
                setShopsLocation(command.dropoff)
              }
              setScreen('shopsHome')
            }
          }}
        />
      )}
    </main>
  )
}

export default App
