import React from 'react';
import { Brain, Search, Send, Mic } from 'lucide-react';

interface InitialInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

export function InitialInput({ onSendMessage }: InitialInputProps) {
  return (
    <div className="w-full max-w-3xl px-4">
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector('input');
        if (input && input.value.trim()) {
          onSendMessage(input.value);
          input.value = '';
        }
      }} className="relative">
        <input
          type="text"
          placeholder="Message DeepSeek..."
          className="w-full p-4 pr-36 rounded-xl bg-gray-700 text-gray-100 border border-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200 ease-in-out"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-600 text-gray-400 transition-colors"
            title="DeepThink"
          >
            <Brain className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-600 text-gray-400 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-600 text-gray-400 transition-colors"
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="p-2 rounded-lg hover:bg-gray-600 transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </form>
    </div>
  );
}