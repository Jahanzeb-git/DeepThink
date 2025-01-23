import React, { useRef, useEffect } from 'react';
import { Brain, Search, Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  value: string;
  onChange: (value: string) => void;
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
      onChange('');
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
      className={`relative bg-gray-700 dark:bg-gray-300 rounded-2xl border border-gray-600 dark:border-gray-400 
        shadow-lg ${className}`}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message DeepSeek..."
          className="w-full max-h-[150px] overflow-y-auto pt-4 pb-14 px-4 rounded-t-2xl resize-none 
            bg-transparent text-gray-100 dark:text-gray-800
            border-none focus:outline-none focus:ring-0
            placeholder-gray-400 dark:placeholder-gray-600"
          style={{ minHeight: '60px' }}
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 
          bg-gray-600/50 dark:bg-gray-400/50 backdrop-blur-sm rounded-b-2xl">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-gray-500/50 dark:hover:bg-gray-300/50
                text-gray-300 dark:text-gray-700 transition-colors"
              title="DeepThink"
            >
              <Brain className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-gray-500/50 dark:hover:bg-gray-300/50
                text-gray-300 dark:text-gray-700 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-gray-500/50 dark:hover:bg-gray-300/50
                text-gray-300 dark:text-gray-700 transition-colors"
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 
              text-white transition-colors"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
