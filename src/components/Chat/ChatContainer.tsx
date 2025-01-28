import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import ChatInput from './ChatInput';
import TagInput from './TagInput';
import ImageCarousel from './Slideshow';
import { Brain, ImageIcon } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isTyped: boolean;
  isDeepThinkEnabled: boolean;
  imageBase64?: string;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string, isDeepThinkEnabled: boolean, isImageMode: boolean) => Promise<void>;
}

export function ChatContainer({ messages, isLoading, onSendMessage }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isDeepThinkEnabled, setIsDeepThinkEnabled] = useState(false);
  const [mode, setMode] = useState<'text' | 'image'>('text');

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (message: string, isDeepThinkEnabled: boolean, isImageMode: boolean) => {
    await onSendMessage(message, isDeepThinkEnabled, isImageMode);
    setInputValue('');
  };

  const handleAddTag = (tag: string) => {
    setInputValue(tag);
  };

  const handleModeChange = (newMode: 'text' | 'image') => {
    setMode(newMode);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black dark:bg-gray-100 relative">
      <div className="absolute inset-0 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-between p-4 md:p-8">
            {/* Content Area with fixed height */}
            <div className="flex-1 flex flex-col items-center justify-center" style={{ minHeight: '210px' }}>
              {mode === 'text' ? (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900 mb-4 md:mb-8 text-center transition-all duration-500 ease-in-out">
                    Hi, I'm DeepSeek
                  </h1>
                  <p className="text-gray-400 dark:text-gray-800 text-center transition-all duration-500 ease-in-out">
                    How can I help you today?
                  </p>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageCarousel />
                </div>
              )}
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="w-full max-w-3xl mx-auto">
              <ChatInput
                onSendMessage={handleSendMessage}
                value={inputValue}
                onChange={setInputValue}
                isDeepThinkEnabled={isDeepThinkEnabled}
                onToggleDeepThink={() => setIsDeepThinkEnabled(prev => !prev)}
                onModeChange={handleModeChange}
                mode={mode}
              />
              <div className="mt-4 flex justify-center">
                <TagInput onAddTag={handleAddTag} />
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-400 py-1 mt-4 bg-gray-800/95 dark:bg-gray-100/95">
              <span className="block sm:hidden text-xs">DeepThink can make mistakes.</span>
              <span className="hidden sm:block text-xs sm:text-sm">
                DeepThink can make mistakes. Check important info.
              </span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-gray-600 dark:scrollbar-thumb-gray-400"
            >
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  isBot={msg.isBot}
                  message={msg.text}
                  isTyped={msg.isTyped}
                  onTypingComplete={() => {
                    msg.isTyped = true;
                  }}
                  containerRef={messagesContainerRef}
                  isDeepThinkEnabled={msg.isDeepThinkEnabled}
                  imageBase64={msg.imageBase64}
                />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="animate-spin">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span>{mode === 'image' ? 'Generating...' : 'Thinking...'}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-800/95 dark:bg-gray-100/95 backdrop-blur-sm">
              <div className="absolute top-[-30px] left-0 right-0 h-8 bg-gradient-to-t from-gray-800/95 dark:from-gray-100/95 to-transparent pointer-events-none">
              </div>
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  value={inputValue}
                  onChange={setInputValue}
                  isDeepThinkEnabled={isDeepThinkEnabled}
                  onToggleDeepThink={() => setIsDeepThinkEnabled(prev => !prev)}
                  onModeChange={handleModeChange}
                  mode={mode}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

