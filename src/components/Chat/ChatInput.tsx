import React, { useRef, useEffect } from 'react';
import { Brain, Search, Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  value: string; // Controlled input value
  onChange: (value: string) => void; // Change handler
  className?: string;
}

export default function ChatInput({
  onSendMessage,
  value,
  onChange,
  className = '',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [value]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      await onSendMessage(value);
      onChange(''); // Clear input after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-gray-700 dark:bg-gray-300 rounded-3xl border border-gray-700 dark:border-gray-300 p-4"
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message DeepSeek..."
          className="w-full max-h-[350px] overflow-y-auto p-4 mb-12 rounded-xl resize-none 
            bg-gray-700 dark:bg-gray-300
            text-gray-100 dark:text-gray-800
            border-none
            focus:outline-none focus:ring-0
            whitespace-pre-wrap
            scrollbar-thin scrollbar-thumb-gray-600 dark:scrollbar-thumb-gray-400"
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-2 bg-gray-700 dark:bg-gray-300 rounded-b-xl">
          <div className="flex items-center gap-2">
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
          </div>
          <button
            type="submit"
            className="p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400 
                   text-gray-100 dark:text-gray-800 transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>
    </form>
  );
}
