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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Ensure scroll on new content being typed
  useEffect(() => {
    const observer = new MutationObserver(scrollToBottom);
    const container = containerRef.current;

    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  const handleAddTag = (tag: string) => {
    setInputValue(tag);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-800 dark:bg-gray-100">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900 mb-4 md:mb-8 text-center">
            Hi, I'm DeepSeek
          </h1>
          <p className="text-gray-400 dark:text-gray-800 mb-8 md:mb-12 text-center">
            How can I help you today?
          </p>
          <div className="w-full max-w-3xl px-4 md:px-8">
            <ChatInput
              onSendMessage={onSendMessage}
              value={inputValue}
              onChange={setInputValue}
            />
            <div className="mt-4 flex justify-center">
              <TagInput onAddTag={handleAddTag} />
            </div>
          </div>
          <p className="absolute bottom-0 left-0 right-0 text-center text-gray-400 py-1 bg-gray-800/95 dark:bg-gray-100/95">
            <span className="block sm:hidden text-xs">DeepThink can make mistakes.</span>
            <span className="hidden sm:block text-xs sm:text-sm">
              DeepThink can make mistakes. Check important info.
            </span>
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
            style={{ paddingBottom: 'calc(6rem + 80px)' }} // Adjust based on input height
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
            <div ref={messagesEndRef} className="h-1" />
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 dark:bg-gray-100/95 backdrop-blur-sm">
            <div className="h-8 bg-gradient-to-t from-gray-800/95 dark:from-gray-100/95 to-transparent" />
            <div className="p-4">
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  onSendMessage={onSendMessage}
                  value={inputValue}
                  onChange={setInputValue}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

