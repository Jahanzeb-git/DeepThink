import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TypeAnimation } from 'react-type-animation';

interface ChatMessageProps {
  isBot: boolean;
  message: string; // Message can be plain text or Markdown
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
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
          <TypeAnimation
            sequence={[
              (el) => {
                // Render the message as Markdown
                return (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message}
                  </ReactMarkdown>
                );
              },
            ]}
            speed={50} // Typing speed (lower is faster)
            cursor={false} // Hide the cursor after typing
            wrapper="div"
            style={{ whiteSpace: 'pre-wrap' }} // Preserve line breaks and formatting
          />
        ) : (
          message // Render plain text for user messages
        )}
      </div>
    </div>
  );
}
