import { useState } from 'react'
import { HomeRideScreen, DropoffSelectScreen, SelectVehicleScreen, RideExtendedScreen, SearchingRidesScreen } from './screens'
import { QuickBookModal, CancelDialog, FareDialog, PaymentMethodsModal, FareBreakdownModal, RideOffersModal } from './components/modals'
import { Overlay } from './components/Overlay'
import { recentLocations, breakdownItems } from './constants/data'
import type { Screen, PaymentMethod } from './types'

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

  const openDropoff = () => setScreen('dropoff')

  const handleQuickBookConfirm = () => {
    setQuickBookOpen(false)
    setShowFareDialog(true)
  }

  const renderScreen = () => {
    if (screen === 'home') {
      return (
        <HomeRideScreen
          onOpenQuickBook={() => setQuickBookOpen(true)}
          onOpenDropoff={openDropoff}
          dropoffLabel={dropoffLabel}
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

    return (
      <RideExtendedScreen
        dropoffLabel={dropoffLabel}
        onEditDropoff={openDropoff}
        recentLocations={recentLocations}
      />
    )
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
            fare={fare}
            onChangeFare={setFare}
            onConfirm={() => setShowFareDialog(false)}
            onViewBreakdown={() => {
              setShowFareDialog(false)
              setShowBreakdown(true)
            }}
          />
        </Overlay>
      )}

      {showPaymentModal && (
        <Overlay>
          <PaymentMethodsModal
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            onConfirm={() => setShowPaymentModal(false)}
            onClose={() => setShowPaymentModal(false)}
          />
        </Overlay>
      )}

      {showBreakdown && (
        <Overlay>
          <FareBreakdownModal
            fare={fare}
            items={breakdownItems}
            onConfirm={() => {
              setShowBreakdown(false)
              setScreen('selectVehicle')
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
            setScreen('rideExtended')
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
