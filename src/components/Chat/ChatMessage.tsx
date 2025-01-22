import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  isBot: boolean;
  message: string;
  isTyped: boolean;
  onTypingComplete?: () => void;
}

export function ChatMessage({ isBot, message, isTyped, onTypingComplete }: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [typingComplete, setTypingComplete] = useState(!isTyped);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingSpeed = useRef<30>;

  useEffect(() => {
    if (!isBot || typingComplete) {
      setDisplayedMessage(message);
      setTypingComplete(true);
      return;
    }

    let currentIndex = 0;

    const typeMessage = () => {
      if (currentIndex < message.length) {
        setDisplayedMessage((prev) => prev + message[currentIndex]);
        currentIndex++;
        const delay = /[.,!?]/.test(message[currentIndex - 1]) ? typingSpeed * 3 : typingSpeed;
        setTimeout(typeMessage, delay);
      } else {
        setTypingComplete(true);
        onTypingComplete?.();
      }
    };

    typeMessage();

    return () => {
      currentIndex = message.length;
    };
  }, [isBot, message, typingComplete, onTypingComplete]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessage]);

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isBot ? 'bg-gray-800 text-gray-100' : 'bg-blue-600 text-white'
        } shadow-md`}
      >
        {isBot ? (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{typingComplete ? message : displayedMessage}</ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message}</div>
        )}
      </div>
      <div ref={messageEndRef} className="h-1" />
    </div>
  );
}


