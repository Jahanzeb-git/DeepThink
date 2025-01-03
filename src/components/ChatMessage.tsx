import React from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

interface ChatMessageProps {
  isBot: boolean;
  message: string; // Message can be plain text or Markdown
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isBot
            ? 'bg-gray-700 text-gray-100'
            : 'bg-blue-600 text-white'
        }`}
      >
        {isBot ? (
          <ReactMarkdown>{message}</ReactMarkdown> // Render Markdown for bot messages
        ) : (
          message // Render plain text for user messages
        )}
      </div>
    </div>
  );
}
