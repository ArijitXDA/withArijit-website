import React, { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { AI_CHAT_CONFIG } from '../../lib/constants'
import AIChatMessage from './AIChatMessage'
import AIChatInput from './AIChatInput'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  message: string
  timestamp: string
}

/**
 * Floating AI Chat widget - bottom-right expandable chat panel.
 * Brand: oStaran - The AI Assistant
 */
export default function AIChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null)
  const [sessionId] = useState(() => `session_${crypto.randomUUID()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          message: `Hi there! I'm ${AI_CHAT_CONFIG.AGENT_NAME}, ${AI_CHAT_CONFIG.AGENT_SUBTITLE}. I can help you with questions about AI courses, concepts, and career guidance. How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }, [isOpen])

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!user) return

      // Add user message to UI
      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        message: text,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setLoading(true)

      try {
        // Call edge function
        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: {
            message: text,
            session_id: sessionId,
            history: messages
              .filter((m) => m.id !== 'welcome')
              .slice(-10) // Send last 10 messages for context
              .map((m) => ({ role: m.role, content: m.message })),
          },
        })

        if (error) throw error

        // Add assistant response
        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          message: data?.message || 'Sorry, I could not process your request.',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMsg])

        // Update remaining messages
        if (data?.remaining_messages !== undefined) {
          setRemainingMessages(data.remaining_messages)
        }
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          message:
            'Sorry, I encountered an error. Please try again or contact AI@withArijit.com for support.',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setLoading(false)
      }
    },
    [user, sessionId, messages]
  )

  // Not signed in - show prompt
  if (!user) {
    return (
      <>
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-110"
          title="Chat with oStaran"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>

        {/* Prompt Panel */}
        {isOpen && (
          <div className="fixed bottom-40 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4">
              <h3 className="font-bold">{AI_CHAT_CONFIG.AGENT_NAME}</h3>
              <p className="text-sm text-orange-100">{AI_CHAT_CONFIG.AGENT_SUBTITLE}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Sign up to chat with {AI_CHAT_CONFIG.AGENT_NAME} and get personalized AI guidance.
              </p>
              <a
                href="/signup"
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setIsMinimized(false)
        }}
        className={`fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-110 ${
          isOpen ? 'hidden' : ''
        }`}
        title="Chat with oStaran"
      >
        <MessageCircle className="w-6 h-6" />
        {/* Unread indicator */}
        {messages.length > 1 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed right-6 z-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized
              ? 'bottom-24 w-80 h-14'
              : 'bottom-24 w-96 h-[500px] max-h-[70vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{AI_CHAT_CONFIG.AGENT_NAME}</h3>
                <p className="text-[10px] text-orange-100">{AI_CHAT_CONFIG.AGENT_SUBTITLE}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <AIChatMessage
                    key={msg.id}
                    role={msg.role}
                    message={msg.message}
                    timestamp={msg.timestamp}
                  />
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs">{AI_CHAT_CONFIG.AGENT_NAME} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <AIChatInput
                onSend={handleSendMessage}
                loading={loading}
                disabled={remainingMessages === 0}
                remainingMessages={remainingMessages}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
