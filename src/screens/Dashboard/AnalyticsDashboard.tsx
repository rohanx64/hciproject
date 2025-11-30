import { useState, useEffect, useRef, useMemo } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../../firebase.config'
import type { Session, ScreenFlowEntry, AnalyticsEvent } from '../../contexts/AnalyticsContext'
import type { Screen } from '../../types'
import {
  HomeRideScreen,
  DropoffSelectScreen,
  SelectVehicleScreen,
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
  RideExtendedScreen,
  SearchingRidesScreen,
  RideConfirmedScreen,
  RideStartedScreen,
  RideCompletedScreen,
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
  SplashScreen,
  LoginScreen,
  SignupScreen,
  OTPVerificationScreen,
  OnboardingScreen,
  OnboardingTutorialScreen,
} from '../index'

interface SessionListItem {
  id: string
  userId: string
  startTime: number
  device: string
  screenFlow: ScreenFlowEntry[]
}

export function AnalyticsDashboard() {
  const [sessions, setSessions] = useState<SessionListItem[]>([])
  const [selectedSession, setSelectedSession] = useState<SessionListItem | null>(null)
  const [selectedScreen, setSelectedScreen] = useState<ScreenFlowEntry | null>(null)
  const [heatmapMode, setHeatmapMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageTimeToBook: 0,
    mostConfusingScreen: '',
    totalClicks: 0,
  })
  const [activeTab, setActiveTab] = useState<'replay' | 'analytics' | 'heatmap'>('replay')
  const [selectedHeatmapScreen, setSelectedHeatmapScreen] = useState<string>('home')
  const [screenTimeData, setScreenTimeData] = useState<Array<{ screen: string; time: number }>>([])
  const [clickDistribution, setClickDistribution] = useState<Array<{ screen: string; clicks: number }>>([])
  const [userFlowData, setUserFlowData] = useState<Array<{ from: string; to: string; count: number }>>([])
  const [scrollDepthData, setScrollDepthData] = useState<Array<{ screen: string; avgDepth: number }>>([])
  const [engagementMetrics, setEngagementMetrics] = useState({
    avgSessionDuration: 0,
    bounceRate: 0,
    avgClicksPerSession: 0,
    avgScreensPerSession: 0,
  })
  const replayContainerRef = useRef<HTMLDivElement>(null)

  // Fetch sessions from Firestore
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const q = query(collection(db, 'sessions'), orderBy('startTime', 'desc'), limit(50))
        const querySnapshot = await getDocs(q)
        const sessionsData: SessionListItem[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          // Ensure screenFlow entries have events array
          const screenFlow = (data.screenFlow || []).map((entry: any) => ({
            screenName: entry.screenName || '',
            timestamp: entry.timestamp || 0,
            timeSpent: entry.timeSpent || 0,
            events: Array.isArray(entry.events) ? entry.events : [],
          }))
          
          sessionsData.push({
            id: doc.id,
            userId: data.userId || 'unknown',
            startTime: data.startTime || (data.createdAt?.toMillis?.() || Date.now()),
            device: data.device || 'unknown',
            screenFlow,
          })
        })

        setSessions(sessionsData)
        setIsLoading(false)

        // Debug: Log data structure
        if (sessionsData.length > 0) {
          console.log('Sample session data:', {
            screenFlowLength: sessionsData[0].screenFlow.length,
            firstScreen: sessionsData[0].screenFlow[0],
            totalEvents: sessionsData[0].screenFlow.reduce((sum, screen) => sum + (screen.events?.length || 0), 0),
          })
        }

        // Calculate stats
        calculateStats(sessionsData)
      } catch (error) {
        console.error('Error fetching sessions:', error)
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  // Calculate aggregated statistics
  const calculateStats = (sessionsData: SessionListItem[]) => {
    let totalTimeToBook = 0
    let bookingCount = 0
    const screenTimeMap = new Map<string, number>()
    const screenClickMap = new Map<string, number>()
    const screenVisitCount = new Map<string, number>()
    const flowMap = new Map<string, number>()
    const scrollDepthMap = new Map<string, { total: number; count: number }>()
    let totalClicks = 0
    let totalSessionDuration = 0
    let totalScreens = 0
    let singleScreenSessions = 0

    sessionsData.forEach((session) => {
      // Calculate time to book (from start to 'selectVehicle' or 'rideConfirmed')
      let timeToBook = 0
      let foundBooking = false

      for (const screen of session.screenFlow) {
        timeToBook += screen.timeSpent
        if (screen.screenName === 'selectVehicle' || screen.screenName === 'rideConfirmed') {
          foundBooking = true
          break
        }
      }

      if (foundBooking) {
        totalTimeToBook += timeToBook
        bookingCount++
      }

      // Track screen time and visits
      session.screenFlow.forEach((screen) => {
        const current = screenTimeMap.get(screen.screenName) || 0
        screenTimeMap.set(screen.screenName, current + screen.timeSpent)
        
        const visitCount = screenVisitCount.get(screen.screenName) || 0
        screenVisitCount.set(screen.screenName, visitCount + 1)
      })

      // Track screen transitions
      for (let i = 0; i < session.screenFlow.length - 1; i++) {
        const from = session.screenFlow[i].screenName
        const to = session.screenFlow[i + 1].screenName
        const key = `${from} → ${to}`
        flowMap.set(key, (flowMap.get(key) || 0) + 1)
      }

      // Count clicks per screen
      session.screenFlow.forEach((screen) => {
        const events = Array.isArray(screen.events) ? screen.events : []
        const clicks = events.filter((e) => e && e.type === 'click').length
        totalClicks += clicks
        const current = screenClickMap.get(screen.screenName) || 0
        screenClickMap.set(screen.screenName, current + clicks)
      })

      // Track scroll depth
      session.screenFlow.forEach((screen) => {
        const events = Array.isArray(screen.events) ? screen.events : []
        const scrolls = events.filter((e) => e && e.type === 'scroll')
        if (scrolls.length > 0) {
          const maxScroll = Math.max(...scrolls.map((s) => (s.y || 0)))
          const existing = scrollDepthMap.get(screen.screenName) || { total: 0, count: 0 }
          scrollDepthMap.set(screen.screenName, {
            total: existing.total + maxScroll,
            count: existing.count + 1,
          })
        }
      })

      // Calculate session duration
      const sessionDuration = session.screenFlow.reduce((sum, screen) => sum + screen.timeSpent, 0)
      totalSessionDuration += sessionDuration
      totalScreens += session.screenFlow.length
      
      if (session.screenFlow.length === 1) {
        singleScreenSessions++
      }
    })

    // Find most confusing screen (highest time spent)
    let maxTime = 0
    let mostConfusing = ''
    screenTimeMap.forEach((time, screenName) => {
      if (time > maxTime) {
        maxTime = time
        mostConfusing = screenName
      }
    })

    // Prepare data for visualizations
    const screenTimeArray = Array.from(screenTimeMap.entries())
      .map(([screen, time]) => ({ screen, time }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 10)

    const clickDistributionArray = Array.from(screenClickMap.entries())
      .map(([screen, clicks]) => ({ screen, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    const userFlowArray = Array.from(flowMap.entries())
      .map(([flow, count]) => {
        const [from, to] = flow.split(' → ')
        return { from, to, count }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)

    const scrollDepthArray = Array.from(scrollDepthMap.entries())
      .map(([screen, data]) => ({
        screen,
        avgDepth: data.count > 0 ? data.total / data.count : 0,
      }))
      .filter((item) => item.avgDepth > 0)
      .sort((a, b) => b.avgDepth - a.avgDepth)
      .slice(0, 10)

    setScreenTimeData(screenTimeArray)
    setClickDistribution(clickDistributionArray)
    setUserFlowData(userFlowArray)
    setScrollDepthData(scrollDepthArray)

    const avgSessionDuration = sessionsData.length > 0 ? totalSessionDuration / sessionsData.length : 0
    const bounceRate = sessionsData.length > 0 ? (singleScreenSessions / sessionsData.length) * 100 : 0
    const avgClicksPerSession = sessionsData.length > 0 ? totalClicks / sessionsData.length : 0
    const avgScreensPerSession = sessionsData.length > 0 ? totalScreens / sessionsData.length : 0

    setEngagementMetrics({
      avgSessionDuration,
      bounceRate,
      avgClicksPerSession,
      avgScreensPerSession,
    })

    setStats({
      totalSessions: sessionsData.length,
      averageTimeToBook: bookingCount > 0 ? totalTimeToBook / bookingCount : 0,
      mostConfusingScreen: mostConfusing,
      totalClicks,
    })
  }

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  // Get all clicks for heatmap from ALL sessions and ALL users for a specific screen
  const getHeatmapClicks = (screenName?: string): Array<{ x: number; y: number; intensity: number }> => {
    const targetScreen = screenName || selectedScreen?.screenName
    if (!targetScreen) return []

    const clickMap = new Map<string, { x: number; y: number; count: number }>()

    // Aggregate clicks from ALL sessions for this screen
    sessions.forEach((session) => {
      // Find all screens with the same name across all sessions
      const matchingScreens = session.screenFlow.filter(
        (screen) => screen.screenName === targetScreen
      )

      matchingScreens.forEach((screen) => {
        // Ensure events is an array
        const events = Array.isArray(screen.events) ? screen.events : []
        events
          .filter((e) => e && e.type === 'click' && typeof e.x === 'number' && typeof e.y === 'number')
          .forEach((click) => {
            // Use smaller grid for more precise heatmap (8px grid for smoother visualization)
            const gridX = Math.round(click.x / 8) * 8
            const gridY = Math.round(click.y / 8) * 8
            const key = `${gridX},${gridY}`

            const existing = clickMap.get(key)
            if (existing) {
              existing.count++
            } else {
              clickMap.set(key, { x: gridX, y: gridY, count: 1 })
            }
          })
      })
    })

    return Array.from(clickMap.values()).map((item) => ({
      x: item.x,
      y: item.y,
      intensity: item.count,
    }))
  }

  // Get all unique screen names from all sessions
  const getAllScreenNames = (): string[] => {
    const screenSet = new Set<string>()
    sessions.forEach((session) => {
      session.screenFlow.forEach((screen) => {
        screenSet.add(screen.screenName)
      })
    })
    return Array.from(screenSet).sort()
  }

  // Render replay overlay
  const renderReplayOverlay = () => {
    if (!selectedScreen) return null

    // Ensure events is an array
    const events = Array.isArray(selectedScreen.events) ? selectedScreen.events : []
    const clicks = events.filter((e) => e && e.type === 'click' && typeof e.x === 'number' && typeof e.y === 'number')
    const moves = events.filter((e) => e && e.type === 'move' && typeof e.x === 'number' && typeof e.y === 'number')
    const heatmapClicks = heatmapMode ? getHeatmapClicks() : []

    return (
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Mouse path */}
        {!heatmapMode && moves.length > 0 && (
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
            <path
              d={`M ${moves.map((m) => `${m.x},${m.y}`).join(' L ')}`}
              fill="none"
              stroke="rgba(255, 193, 7, 0.3)"
              strokeWidth="2"
            />
          </svg>
        )}

        {/* Click markers */}
        {!heatmapMode &&
          clicks.map((click, idx) => (
            <div
              key={idx}
              className="absolute w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg animate-pulse"
              style={{
                left: `${click.x}px`,
                top: `${click.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

        {/* Heatmap - Football player style with gradient overlay */}
        {heatmapMode && (
          <>
            {heatmapClicks.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm text-gray-600">No click data available for this screen</p>
                  <p className="text-xs text-gray-500 mt-1">Clicks will appear here once users interact with this screen</p>
                </div>
              </div>
            ) : (
              <>
                {/* Canvas-based heatmap for better performance and smoother gradients */}
                <HeatmapCanvas clicks={heatmapClicks} />
                {/* Heatmap Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-50 pointer-events-auto">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Click Intensity</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500"></div>
                    <div className="text-xs text-gray-600 flex gap-3">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Showing {heatmapClicks.reduce((sum, c) => sum + c.intensity, 0)} total clicks from all users
                  </div>
                </div>
                {/* Overlay with intensity indicators */}
                <div className="absolute inset-0 pointer-events-none">
                  {heatmapClicks.map((click, idx) => {
                    const maxIntensity = Math.max(...heatmapClicks.map((c) => c.intensity), 1)
                    const normalizedIntensity = click.intensity / maxIntensity
                    // Size based on intensity (larger for more clicks)
                    const size = Math.max(20, Math.min(80, 20 + normalizedIntensity * 60))
                    // Color gradient: blue (low) -> green -> yellow -> orange -> red (high)
                    const hue = 240 - (normalizedIntensity * 180) // 240 (blue) to 60 (yellow-red)
                    const saturation = 70 + (normalizedIntensity * 30)
                    const lightness = 50 + (normalizedIntensity * 20)

                    return (
                      <div
                        key={idx}
                        className="absolute rounded-full"
                        style={{
                          left: `${click.x}px`,
                          top: `${click.y}px`,
                          width: `${size}px`,
                          height: `${size}px`,
                          background: `radial-gradient(circle, hsla(${hue}, ${saturation}%, ${lightness}%, ${0.6 + normalizedIntensity * 0.3}) 0%, hsla(${hue}, ${saturation}%, ${lightness}%, 0) 70%)`,
                          transform: 'translate(-50%, -50%)',
                          filter: 'blur(8px)',
                          mixBlendMode: 'screen',
                        }}
                      />
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    )
  }

  // Helper function to render a screen component given a screen entry (without modifying state)
  const renderScreenByEntry = (screenEntry: ScreenFlowEntry) => {
    const screenNameToRender = screenEntry.screenName as Screen
    
    // Direct rendering based on screen name - no state modifications
    switch (screenNameToRender) {
      case 'home':
        return <HomeRideScreen onNavigate={noop} onOpenDropoff={noop} onOpenVoiceActivation={noop} onOpenSidebar={noop} dropoffLabel="Where to?" pickupLocation="My current location" onOpenPickupSelect={noop} onOpenQuickBook={noop} />
      case 'dropoff':
        return <DropoffSelectScreen onCancel={noop} onApply={noop} />
      case 'selectVehicle':
        return <SelectVehicleScreen onCancel={noop} onConfirm={noop} dropoffLabel="Where to?" onOpenFareDialog={noop} onOpenPaymentModal={noop} fare={900} paymentMethod="cash" pickupLocation="My current location" onOpenPickupSelect={noop} onOpenDropoffSelect={noop} />
      case 'deliveryHome':
        return <DeliveryHomeScreen onNavigate={noop} onProceedToForm={noop} onSelectLocation={noop} pickupLocation={undefined} onOpenPickupSelect={noop} onOpenSidebar={noop} onOpenVoiceActivation={noop} />
      case 'rentalsHome':
        return <RentalsHomeScreen onNavigate={noop} onProceedToConfirm={noop} pickupLocation={undefined} onChangePickup={noop} onOpenFareDialog={noop} onOpenPaymentModal={noop} onOpenSidebar={noop} onOpenVoiceActivation={noop} />
      case 'shopsHome':
        return <ShopsHomeScreen onNavigate={noop} onSelectLocation={noop} onOpenSidebar={noop} onOpenVoiceActivation={noop} />
      case 'deliveryPickupSelect':
      case 'ridePickupSelect':
        return <DeliveryPickupSelectScreen onCancel={noop} onApply={noop} currentLocation="My current location" />
      case 'deliveryForm':
        return <DeliveryFormScreen onCancel={noop} onConfirm={noop} pickupLocation="Pickup" dropoffLocation="Dropoff" />
      case 'searchingRides':
        return <SearchingRidesScreen dropoffLabel="Where to?" onRidesFound={noop} />
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500 bg-gray-100">
            <div className="text-center">
              <p className="text-lg font-medium">Screen Preview</p>
              <p className="text-sm text-gray-500 mt-2">{screenNameToRender}</p>
            </div>
          </div>
        )
    }
  }

  // Heatmap View Component - Full screen heatmap visualization
  const HeatmapView = ({ screenName }: { screenName: string }) => {
    const heatmapClicks = getHeatmapClicks(screenName)
    const totalClicks = heatmapClicks.reduce((sum, c) => sum + c.intensity, 0)
    const maxIntensity = heatmapClicks.length > 0 ? Math.max(...heatmapClicks.map((c) => c.intensity), 1) : 1

    // Find a session with this screen to render the base screen
    const sampleSession = sessions.find((s) => 
      s.screenFlow.some((screen) => screen.screenName === screenName)
    )
    const sampleScreen = sampleSession?.screenFlow.find((s) => s.screenName === screenName)

    return (
      <div className="relative w-full h-full bg-white">
        {/* Render the base screen with reduced opacity */}
        <div className="absolute inset-0 opacity-40">
          {sampleScreen ? (
            renderScreenByEntry(sampleScreen)
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Loading screen preview...</p>
            </div>
          )}
        </div>

        {/* Heatmap Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50">
          {heatmapClicks.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
              <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600">No click data available for this screen</p>
                <p className="text-xs text-gray-500 mt-1">
                  Clicks will appear here once users interact with this screen
                </p>
              </div>
            </div>
          ) : (
            <>
              <HeatmapCanvas clicks={heatmapClicks} />
              {/* Heatmap Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg z-50 pointer-events-auto">
                <div className="text-sm font-semibold text-gray-700 mb-2">Click Intensity</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-4 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <div className="text-xs text-gray-500 border-t border-gray-200 pt-2 mt-2">
                  <div className="font-semibold">{totalClicks} total clicks</div>
                  <div>Max intensity: {maxIntensity} clicks</div>
                  <div>Screen: {screenName}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Heatmap Canvas Component for smooth gradient rendering
  const HeatmapCanvas = ({ clicks }: { clicks: Array<{ x: number; y: number; intensity: number }> }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const maxIntensity = useMemo(() => Math.max(...clicks.map((c) => c.intensity), 1), [clicks])

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas || clicks.length === 0) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size to match container
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient for each click point
      clicks.forEach((click) => {
        const normalizedIntensity = click.intensity / maxIntensity
        const radius = Math.max(30, Math.min(100, 30 + normalizedIntensity * 70))
        
        // Create radial gradient: hot colors (red/orange) for high intensity
        const gradient = ctx.createRadialGradient(click.x, click.y, 0, click.x, click.y, radius)
        
        // Color based on intensity: blue -> green -> yellow -> orange -> red
        const intensityRatio = normalizedIntensity
        let r, g, b
        
        if (intensityRatio < 0.25) {
          // Blue to Cyan
          r = 0
          g = Math.floor(100 + intensityRatio * 4 * 155)
          b = 255
        } else if (intensityRatio < 0.5) {
          // Cyan to Green
          r = 0
          g = 255
          b = Math.floor(255 - (intensityRatio - 0.25) * 4 * 255)
        } else if (intensityRatio < 0.75) {
          // Green to Yellow
          r = Math.floor((intensityRatio - 0.5) * 4 * 255)
          g = 255
          b = 0
        } else {
          // Yellow to Red
          r = 255
          g = Math.floor(255 - (intensityRatio - 0.75) * 4 * 255)
          b = 0
        }
        
        const alpha = Math.max(0.3, Math.min(0.8, normalizedIntensity))
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(click.x, click.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Apply blur effect using composite operation
      ctx.globalCompositeOperation = 'screen'
    }, [clicks, maxIntensity])

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
    )
  }

  // No-op callbacks for replay mode
  const noop = () => {}

  // Render the screen component for replay
  const renderReplayScreen = () => {
    if (!selectedScreen) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a screen from the session to replay
        </div>
      )
    }

    const screenName = selectedScreen.screenName

    // Render appropriate screen component based on screenName
    const renderScreenComponent = () => {
      switch (screenName) {
        case 'splash':
          return <SplashScreen onContinue={noop} />
        case 'login':
          return <LoginScreen onLogin={noop} onSwitchToSignup={noop} onCallBykea={noop} />
        case 'signup':
          return <SignupScreen onSignup={noop} onSwitchToLogin={noop} onCallBykea={noop} />
        case 'otpVerification':
          return (
            <OTPVerificationScreen
              phoneNumber=""
              isSignup={false}
              onVerify={noop}
              onBack={noop}
            />
          )
        case 'onboarding':
          return <OnboardingScreen onComplete={noop} />
        case 'onboardingTutorial':
          return <OnboardingTutorialScreen onComplete={noop} />
        case 'home':
          return (
            <HomeRideScreen
              onOpenQuickBook={noop}
              onOpenDropoff={noop}
              dropoffLabel="Where to?"
              pickupLocation="My current location"
              onNavigate={noop}
              onOpenPickupSelect={noop}
              onOpenSidebar={noop}
              onOpenVoiceActivation={noop}
            />
          )
        case 'dropoff':
          return <DropoffSelectScreen onCancel={noop} onApply={noop} />
        case 'ridePickupSelect':
        case 'deliveryPickupSelect':
          return (
            <DeliveryPickupSelectScreen
              onCancel={noop}
              onApply={noop}
              currentLocation="My current location"
            />
          )
        case 'selectVehicle':
          return (
            <SelectVehicleScreen
              onCancel={noop}
              onConfirm={noop}
              dropoffLabel="Where to?"
              onOpenFareDialog={noop}
              onOpenPaymentModal={noop}
              fare={900}
              paymentMethod="cash"
              pickupLocation="My current location"
              onOpenPickupSelect={noop}
              onOpenDropoffSelect={noop}
            />
          )
        case 'rideExtended':
          return (
            <RideExtendedScreen
              dropoffLabel="Where to?"
              onEditDropoff={noop}
              recentLocations={[]}
              onNavigate={noop}
            />
          )
        case 'searchingRides':
          return <SearchingRidesScreen dropoffLabel="Where to?" onRidesFound={noop} />
        case 'rideConfirmed':
          return (
            <RideConfirmedScreen
              onNavigate={noop}
              onRideStarted={noop}
              onCancel={noop}
              driverName="Driver"
              driverRating={5}
              driverAvatar=""
              pickupLocation="Pickup"
              dropoffLocation="Dropoff"
              distance="0 km"
              time="0 min"
              price={900}
              vehicleType="Bike"
              onCallDriver={noop}
              onChatDriver={noop}
            />
          )
        case 'rideStarted':
          return (
            <RideStartedScreen
              onNavigate={noop}
              driverName="Driver"
              driverRating={5}
              driverAvatar=""
              pickupLocation="Pickup"
              dropoffLocation="Dropoff"
              price={900}
              onCallDriver={noop}
              onChatDriver={noop}
              onSOS={noop}
              onRideCompleted={noop}
            />
          )
        case 'rideCompleted':
          return (
            <RideCompletedScreen
              onNavigate={noop}
              onBack={noop}
              driverName="Driver"
              driverRating={5}
              driverAvatar=""
              pickupLocation="Pickup"
              dropoffLocation="Dropoff"
              distance="0 km"
              time="0 min"
              price="RS. 900"
              vehicleType="Bike"
              onAddToQuickBook={noop}
              onDone={noop}
            />
          )
        case 'deliveryHome':
          return (
            <DeliveryHomeScreen
              onNavigate={noop}
              onProceedToForm={noop}
              onSelectLocation={noop}
              selectedType="bike"
              onSelectType={noop}
              pickupLocation="My current location"
              onChangePickup={noop}
              onOpenPickupSelect={noop}
              onOpenSidebar={noop}
              onOpenVoiceActivation={noop}
            />
          )
        case 'deliveryForm':
          return (
            <DeliveryFormScreen
              pickupLocation="My current location"
              deliveryLocation=""
              parcelDetails=""
              paymentOption="half-pay"
              onChangePickup={noop}
              onChangeDelivery={noop}
              onChangeParcel={noop}
              onChangePayment={noop}
              onCancel={noop}
              onApply={noop}
              onOpenMap={noop}
            />
          )
        case 'deliveryMap':
          return (
            <DeliveryMapScreen
              pickupLocation={[24.8607, 67.0011]}
              deliveryLocation={[24.8707, 67.0211]}
              onCancel={noop}
              onApply={noop}
            />
          )
        case 'deliveryFare':
          return (
            <DeliveryFareScreen
              fare={180}
              breakdownItems={[]}
              pickupLocation={[24.8607, 67.0011]}
              deliveryLocation={[24.8707, 67.0211]}
              onCancel={noop}
              onConfirm={noop}
            />
          )
        case 'deliverySuccess':
          return <DeliverySuccessScreen onDone={noop} onNavigate={noop} />
        case 'deliveryConfirmed':
          return (
            <DeliveryConfirmedScreen
              onNavigate={noop}
              onDeliveryStarted={noop}
              onCancel={noop}
              riderName="Rider"
              riderRating={5}
              riderAvatar=""
              pickupLocation="Pickup"
              deliveryLocation="Delivery"
              distance="0 km"
              time="0 min"
              price={180}
              vehicleType="Bike"
              onCallRider={noop}
              onChatRider={noop}
            />
          )
        case 'deliveryInProgress':
          return (
            <DeliveryInProgressScreen
              onNavigate={noop}
              riderName="Rider"
              riderRating={5}
              riderAvatar=""
              pickupLocation="Pickup"
              deliveryLocation="Delivery"
              price={180}
              onCallRider={noop}
              onChatRider={noop}
              onSOS={noop}
              onDeliveryCompleted={noop}
            />
          )
        case 'deliveryCompleted':
          return (
            <DeliveryCompletedScreen
              onNavigate={noop}
              onBack={noop}
              riderName="Rider"
              riderRating={5}
              riderAvatar=""
              pickupLocation="Pickup"
              deliveryLocation="Delivery"
              distance="0 km"
              time="0 min"
              price="RS. 180"
              vehicleType="Bike"
              onDone={noop}
            />
          )
        case 'rentalsHome':
          return (
            <RentalsHomeScreen
              onNavigate={noop}
              onProceedToConfirm={noop}
              pickupLocation="My current location"
              onChangePickup={noop}
              onOpenFareDialog={noop}
              onOpenPaymentModal={noop}
              onOpenPickupSelect={noop}
              onOpenSidebar={noop}
              onOpenVoiceActivation={noop}
            />
          )
        case 'rentalsPickupSelect':
          return (
            <RentalsPickupSelectScreen
              onCancel={noop}
              onApply={noop}
              currentLocation="My current location"
            />
          )
        case 'rentalsConfirm':
          return (
            <RentalsConfirmScreen
              onNavigate={noop}
              onRentalStarted={noop}
              onCancel={noop}
              driverName="Driver"
              driverRating={5}
              driverAvatar=""
              pickupLocation="My current location"
              selectedHours={2}
              selectedVehicle="Bike"
              fare={900}
              onCallDriver={noop}
              onChatDriver={noop}
            />
          )
        case 'rentalsStarted':
          return (
            <RentalsStartedScreen
              onNavigate={noop}
              driverName="Driver"
              driverRating={5}
              driverAvatar=""
              pickupLocation="My current location"
              selectedHours={2}
              selectedVehicle="Bike"
              price={900}
              onCallDriver={noop}
              onChatDriver={noop}
              onSOS={noop}
              onRentalCompleted={noop}
            />
          )
        case 'rentalsCompleted':
          return (
            <RentalsCompletedScreen
              onNavigate={noop}
              onBack={noop}
              driverName="Driver"
              driverRating={5}
              driverAvatar=""
              pickupLocation="My current location"
              selectedHours={2}
              selectedVehicle="Bike"
              price="RS. 900"
              onDone={noop}
            />
          )
        case 'shopsHome':
          return (
            <ShopsHomeScreen
              onNavigate={noop}
              onSelectShop={noop}
              location="Location"
              onOpenLocationSelect={noop}
              onOpenSidebar={noop}
              onOpenVoiceActivation={noop}
            />
          )
        case 'shopsLocationSelect':
          return (
            <ShopsLocationSelectScreen
              onCancel={noop}
              onApply={noop}
              currentLocation="Location"
            />
          )
        case 'shopOrder':
          return (
            <ShopOrderScreen
              onNavigate={noop}
              onConfirm={noop}
              shopName="Shop"
              shopCategory="Category"
              deliveryLocation="Location"
              onEditLocation={noop}
              onOpenFareDialog={noop}
              onOpenFareBreakdown={noop}
              onOpenPaymentModal={noop}
              fare={180}
              breakdownItems={[]}
              paymentMethod="cash"
            />
          )
        case 'shopOrderConfirmed':
          return (
            <ShopOrderConfirmedScreen
              onNavigate={noop}
              onOrderStarted={noop}
              onCancel={noop}
              shopName="Shop"
              riderName="Rider"
              riderRating={5}
              riderAvatar=""
              shopLocation="Shop Location"
              deliveryLocation="Delivery Location"
              distance="0 km"
              time="0 min"
              price={180}
              purchaseValue={1500}
              onCallRider={noop}
              onChatRider={noop}
            />
          )
        case 'shopOrderInProgress':
          return (
            <ShopOrderInProgressScreen
              onNavigate={noop}
              shopName="Shop"
              riderName="Rider"
              riderRating={5}
              riderAvatar=""
              shopLocation="Shop Location"
              deliveryLocation="Delivery Location"
              price={180}
              purchaseValue={1500}
              onCallRider={noop}
              onChatRider={noop}
              onSOS={noop}
              onOrderCompleted={noop}
            />
          )
        case 'shopOrderCompleted':
          return (
            <ShopOrderCompletedScreen
              onNavigate={noop}
              onBack={noop}
              shopName="Shop"
              riderName="Rider"
              riderRating={5}
              riderAvatar=""
              shopLocation="Shop Location"
              deliveryLocation="Delivery Location"
              distance="0 km"
              time="0 min"
              price="RS. 180"
              purchaseValue="RS. 1500"
              onDone={noop}
            />
          )
        case 'sos':
          return (
            <SOSScreen
              onNavigate={noop}
              onClose={noop}
              contactName="Emergency"
              contactPhone=""
              serviceType="ride"
            />
          )
        case 'message':
          return (
            <MessageScreen
              onNavigate={noop}
              onClose={noop}
              contactName="Contact"
              contactAvatar=""
              serviceType="ride"
            />
          )
        case 'call':
          return (
            <CallScreen
              onNavigate={noop}
              onClose={noop}
              contactName="Contact"
              contactAvatar=""
              contactPhone=""
              serviceType="ride"
            />
          )
        case 'history':
          return <HistoryScreen onNavigate={noop} onBack={noop} />
        case 'settings':
          return (
            <SettingsScreen
              onNavigate={noop}
              onBack={noop}
              userName="User"
              userAvatar={undefined}
            />
          )
        case 'myAccount':
          return (
            <MyAccountScreen
              onNavigate={noop}
              onBack={noop}
              userName="User"
              userEmail="user@example.com"
              userGender="Male"
              userBirthday=""
              userPhone=""
              userAvatar={undefined}
              onUpdateUser={noop}
            />
          )
        case 'notificationsSettings':
          return <NotificationsSettingsScreen onNavigate={noop} onBack={noop} />
        case 'changeSizeSettings':
          return <ChangeSizeSettingsScreen onNavigate={noop} onBack={noop} />
        case 'languageSettings':
          return <LanguageSettingsScreen onNavigate={noop} onBack={noop} />
        case 'changeThemeSettings':
          return <ChangeThemeSettingsScreen onNavigate={noop} onBack={noop} />
        case 'termsPrivacy':
          return <TermsPrivacyScreen onNavigate={noop} onBack={noop} />
        case 'contactUs':
          return <ContactUsScreen onNavigate={noop} onBack={noop} />
        case 'helpSupport':
          return <HelpSupportScreen onNavigate={noop} onBack={noop} />
        case 'callBykea':
          return <CallBykeaScreen onNavigate={noop} onBack={noop} />
        case 'voiceFeedback':
          return <VoiceFeedbackScreen onNavigate={noop} onBack={noop} />
        default:
          return (
            <div className="flex items-center justify-center h-full text-gray-500">
              Screen "{screenName}" replay not implemented
            </div>
          )
      }
    }

    return (
      <div className="relative w-full h-full">
        {renderScreenComponent()}
        {renderReplayOverlay()}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Session List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">User Behavior Tracker</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No sessions found</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    setSelectedSession(session)
                    setSelectedScreen(session.screenFlow[0] || null)
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedSession?.id === session.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {session.userId.substring(0, 12)}...
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatTimeAgo(session.startTime)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 uppercase">{session.device}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {session.screenFlow.length} screens
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Controls Bar - Mobile-shaped container */}
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto w-[440px] max-w-full p-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('replay')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'replay'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Session Replay
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics Suite
              </button>
            </div>

            {activeTab === 'replay' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setHeatmapMode(!heatmapMode)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      heatmapMode
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {heatmapMode ? 'Heatmap Mode' : 'Replay Mode'}
                  </button>

                  {selectedSession && (
                    <select
                      value={selectedScreen?.screenName || ''}
                      onChange={(e) => {
                        const screen = selectedSession.screenFlow.find(
                          (s) => s.screenName === e.target.value
                        )
                        setSelectedScreen(screen || null)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Screen</option>
                      {selectedSession.screenFlow.map((screen) => (
                        <option key={screen.screenName} value={screen.screenName}>
                          {screen.screenName} ({Math.round(screen.timeSpent / 1000)}s)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  {selectedSession && selectedScreen && (
                    <>
                      Time spent: {Math.round(selectedScreen.timeSpent / 1000)}s | Clicks:{' '}
                      {selectedScreen.events.filter((e) => e.type === 'click').length}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-50 p-8 overflow-auto">
          {activeTab === 'heatmap' ? (
            <div className="mx-auto w-[440px] max-w-full">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Click Heatmap</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Visualize where all users click most frequently across all sessions
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Screen
                  </label>
                  <select
                    value={selectedHeatmapScreen}
                    onChange={(e) => setSelectedHeatmapScreen(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getAllScreenNames().map((screenName) => (
                      <option key={screenName} value={screenName}>
                        {screenName.charAt(0).toUpperCase() + screenName.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '844px' }}>
                <HeatmapView screenName={selectedHeatmapScreen} />
              </div>
            </div>
          ) : activeTab === 'replay' ? (
            <div
              ref={replayContainerRef}
              className="relative mx-auto w-[440px] max-w-full h-[844px] overflow-hidden rounded-[40px] bg-white shadow-2xl"
              style={{
                isolation: 'isolate', // Create new stacking context
              }}
            >
              {/* Constrain fixed elements to this container */}
              <style>{`
                #replay-container [class*="fixed"] {
                  position: absolute !important;
                }
                #replay-container nav[class*="fixed"] {
                  position: absolute !important;
                  left: 0 !important;
                  right: 0 !important;
                  width: 100% !important;
                }
              `}</style>
              <div id="replay-container" className="relative w-full h-full">
                {renderReplayScreen()}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-[440px] max-w-full space-y-6">
              {/* Engagement Metrics */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Engagement Metrics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Avg Session Duration</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {Math.round(engagementMetrics.avgSessionDuration / 1000)}s
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">Bounce Rate</div>
                    <div className="text-2xl font-bold text-red-900">
                      {engagementMetrics.bounceRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Avg Clicks/Session</div>
                    <div className="text-2xl font-bold text-green-900">
                      {engagementMetrics.avgClicksPerSession.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Avg Screens/Session</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {engagementMetrics.avgScreensPerSession.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Screen Time Analysis */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Screen Time Analysis</h2>
                <div className="space-y-3">
                  {screenTimeData.slice(0, 8).map((item, idx) => {
                    const maxTime = Math.max(...screenTimeData.map((d) => d.time), 1)
                    const percentage = (item.time / maxTime) * 100
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 truncate">{item.screen}</span>
                          <span className="text-gray-500">{Math.round(item.time / 1000)}s</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Click Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Click Distribution by Screen</h2>
                <div className="space-y-3">
                  {clickDistribution.slice(0, 8).map((item, idx) => {
                    const maxClicks = Math.max(...clickDistribution.map((d) => d.clicks), 1)
                    const percentage = (item.clicks / maxClicks) * 100
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 truncate">{item.screen}</span>
                          <span className="text-gray-500">{item.clicks} clicks</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* User Flow Diagram */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Flow Patterns</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {userFlowData.slice(0, 10).map((flow, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 text-sm">
                        <span className="font-medium text-gray-700">{flow.from}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className="font-medium text-gray-700">{flow.to}</span>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {flow.count}x
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll Depth Analysis */}
              {scrollDepthData.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Scroll Depth Analysis</h2>
                  <div className="space-y-3">
                    {scrollDepthData.slice(0, 8).map((item, idx) => {
                      const maxDepth = Math.max(...scrollDepthData.map((d) => d.avgDepth), 1)
                      const percentage = (item.avgDepth / maxDepth) * 100
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700 truncate">{item.screen}</span>
                            <span className="text-gray-500">{Math.round(item.avgDepth)}px</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Conversion Funnel */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Conversion Funnel</h2>
                <div className="space-y-4">
                  {['home', 'dropoff', 'selectVehicle', 'rideConfirmed'].map((screenName, idx) => {
                    const visits = sessions.reduce((count, session) => {
                      return count + (session.screenFlow.some((s) => s.screenName === screenName) ? 1 : 0)
                    }, 0)
                    const percentage = sessions.length > 0 ? (visits / sessions.length) * 100 : 0
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 capitalize">{screenName}</span>
                          <span className="text-gray-500">{visits} users ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Panel - Mobile-shaped container */}
        <div className="bg-white border-t border-gray-200">
          <div className="mx-auto w-[440px] max-w-full p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Sessions</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Avg Time to Book</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.averageTimeToBook / 1000)}s
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Most Confusing Screen</div>
                <div className="text-2xl font-bold text-gray-900 truncate">
                  {stats.mostConfusingScreen || 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Clicks</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalClicks}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

