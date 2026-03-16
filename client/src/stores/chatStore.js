import { create } from 'zustand'
import axios from 'axios'

const STORAGE_KEY = 'marquis_chat'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'model',
  content:
    "Ah, a new student graces me with their presence. 🎩\n\nWelcome, darling. I'm **Marquis** — your frighteningly well-informed study abroad advisor. I know about universities, visas, deadlines, and the seventeen ways students ruin their SOPs.\n\nTell me: where in the world are you hoping to study, and how spectacularly unprepared are you? Be honest. I'll find out anyway.",
  timestamp: Date.now(),
}

function loadMessages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return [WELCOME_MESSAGE]
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {}
}

export const useChatStore = create((set, get) => ({
  messages: loadMessages(),
  isLoading: false,

  clearChat: () => {
    const fresh = [WELCOME_MESSAGE]
    saveMessages(fresh)
    set({ messages: fresh })
  },

  sendMessage: async (text) => {
    const trimmed = text.trim()
    if (!trimmed || get().isLoading) return

    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }

    const updatedWithUser = [...get().messages, userMsg]
    set({ messages: updatedWithUser, isLoading: true })
    saveMessages(updatedWithUser)

    // Build history for API (exclude the welcome message and current user msg)
    const historyMsgs = get().messages.filter((m) => m.id !== 'welcome')
    const history = historyMsgs.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const { data } = await axios.post(`${API_URL}/api/chat`, {
        message: trimmed,
        history,
      })

      const marquísMsg = {
        id: `m_${Date.now()}`,
        role: 'model',
        content: data.response,
        timestamp: Date.now(),
      }

      const finalMessages = [...updatedWithUser, marquísMsg]
      saveMessages(finalMessages)
      set({ messages: finalMessages, isLoading: false })
    } catch {
      const errorMsg = {
        id: `e_${Date.now()}`,
        role: 'model',
        content:
          "Good heavens, it seems my brain has momentarily short-circuited. Do try again in a moment, darling.",
        timestamp: Date.now(),
      }
      const finalMessages = [...updatedWithUser, errorMsg]
      saveMessages(finalMessages)
      set({ messages: finalMessages, isLoading: false })
    }
  },
}))
