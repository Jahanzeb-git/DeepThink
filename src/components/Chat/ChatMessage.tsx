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
  const [markdownHTML, setMarkdownHTML] = useState(''); // State to hold the full Markdown-rendered HTML

  // Pre-convert the entire message to Markdown HTML
  useEffect(() => {
    if (isBot) {
      const markdownContainer = document.createElement('div');
      markdownContainer.innerHTML = (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message}
        </ReactMarkdown>
      )?.props?.children?.toString() || '';
      setMarkdownHTML(markdownContainer.innerHTML);
    }
  }, [isBot, message]);

  // Simulate typing effect on the pre-converted Markdown HTML
  useEffect(() => {
    if (isBot && markdownHTML && !typingComplete) {
      // Reset the displayed message when a new message is received
      setDisplayedMessage('');
      setTypingComplete(false);

      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < markdownHTML.length) {
          setDisplayedMessage((prev) => prev + markdownHTML[index]);
          index++;
        } else {
          clearInterval(typingInterval);
          setTypingComplete(true);
        }
      }, 50); // Adjust typing speed here (e.g., 50ms per character)

      // Cleanup interval when the component unmounts
      return () => clearInterval(typingInterval);
    }
  }, [isBot, markdownHTML, typingComplete]);

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
            {!typingComplete ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: displayedMessage,
                }}
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
              </ReactMarkdown>
            )}
          </>
        ) : (
          message
        )}
      </div>
    </div>
  );
}

