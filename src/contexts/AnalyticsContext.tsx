import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import type { Screen } from '../types'

// Event types for analytics
export interface AnalyticsEvent {
  type: 'click' | 'move' | 'scroll'
  x: number
  y: number
  target?: string
  timestamp: number
}

// Screen flow entry
export interface ScreenFlowEntry {
  screenName: string
  timestamp: number
  timeSpent: number
  events: AnalyticsEvent[]
}

// Session data structure matching the specification
export interface Session {
  id: string
  userId: string
  startTime: number
  device: string
  screenFlow: ScreenFlowEntry[]
}

interface AnalyticsContextType {
  currentScreen: Screen | null
  setCurrentScreen: (screen: Screen) => void
  isTracking: boolean
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

// Generate or retrieve anonymous user ID
const getAnonymousId = (): string => {
  const stored = localStorage.getItem('analytics_userId')
  if (stored) {
    return stored
  }
  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('analytics_userId', newId)
  return newId
}

// Detect device type
const getDeviceType = (): string => {
  const width = window.innerWidth
  return width < 768 ? 'mobile' : 'desktop'
}

// Throttle function for mouse move events
const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreenState] = useState<Screen | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  // Buffer for events
  const eventBufferRef = useRef<AnalyticsEvent[]>([])
  const screenFlowRef = useRef<ScreenFlowEntry[]>([])
  const currentScreenRef = useRef<Screen | null>(null)
  const screenStartTimeRef = useRef<number>(Date.now())
  const sessionStartTimeRef = useRef<number>(Date.now())
  const flushIntervalRef = useRef<number | null>(null)
  const userIdRef = useRef<string>(getAnonymousId())
  const deviceRef = useRef<string>(getDeviceType())

  // Flush buffer to Firestore
  const flushToFirestore = async () => {
    // If we have a current screen, add any pending events to it
    if (currentScreenRef.current && eventBufferRef.current.length > 0) {
      const existingScreenFlow = screenFlowRef.current.find(
        (entry) => entry.screenName === currentScreenRef.current
      )

      if (existingScreenFlow) {
        // Add events to existing entry
        existingScreenFlow.events.push(...eventBufferRef.current)
      } else {
        // Create new entry for current screen
        const timeSpent = Date.now() - screenStartTimeRef.current
        screenFlowRef.current.push({
          screenName: currentScreenRef.current,
          timestamp: screenStartTimeRef.current,
          timeSpent,
          events: [...eventBufferRef.current],
        })
      }
    }

    // Only flush if we have screen flow data
    if (screenFlowRef.current.length === 0) {
      eventBufferRef.current = []
      return
    }

    // Prepare session data
    const sessionData: Omit<Session, 'id'> = {
      userId: userIdRef.current,
      startTime: sessionStartTimeRef.current,
      device: deviceRef.current,
      screenFlow: screenFlowRef.current.map((entry) => ({
        ...entry,
        events: [...entry.events], // Ensure events array is copied
      })),
    }

    try {
      // Write to Firestore
      await addDoc(collection(db, 'sessions'), {
        ...sessionData,
        createdAt: serverTimestamp(),
      })

      // Clear event buffer (events are already in screenFlow)
      eventBufferRef.current = []
      // Note: We keep screenFlowRef with events for the session
    } catch (error) {
      console.error('Failed to flush analytics to Firestore:', error)
    }
  }

  // Set current screen and track screen changes
  const setCurrentScreen = (screen: Screen) => {
    // Finalize previous screen
    if (currentScreenRef.current) {
      const timeSpent = Date.now() - screenStartTimeRef.current
      const existingScreenFlow = screenFlowRef.current.find(
        (entry) => entry.screenName === currentScreenRef.current
      )

      // Get events for the current screen (filter by current screen's timestamp range)
      const screenEvents = eventBufferRef.current.filter(
        (event) => event.timestamp >= screenStartTimeRef.current && event.timestamp <= Date.now()
      )

      if (existingScreenFlow) {
        existingScreenFlow.timeSpent += timeSpent
        existingScreenFlow.events.push(...screenEvents)
      } else {
        screenFlowRef.current.push({
          screenName: currentScreenRef.current,
          timestamp: screenStartTimeRef.current,
          timeSpent,
          events: [...screenEvents],
        })
      }

      // Remove events that were assigned to this screen from buffer
      eventBufferRef.current = eventBufferRef.current.filter(
        (event) => !(event.timestamp >= screenStartTimeRef.current && event.timestamp <= Date.now())
      )
    }

    // Start new screen
    currentScreenRef.current = screen
    screenStartTimeRef.current = Date.now()
    setCurrentScreenState(screen)
  }

  // Track click events
  const trackClick = (e: MouseEvent) => {
    if (!isTracking) return

    const target = e.target as HTMLElement
    const targetText = target.innerText || target.getAttribute('aria-label') || target.tagName

    // Normalize coordinates to [0,1] relative to viewport so they can be replayed
    // inside the fixed phone frame on the dashboard.
    const normX = window.innerWidth > 0 ? e.clientX / window.innerWidth : 0
    const normY = window.innerHeight > 0 ? e.clientY / window.innerHeight : 0

    const event: AnalyticsEvent = {
      type: 'click',
      x: Math.max(0, Math.min(1, normX)),
      y: Math.max(0, Math.min(1, normY)),
      target: targetText.substring(0, 100), // Limit length
      timestamp: Date.now(),
    }

    eventBufferRef.current.push(event)
  }

  // Track mouse move (throttled)
  const trackMouseMove = throttle((e: MouseEvent) => {
    if (!isTracking) return

    const normX = window.innerWidth > 0 ? e.clientX / window.innerWidth : 0
    const normY = window.innerHeight > 0 ? e.clientY / window.innerHeight : 0

    const event: AnalyticsEvent = {
      type: 'move',
      x: Math.max(0, Math.min(1, normX)),
      y: Math.max(0, Math.min(1, normY)),
      timestamp: Date.now(),
    }

    eventBufferRef.current.push(event)
  }, 100) // 100ms throttle

  // Track scroll depth
  const trackScroll = () => {
    if (!isTracking) return

    const scrollDepth = window.scrollY || document.documentElement.scrollTop
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = maxScroll > 0 ? (scrollDepth / maxScroll) * 100 : 0

    const event: AnalyticsEvent = {
      type: 'scroll',
      x: window.innerWidth / 2, // Center of viewport
      y: scrollDepth,
      target: `${Math.round(scrollPercent)}%`,
      timestamp: Date.now(),
    }

    eventBufferRef.current.push(event)
  }

  // Initialize tracking
  useEffect(() => {
    // Don't track on dashboard
    if (window.location.pathname === '/dashboard') {
      setIsTracking(false)
      return
    }

    setIsTracking(true)
    sessionStartTimeRef.current = Date.now()

    // Add event listeners
    document.addEventListener('click', trackClick)
    document.addEventListener('mousemove', trackMouseMove)
    window.addEventListener('scroll', trackScroll, { passive: true })

    // Set up periodic flush (every 10 seconds)
    flushIntervalRef.current = window.setInterval(() => {
      flushToFirestore()
    }, 10000)

    // Flush on page unload
    const handleBeforeUnload = () => {
      flushToFirestore()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      // Cleanup
      document.removeEventListener('click', trackClick)
      document.removeEventListener('mousemove', trackMouseMove)
      window.removeEventListener('scroll', trackScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      if (flushIntervalRef.current) {
        clearInterval(flushIntervalRef.current)
      }

      // Final flush on unmount
      flushToFirestore()
    }
  }, [])

  return (
    <AnalyticsContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isTracking,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

