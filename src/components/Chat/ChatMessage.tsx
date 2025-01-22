import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  isTyped: boolean;
  onTypingComplete: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessage({ message, isBot, isTyped, onTypingComplete, containerRef }: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);
  
  // Handle scroll behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
      setShouldAutoScroll(isAtBottom);
      lastScrollPosition.current = scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  // Auto-scroll function
  const scrollToBottom = useCallback(() => {
    if (!shouldAutoScroll || !containerRef.current) return;
    
    const container = containerRef.current;
    const scrollOptions = {
      top: container.scrollHeight,
      behavior: 'smooth' as ScrollBehavior
    };
    
    container.scrollTo(scrollOptions);
  }, [shouldAutoScroll, containerRef]);

  // Typing animation logic with improved scrolling
  const animateTyping = useCallback(() => {
    if (!isBot || isTyped) {
      setDisplayedText(message);
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;
    let lastNewlineIndex = -1;
    const textLength = message.length;

    const typeNextChar = () => {
      if (currentIndex < textLength) {
        const nextChar = message[currentIndex];
        setDisplayedText(prev => message.slice(0, currentIndex + 1));
        
        // Check for new line and scroll if needed
        if (nextChar === '\n' && currentIndex > lastNewlineIndex) {
          lastNewlineIndex = currentIndex;
          requestAnimationFrame(scrollToBottom);
        }
        
        currentIndex++;
        
        // Vary typing speed slightly for natural feel
        const delay = Math.random() * 20 + 10;
        typingRef.current = setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        onTypingComplete();
        requestAnimationFrame(scrollToBottom);
      }
    };

    typeNextChar();

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [message, isBot, isTyped, onTypingComplete, scrollToBottom]);

  useEffect(() => {
    animateTyping();
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [animateTyping]);

  // Copy message to clipboard with feedback
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div
      className={`flex gap-4 p-4 ${!isBot && 'bg-gray-700/50 dark:bg-gray-200/50 rounded-lg'}`}
      ref={messageRef}
    >
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isBot 
            ? 'bg-emerald-500/20 text-emerald-500 dark:bg-emerald-500/30 dark:text-emerald-400' 
            : 'bg-blue-500/20 text-blue-500 dark:bg-blue-500/30 dark:text-blue-400'
        }`}>
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="font-medium text-sm text-gray-400 dark:text-gray-600 mb-1">
          {isBot ? 'AI Assistant' : 'You'}
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <div className="text-gray-200 dark:text-gray-800 leading-relaxed">
            {isBot && !isTyped ? (
              <>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {displayedText}
                </ReactMarkdown>
                {isTyping && (
                  <span className="inline-flex ml-1">
                    <span className="w-1 h-4 bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  </span>
                )}
              </>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
              </ReactMarkdown>
            )}
          </div>
        </div>

        {isBot && (
          <div className="flex justify-end mt-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={copyToClipboard}
              className={`p-1.5 rounded-md transition-colors duration-200 
                ${isCopied 
                  ? 'text-green-500 dark:text-green-400' 
                  : 'text-gray-400 hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-600'}`}
              aria-label={isCopied ? 'Copied!' : 'Copy to clipboard'}
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


