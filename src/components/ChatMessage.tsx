import React from 'react';

interface ChatMessageProps {
  isBot: boolean;
  message: string;
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isBot
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            : 'bg-blue-500 text-white'
        }`}
      >
        {message}
      </div>
    </div>
  );
}