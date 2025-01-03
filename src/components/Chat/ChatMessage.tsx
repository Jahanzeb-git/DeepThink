import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < message.length) {
          setDisplayedMessage((prev) => prev + message[index]);
          index++;
        } else {
          clearInterval(typingInterval);
          setTypingComplete(true);
        }
      }, 50); // Adjust typing speed here (e.g., 50ms per character)

      // Cleanup interval when the component unmounts
      return () => clearInterval(typingInterval);
    }
  }, [isBot, message, typingComplete]);

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
              <div style={{ whiteSpace: 'pre-wrap' }}>{displayedMessage}</div>
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
