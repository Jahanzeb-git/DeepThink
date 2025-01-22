import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  isTyped: boolean;
  onTypingComplete: () => void;
}

export function ChatMessage({ message, isBot, isTyped, onTypingComplete }: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Typing animation logic
  const animateTyping = useCallback(() => {
    if (!isBot || isTyped) {
      setDisplayedText(message);
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;
    const textLength = message.length;

    const typeNextChar = () => {
      if (currentIndex < textLength) {
        setDisplayedText(prev => message.slice(0, currentIndex + 1));
        currentIndex++;
        
        // Vary typing speed slightly for natural feel
        const delay = Math.random() * 20 + 10;
        typingRef.current = setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        onTypingComplete();
      }
    };

    typeNextChar();

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [message, isBot, isTyped, onTypingComplete]);

  useEffect(() => {
    animateTyping();
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [animateTyping]);

  // Copy message to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isBot ? 'bg-gray-900/50' : ''} p-4 rounded-lg`}
      ref={messageRef}
    >
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'
        }`}>
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="font-medium text-sm text-gray-400 mb-1">
          {isBot ? 'AI Assistant' : 'You'}
        </div>
        
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-200 leading-relaxed">
            {isBot && !isTyped ? (
              <>
                {displayedText}
                {isTyping && (
                  <span className="inline-flex ml-1">
                    <AnimatePresence>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-1 h-4 bg-emerald-500 inline-block"
                      />
                    </AnimatePresence>
                  </span>
                )}
              </>
            ) : (
              message
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-2 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={copyToClipboard}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </motion.div>
  );
}


