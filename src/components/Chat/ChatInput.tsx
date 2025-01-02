import React, { useState } from 'react';
import { Brain, Search, Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  className?: string;
}

export function ChatInput({ onSendMessage, className = '' }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      await onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative`}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message DeepSeek..."
        className="w-full p-4 pr-36 rounded-xl 
      bg-gray-700 dark:bg-gray-300
      text-gray-100 dark:text-gray-800
      border border-gray-700 dark:border-gray-300
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition-all duration-200 ease-in-out"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400 
                 text-gray-100 dark:text-gray-800 transition-colors"
          title="DeepThink"
        >
          <Brain className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400 
                 text-gray-100 dark:text-gray-800 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400 
                 text-gray-100 dark:text-gray-800 transition-colors"
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400 
                 text-gray-100 dark:text-gray-800 transition-colors"
          title="Send message"
        >
          <Send className="w-5 h-5 text-blue-500" />
        </button>
      </div>
    </form>
  );
}
