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
  const hasTypedMessage = useRef(false); // Tracks if this message has already been typed

  useEffect(() => {
    console.log('ChatMessage useEffect - Start');
    console.log(`isBot: ${isBot}`);
    console.log(`message: ${message}`);
    console.log(`typingComplete: ${typingComplete}`);
    console.log(`hasTypedMessage.current: ${hasTypedMessage.current}`);

    // Reset the typing state and flag when the message changes
    setDisplayedMessage('');
    setTypingComplete(false);
    hasTypedMessage.current = false;

    // Skip typing if:
    // 1. Not a bot message
    // 2. Typing is already complete
    // 3. The message has already been typed before
    if (!isBot || typingComplete || hasTypedMessage.current) {
      console.log('Skipping typing');
      setDisplayedMessage(message);
      setTypingComplete(true);
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
        console.log('Typing complete');
        setTypingComplete(true);
        hasTypedMessage.current = true; // Mark the message as fully typed
      }
    };

    console.log('Starting typing effect');
    typeMessage();

    return () => {
      // Cleanup: Stop typing when dependencies change or component unmounts
      console.log('Cleaning up typing effect');
      currentIndex = message.length;
      setTypingComplete(false);
      setDisplayedMessage('');
    };
  }, [isBot, message]);

  useEffect(() => {
    if (messageEndRef.current) {
      console.log('Scrolling to the bottom');
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

