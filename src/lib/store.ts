import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  subscriptionTier: 'free' | 'premium' | 'premium_plus'
  onboardingCompleted: boolean
  createdAt: Date
}

export interface DailyProgress {
  id: string
  date: string
  morningCompleted: boolean
  eveningCompleted: boolean
  physicalActivity?: string
  spiritualReading: boolean
  prayerTime: number
  gratitudeEntries: string[]
  energyLevel: number
  moodRating: number
  dailyWins: string[]
  growthAreas: string[]
  tomorrowIntentions: string[]
  streakCount: number
}

export interface LifeAuditResults {
  id: string
  physicalScore: number
  mentalScore: number
  spiritualScore: number
  relationalScore: number
  financialScore: number
  creativeScore: number
  legacyScore: number
  totalScore: number
  responses: Record<string, any>
  createdAt: Date
}

export interface AccountabilityPartner {
  id: string
  name: string
  avatarUrl?: string
  compatibilityScore: number
  lastInteraction?: Date
  status: 'pending' | 'active' | 'paused' | 'ended'
}

export interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  
  // Progress tracking
  currentStreak: number
  todaysProgress: DailyProgress | null
  auditResults: LifeAuditResults | null
  
  // Accountability
  partner: AccountabilityPartner | null
  
  // UI state
  isLoading: boolean
  currentPage: string
  
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  updateStreak: (streak: number) => void
  updateDailyProgress: (progress: DailyProgress) => void
  setAuditResults: (results: LifeAuditResults) => void
  setPartner: (partner: AccountabilityPartner | null) => void
  setLoading: (loading: boolean) => void
  setCurrentPage: (page: string) => void
  
  // Daily actions
  completeMorningRoutine: () => void
  completeEveningReflection: () => void
  logGratitude: (entry: string) => void
  logDailyWin: (win: string) => void
  updateEnergyLevel: (level: number) => void
  updateMoodRating: (rating: number) => void
  
  // Reset actions
  resetDailyProgress: () => void
  clearUserData: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  currentStreak: 0,
  todaysProgress: null,
  auditResults: null,
  partner: null,
  isLoading: false,
  currentPage: 'dashboard'
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // User actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      
      // Progress actions
      updateStreak: (currentStreak) => set({ currentStreak }),
      updateDailyProgress: (todaysProgress) => set({ todaysProgress }),
      setAuditResults: (auditResults) => set({ auditResults }),
      setPartner: (partner) => set({ partner }),
      
      // UI actions
      setLoading: (isLoading) => set({ isLoading }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      
      // Daily actions
      completeMorningRoutine: () => {
        const { todaysProgress } = get()
        if (todaysProgress) {
          const updated = {
            ...todaysProgress,
            morningCompleted: true,
            streakCount: todaysProgress.streakCount + 1
          }
          set({ 
            todaysProgress: updated,
            currentStreak: updated.streakCount
          })
        }
      },
      
      completeEveningReflection: () => {
        const { todaysProgress } = get()
        if (todaysProgress) {
          const updated = { ...todaysProgress, eveningCompleted: true }
          set({ todaysProgress: updated })
        }
      },
      
      logGratitude: (entry) => {
        const { todaysProgress } = get()
        if (todaysProgress) {
          const updated = {
            ...todaysProgress,
            gratitudeEntries: [...todaysProgress.gratitudeEntries, entry]
          }
          set({ todaysProgress: updated })
        }
      },
      
      logDailyWin: (win) => {
        const { todaysProgress } = get()
        if (todaysProgress) {
          const updated = {
            ...todaysProgress,
            dailyWins: [...todaysProgress.dailyWins, win]
          }
          set({ todaysProgress: updated })
        }
      },
      
      updateEnergyLevel: (level) => {
        const { todaysProgress } = get()
        if (todaysProgress) {
          const updated = { ...todaysProgress, energyLevel: level }
          set({ todaysProgress: updated })
        }
      },
      
      updateMoodRating: (rating) => {
        const { todaysProgress } = get()
        if (todaysProgress) {
          const updated = { ...todaysProgress, moodRating: rating }
          set({ todaysProgress: updated })
        }
      },
      
      // Reset actions
      resetDailyProgress: () => set({ todaysProgress: null }),
      clearUserData: () => set(initialState),
    }),
    {
      name: 'ascend-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentStreak: state.currentStreak,
        auditResults: state.auditResults,
        partner: state.partner,
      }),
    }
  )
)
