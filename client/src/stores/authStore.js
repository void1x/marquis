import { create } from 'zustand'

const STORAGE_KEY = 'marquis_user'

export const useAuthStore = create((set) => ({
  user: null,
  isInitialized: false,

  initialize: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        set({ user: JSON.parse(stored), isInitialized: true })
      } else {
        set({ isInitialized: true })
      }
    } catch {
      set({ isInitialized: true })
    }
  },

  login: (name, email) => {
    const user = { name, email }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('marquis_chat')
    set({ user: null })
  },
}))
