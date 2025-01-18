import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  isBot: boolean;
  message: string;
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingSpeedRef = useRef(30);
  const autoScrollThreshold = 100;

  useEffect(() => {
    if (!isBot || typingComplete) return;

    let currentIndex = 0;
    const content = message;
    
    const typeNextCharacter = () => {
      if (currentIndex < content.length) {
        const batchSize = 3;
        const nextBatch = content.slice(
          currentIndex,
          Math.min(currentIndex + batchSize, content.length)
        );
        
        setDisplayedMessage(prev => prev + nextBatch);
        currentIndex += batchSize;
        
        const nextChar = content[currentIndex];
        const delay = /[.,!?]/.test(nextChar) ? typingSpeedRef.current * 3 : typingSpeedRef.current;
        
        setTimeout(typeNextCharacter, delay);
      } else {
        setTypingComplete(true);
      }
    };

    setDisplayedMessage('');
    typeNextCharacter();
    
    return () => {
      currentIndex = content.length;
    };
  }, [isBot, message, typingComplete]);

  return (
    <motion.div 
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`max-w-[80%] p-4 rounded-lg ${
          isBot
            ? 'bg-gray-800 text-gray-100'
            : 'bg-blue-600 text-white'
        } shadow-md`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isBot ? (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {typingComplete ? message : displayedMessage}
            </ReactMarkdown>
            {!typingComplete && (
              <motion.span
                className="inline-block w-2 h-4 ml-1 bg-gray-400"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message}</div>
        )}
      </motion.div>
      <div ref={messageEndRef} />
    </motion.div>
  );
}

