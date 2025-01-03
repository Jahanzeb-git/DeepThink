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
  const [markdownContent, setMarkdownContent] = useState(''); // State to hold the Markdown-rendered content

  // Convert the message to Markdown first
  useEffect(() => {
    if (isBot) {
      // Use ReactMarkdown to render the message as HTML
      const markdownContainer = document.createElement('div');
      ReactMarkdown({
        children: message,
        remarkPlugins: [remarkGfm],
      });
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
      }, 30); // Adjust typing speed here (e.g., 50ms per character)

      // Cleanup interval when the component unmounts
      return () => clearInterval(typingInterval);
    }
  }, [isBot, markdownContent, typingComplete]);

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
    </div>
  );
}

