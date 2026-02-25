import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { AI_CHAT_CONFIG } from '../../lib/constants'

interface AIChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  loading?: boolean
  remainingMessages?: number | null
  placeholder?: string
}

/**
 * Chat input with send button and remaining messages counter.
 */
export default function AIChatInput({
  onSend,
  disabled = false,
  loading = false,
  remainingMessages,
  placeholder = 'Ask oStaran anything about AI...',
}: AIChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed || disabled || loading) return
    if (trimmed.length > AI_CHAT_CONFIG.MAX_MESSAGE_LENGTH) return

    onSend(trimmed)
    setMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const charsLeft = AI_CHAT_CONFIG.MAX_MESSAGE_LENGTH - message.length
  const isOverLimit = charsLeft < 0

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      {/* Remaining messages indicator */}
      {remainingMessages !== null && remainingMessages !== undefined && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] text-gray-400">
            {remainingMessages > 0 ? (
              `${remainingMessages} messages remaining today`
            ) : (
              <span className="text-orange-500 font-medium">Daily limit reached</span>
            )}
          </span>
          {isOverLimit && (
            <span className="text-[10px] text-red-500">
              {Math.abs(charsLeft)} chars over limit
            </span>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Chat unavailable' : placeholder}
          disabled={disabled || loading}
          rows={1}
          className="flex-1 resize-none px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400 min-h-[40px] max-h-[120px]"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || loading || isOverLimit}
          className="p-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}
