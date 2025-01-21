import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Typewriter from 'typewriter-effect';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  isBot: boolean;
  message: string;
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const isNewMessage = useRef(true);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [message]);

  // Custom renderer for code blocks
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }
      
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isBot ? 'bg-gray-800 text-gray-100' : 'bg-blue-600 text-white'
        } shadow-md`}
      >
        {isBot ? (
          <div className="prose prose-invert max-w-none">
            {isNewMessage.current ? (
              <div className="min-h-[24px]">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(message)
                      .callFunction(() => {
                        isNewMessage.current = false;
                      })
                      .start();
                  }}
                  options={{
                    delay: 30,
                    cursor: '▋',
                    deleteSpeed: 50,
                  }}
                />
              </div>
            ) : (
              <ReactMarkdown components={renderers}>{message}</ReactMarkdown>
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

