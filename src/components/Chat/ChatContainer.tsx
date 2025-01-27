import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import ChatInput from './ChatInput';
import TagInput from './TagInput';
import ImageCarousel from './Slideshow';
import { Brain } from 'lucide-react';

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
  const typingScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isDeepThinkEnabled, setIsDeepThinkEnabled] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto' 
      });
    }
  }, []);

  // Check if any message is currently being typed
  const isAnyMessageTyping = messages.some(msg => !msg.isTyped);

  // Manage typing scroll interval
  useEffect(() => {
    // Clear any existing interval
    if (typingScrollIntervalRef.current) {
      clearInterval(typingScrollIntervalRef.current);
    }

    // If messages are being typed and user is not scrolling
    if (isAnyMessageTyping && !isUserScrolling) {
      // Start interval to scroll every 500ms
      typingScrollIntervalRef.current = setInterval(() => {
        scrollToBottom(true);
      }, 500);

      // Cleanup interval when component unmounts or conditions change
      return () => {
        if (typingScrollIntervalRef.current) {
          clearInterval(typingScrollIntervalRef.current);
        }
      };
    }
  }, [isAnyMessageTyping, isUserScrolling, scrollToBottom]);

  // Scroll to bottom when new messages are added and not typing
  useEffect(() => {
    if (!isAnyMessageTyping) {
      scrollToBottom();
    }
  }, [messages, isAnyMessageTyping, scrollToBottom]);

  // Scroll event handling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsUserScrolling(true);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = async (message: string, isDeepThinkEnabled: boolean, isImageMode: boolean) => {
    await onSendMessage(message, isDeepThinkEnabled, isImageMode);
    setInputValue('');
  };

  const handleAddTag = (tag: string) => {
    setInputValue(tag);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-800 dark:bg-gray-100 relative">
      <div className="absolute inset-0 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900 mb-4 md:mb-8 text-center">
              Hi, I'm DeepSeek
            </h1>
            <div className="w-full h-64 md:h-96">
              <ImageCarousel />
            </div>
            <p className="text-gray-400 dark:text-gray-800 mb-8 md:mb-12 text-center">
              How can I help you today?
            </p>
            <div className="w-full max-w-3xl px-4 md:px-8">
              <ChatInput
                onSendMessage={handleSendMessage}
                value={inputValue}
                onChange={setInputValue}
                isDeepThinkEnabled={isDeepThinkEnabled}
                onToggleDeepThink={() => setIsDeepThinkEnabled(prev => !prev)}
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
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-800/95 dark:bg-gray-100/95 backdrop-blur-sm">
              {/* Fade Area */}
              <div className="absolute top-[-30px] left-0 right-0 h-8 bg-gradient-to-t from-gray-800/95 dark:from-gray-100/95 to-transparent pointer-events-none">
              </div>
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  value={inputValue}
                  onChange={setInputValue}
                  isDeepThinkEnabled={isDeepThinkEnabled}
                  onToggleDeepThink={() => setIsDeepThinkEnabled(prev => !prev)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

