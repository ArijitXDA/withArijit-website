import React from 'react'
import { Bot, User } from 'lucide-react'

interface AIChatMessageProps {
  role: 'user' | 'assistant' | 'system'
  message: string
  timestamp?: string
}

/**
 * Chat message bubble with different styling for user vs assistant.
 */
export default function AIChatMessage({ role, message, timestamp }: AIChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gradient-to-br from-orange-500 to-amber-500 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}
      >
        {/* Render message - support basic line breaks */}
        {message.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < message.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}

        {/* Timestamp */}
        {timestamp && (
          <div
            className={`text-[10px] mt-1 ${
              isUser ? 'text-blue-200' : 'text-gray-400'
            }`}
          >
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  )
}
