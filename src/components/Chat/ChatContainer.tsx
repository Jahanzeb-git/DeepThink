import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import ChatInput from './ChatInput';
import TagInput from './TagInput';

interface Message {
  text: string;
  isBot: boolean;
  id: string;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatContainer({
  messages,
  isLoading,
  onSendMessage,
}: ChatContainerProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInitialState, setIsInitialState] = useState(true);

  React.useEffect(() => {
    if (messages.length > 0 && isInitialState) {
      setIsInitialState(false);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isInitialState]);

  const handleAddTag = (tag: string) => {
    setInputValue(tag);
  };

  return (
    <motion.div 
      className="flex-1 flex flex-col h-full bg-gray-800 dark:bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {isInitialState ? (
          <motion.div
            key="initial"
            className="flex-1 flex flex-col items-center justify-center p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900 mb-8">
              Hi, I'm DeepSeek
            </h1>
            <p className="text-gray-400 dark:text-gray-800 mb-12">
              How can I help you today?
            </p>
            <div className="w-full max-w-3xl px-4">
              <ChatInput
                onSendMessage={onSendMessage}
                value={inputValue}
                onChange={setInputValue}
              />
              <div className="mt-4 flex justify-center">
                <TagInput onAddTag={handleAddTag} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatMessage isBot={msg.isBot} message={msg.text} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-gray-400"
                >
                  <div className="animate-spin">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span>Thinking...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  onSendMessage={onSendMessage}
                  value={inputValue}
                  onChange={setInputValue}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.p
        className="text-center text-gray-400 mb-2 text-xs sm:text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        DeepThink can make mistakes. Check important info.
      </motion.p>
    </motion.div>
  );
}
