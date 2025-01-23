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
      const newHeight = Math.min(textareaRef.current.scrollHeight, window.innerWidth < 768 ? 150 : 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      await onSendMessage(value);
      onChange('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
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
      className={`relative bg-gray-800/80 dark:bg-gray-200/80 backdrop-blur-lg rounded-2xl 
        shadow-lg transition-all duration-200 ${className}`}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message DeepSeek..."
          className="w-full min-h-[60px] max-h-[200px] md:max-h-[250px] overflow-y-auto pt-4 pb-16 px-4 rounded-t-2xl 
            bg-transparent text-gray-100 dark:text-gray-800 resize-none
            border-none focus:outline-none focus:ring-0
            placeholder-gray-500 dark:placeholder-gray-400"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 
          bg-gray-700/50 dark:bg-gray-300/50 backdrop-blur-sm rounded-b-2xl">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-gray-600/50 dark:hover:bg-gray-400/50
                text-gray-300 dark:text-gray-600 transition-colors"
              title="DeepThink"
            >
              <Brain className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-gray-600/50 dark:hover:bg-gray-400/50
                text-gray-300 dark:text-gray-600 transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-gray-600/50 dark:hover:bg-gray-400/50
                text-gray-300 dark:text-gray-600 transition-colors"
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 
              text-white transition-all duration-200 hover:scale-105"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
