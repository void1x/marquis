import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuthStore } from '../stores/authStore.js'
import { useChatStore } from '../stores/chatStore.js'

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 message-enter">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-base">
        🎩
      </div>
      <div className="chat-bubble-marquis flex items-center gap-1 py-3 px-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
        <span className="text-slate-400 text-xs ml-2 italic">Marquis is pondering your life choices...</span>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-base">
          🎩
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow">
          U
        </div>
      )}

      {isUser ? (
        <div className="chat-bubble-user">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </div>
      ) : (
        <div className="chat-bubble-marquis">
          <div className="marquis-content text-sm">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const messages = useChatStore((s) => s.messages)
  const isLoading = useChatStore((s) => s.isLoading)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const clearChat = useChatStore((s) => s.clearChat)

  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus()
  }, [isLoading])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-lg">
            🎩
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white leading-tight">Marquis</h1>
            <p className="text-slate-400 text-xs">Study Abroad Advisor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden sm:block text-slate-400 text-xs">
              {user.name}
            </span>
          )}
          <button
            onClick={clearChat}
            className="btn-ghost text-xs"
            title="Clear conversation"
          >
            Clear
          </button>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="btn-ghost text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-900/20"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input bar */}
      <footer className="flex-shrink-0 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              id="chat-input"
              rows={1}
              className="input-field resize-none pr-3 overflow-hidden leading-relaxed"
              style={{ minHeight: '48px', maxHeight: '160px' }}
              placeholder="Ask Marquis anything about studying abroad..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          <button
            id="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn-primary flex-shrink-0 px-5 py-3 flex items-center gap-1.5"
          >
            <span className="hidden sm:inline text-sm">Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.903 6.156a.75.75 0 01-.362 1.017 1.5 1.5 0 000 2.713.75.75 0 01.362 1.017l-1.903 6.156a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-slate-600 text-xs mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </footer>
    </div>
  )
}
