import React, { useRef, useEffect, useState } from 'react';
import { Brain, ArrowUp, Mic, ImageIcon, Upload } from 'lucide-react';

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
  const [activeMode, setActiveMode] = useState<'chat' | 'image'>('chat');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file);
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
          placeholder={activeMode === 'chat' ? "Message DeepSeek..." : "Describe the image you want to generate..."}
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
              onClick={() => setActiveMode('chat')}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2
                ${activeMode === 'chat' 
                  ? 'bg-blue-500/20 text-blue-500' 
                  : 'hover:bg-gray-600 dark:hover:bg-gray-400 text-gray-100 dark:text-gray-800'}`}
              title="DeepThink"
            >
              <Brain className="w-5 h-5" />
              {activeMode === 'chat' && <span className="text-sm">R1</span>}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('image')}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2
                ${activeMode === 'image' 
                  ? 'bg-purple-500/20 text-purple-500' 
                  : 'hover:bg-gray-600 dark:hover:bg-gray-400 text-gray-100 dark:text-gray-800'}`}
              title="Image Generation"
            >
              <ImageIcon className="w-5 h-5" />
              {activeMode === 'image' && <span className="text-sm">Gen</span>}
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className="p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400 
                     text-gray-100 dark:text-gray-800 transition-colors"
              title="Upload file"
            >
              <Upload className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
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
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 
                   text-white transition-colors"
            title="Send message"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
