import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TypeAnimation } from 'react-type-animation';

interface ChatMessageProps {
  isBot: boolean;
  message: string; // Message can be plain text or Markdown
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState(''); // State to hold the typed message
  const [typingComplete, setTypingComplete] = useState(false); // State to track typing completion

  useEffect(() => {
    if (isBot && !typingComplete) {
      // Reset the displayed message when a new message is received
      setDisplayedMessage('');
      setTypingComplete(false);

      // Simulate typing effect
      const typingInterval = setInterval(() => {
        setDisplayedMessage((prev) => {
          const nextChar = message[prev.length];
          return prev + (nextChar || '');
        });
      }, 50); // Adjust typing speed here

      // Cleanup interval when typing is complete
      return () => clearInterval(typingInterval);
    }
  }, [isBot, message, typingComplete]);

  useEffect(() => {
    // Mark typing as complete when the full message is displayed
    if (displayedMessage.length === message.length) {
      setTypingComplete(true);
    }
  }, [displayedMessage, message]);

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isBot
            ? 'bg-gray-700 text-gray-100'
            : 'bg-blue-600 text-white'
        }`}
      >
        {isBot ? (
          <>
            {/* Render the typing effect for the bot message */}
            {!typingComplete && (
              <TypeAnimation
                sequence={[displayedMessage]}
                speed={50} // Typing speed (lower is faster)
                cursor={false} // Hide the cursor after typing
                wrapper="div"
                style={{ whiteSpace: 'pre-wrap' }} // Preserve line breaks and formatting
              />
            )}
            {/* Render the final message as Markdown after typing is complete */}
            {typingComplete && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
              </ReactMarkdown>
            )}
          </>
        ) : (
          // Render plain text for user messages
          message
        )}
      </div>
    </div>
  );
}
