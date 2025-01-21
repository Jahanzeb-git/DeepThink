import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  isBot: boolean;
  message: string;
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingSpeedRef = useRef(30); // Typing speed in milliseconds

  // Typing effect logic
  useEffect(() => {
    if (!isBot || typingComplete || message === displayedMessage) {
      setTypingComplete(true); // Ensure typing is marked complete if unnecessary
      return;
    }

    let currentIndex = 0;
    const typeMessage = () => {
      if (currentIndex < message.length) {
        const nextChar = message[currentIndex];
        setDisplayedMessage((prev) => prev + nextChar);
        currentIndex++;

        // Adjust delay for punctuation
        const delay = /[.,!?]/.test(nextChar) ? typingSpeedRef.current * 3 : typingSpeedRef.current;
        setTimeout(typeMessage, delay);
      } else {
        setTypingComplete(true);
      }
    };

    typeMessage();

    return () => {
      // Cleanup: Reset state when the component unmounts or dependencies change
      currentIndex = message.length;
      setTypingComplete(false);
      setDisplayedMessage('');
    };
  }, [isBot, message]);

  // Scroll to the bottom of the chat when the message updates
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
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
            <ReactMarkdown>
              {typingComplete ? message : displayedMessage}
            </ReactMarkdown>
            {!typingComplete && (
              <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message}</div>
        )}
      </div>
      <div ref={messageEndRef} className="h-1" />
    </div>
  );
}


