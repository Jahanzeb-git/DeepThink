import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  isBot: boolean;
  message: string; // Message can be plain text or Markdown
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState(''); // State to hold the typed message
  const [typingComplete, setTypingComplete] = useState(false); // State to track typing completion
  const [markdownContent, setMarkdownContent] = useState(''); // State to hold the Markdown-rendered content
  const [isUserScrolling, setIsUserScrolling] = useState(false); // State to track user scroll behavior
  const messageEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat container

  // Convert the message to Markdown first
  useEffect(() => {
    if (isBot) {
      setMarkdownContent(message); // Store the raw Markdown for typing
    }
  }, [isBot, message]);

  // Simulate typing effect on the Markdown-rendered content
  useEffect(() => {
    if (isBot && !typingComplete && markdownContent) {
      // Reset the displayed message when a new message is received
      setDisplayedMessage('');
      setTypingComplete(false);

      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < markdownContent.length) {
          setDisplayedMessage((prev) => prev + markdownContent[index]);
          index++;
        } else {
          clearInterval(typingInterval);
          setTypingComplete(true);
        }
      }, 50); // Adjust typing speed here (e.g., 50ms per character)

      // Cleanup interval when the component unmounts
      return () => clearInterval(typingInterval);
    }
  }, [isBot, markdownContent, typingComplete]);

  // Auto-scroll to the bottom when the bot types
  useEffect(() => {
    if (messageEndRef.current && !isUserScrolling) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedMessage, typingComplete, isUserScrolling]);

  // Track user scroll behavior
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50; // Threshold for "near bottom"

      if (isNearBottom) {
        setIsUserScrolling(false); // User is near the bottom, enable auto-scroll
      } else {
        setIsUserScrolling(true); // User is scrolling away, disable auto-scroll
      }
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4" // Make the chat container scrollable
    >
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        <div
          className={`max-w-[80%] p-4 rounded-lg ${
            isBot
              ? 'text-gray-100' // Remove background for bot messages
              : 'bg-blue-600 text-white' // Keep background for user messages
          }`}
        >
          {isBot ? (
            <>
              {/* Render the typing effect for the bot message */}
              {!typingComplete && (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {displayedMessage}
                </ReactMarkdown>
              )}
              {/* Render the final message as Markdown after typing is complete */}
              {typingComplete && (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              )}
            </>
          ) : (
            // Render plain text for user messages
            message
          )}
        </div>
        {/* Ref for auto-scrolling */}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}

