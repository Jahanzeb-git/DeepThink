import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  isBot: boolean;
  message: string;
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingSpeedRef = useRef(30); // Adjust typing speed (ms)
  const autoScrollThreshold = 100; // Pixels from bottom to trigger auto-scroll

  // Initialize markdown content
  useEffect(() => {
    if (isBot) {
      setMarkdownContent(message);
      setDisplayedMessage('');
      setTypingComplete(false);
    }
  }, [isBot, message]);

  // Enhanced typing effect
  useEffect(() => {
    if (!isBot || typingComplete || !markdownContent) return;

    let currentIndex = 0;
    const content = markdownContent;
    
    const typeNextCharacter = () => {
      if (currentIndex < content.length) {
        // Batch characters for smoother typing
        const batchSize = 3;
        const nextBatch = content.slice(
          currentIndex,
          Math.min(currentIndex + batchSize, content.length)
        );
        
        setDisplayedMessage(prev => prev + nextBatch);
        currentIndex += batchSize;
        
        // Adjust speed based on punctuation
        const nextChar = content[currentIndex];
        const delay = /[.,!?]/.test(nextChar) ? typingSpeedRef.current * 3 : typingSpeedRef.current;
        
        setTimeout(typeNextCharacter, delay);
      } else {
        setTypingComplete(true);
      }
    };

    typeNextCharacter();
    
    return () => {
      currentIndex = content.length; // Stop typing on cleanup
    };
  }, [isBot, markdownContent, typingComplete]);

  // Improved auto-scroll logic
  useEffect(() => {
    if (!chatContainerRef.current || !messageEndRef.current) return;

    const container = chatContainerRef.current;
    const shouldAutoScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      return distanceFromBottom <= autoScrollThreshold;
    };

    if (shouldAutoScroll()) {
      messageEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [displayedMessage]);

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)',
      }}
    >
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        <div
          className={`max-w-[80%] p-4 rounded-lg ${
            isBot
              ? 'bg-gray-800 text-gray-100'
              : 'bg-blue-600 text-white'
          } shadow-md`}
        >
          {isBot ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {typingComplete ? markdownContent : displayedMessage}
              </ReactMarkdown>
              {!typingComplete && (
                <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message}</div>
          )}
        </div>
      </div>
      <div ref={messageEndRef} className="h-1" />
    </div>
  );
}

