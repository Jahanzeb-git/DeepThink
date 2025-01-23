import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import ChatInput from './ChatInput';
import TagInput from './TagInput';
import { Brain } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isTyped: boolean;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatContainer({ messages, isLoading, onSendMessage }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(true);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleAddTag = (tag: string) => {
    setInputValue(tag);
  };

  const handleSend = async (message: string) => {
    setIsInputVisible(false);
    await onSendMessage(message);
    setTimeout(() => setIsInputVisible(true), 100);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900 dark:bg-gray-100 relative overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900 mb-4 md:mb-8 text-center">
            Hi, I'm DeepSeek
          </h1>
          <p className="text-gray-400 dark:text-gray-600 mb-8 md:mb-12 text-center">
            How can I help you today?
          </p>
          <div className="w-full max-w-3xl px-4 md:px-8">
            <ChatInput
              onSendMessage={handleSend}
              value={inputValue}
              onChange={setInputValue}
            />
            <div className="mt-6 overflow-x-auto pb-4 -mx-4 px-4 md:px-0 md:mx-0 hide-scrollbar">
              <TagInput onAddTag={handleAddTag} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 dark:scrollbar-thumb-gray-300 
              scrollbar-track-transparent"
          >
            <div className="max-w-3xl w-full mx-auto min-h-full flex flex-col">
              <div className="flex-1 p-4 md:p-6 space-y-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    isBot={msg.isBot}
                    message={msg.text}
                    isTyped={msg.isTyped}
                    onTypingComplete={() => {
                      msg.isTyped = true;
                    }}
                    containerRef={containerRef}
                  />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <div className="animate-spin">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span>Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-32" /> {/* Add padding at bottom */}
              </div>
            </div>
          </div>
          <div 
            className={`absolute bottom-0 left-0 right-0 transform transition-transform duration-300 ease-out
              ${isInputVisible ? 'translate-y-0' : 'translate-y-full'}`}
          >
            <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-gray-900 dark:from-gray-100 to-transparent pointer-events-none" />
            <div className="bg-gray-900 dark:bg-gray-100">
              <div className="max-w-3xl mx-auto px-4 md:px-6 pb-4 md:pb-6">
                <ChatInput
                  onSendMessage={handleSend}
                  value={inputValue}
                  onChange={setInputValue}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

