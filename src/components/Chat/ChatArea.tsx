import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Loader2 } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import  ChatInput  from './ChatInput';
import { TagInput } from './TagInput';

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, autoScroll]);

  useEffect(() => {
    if (messages.length > 0 && !hasInteracted) {
      setHasInteracted(true);
    }
  }, [messages.length]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
      setAutoScroll(isAtBottom);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 -mt-32">
            <h1 className="text-4xl font-bold text-white mb-4">
              Hi, I am Deepthink
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              How can I help you?
            </p>
            <div className="w-full max-w-2xl">
              <ChatInput onSendMessage={onSendMessage} />
              <div className="mt-8">
                <TagInput />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 ${
                  message.isBot ? 'flex' : 'flex justify-end'
                }`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.isBot
                      ? 'text-gray-200'
                      : 'bg-blue-600 text-white rounded-lg px-4 py-2'
                  }`}
                >
                  {message.isBot ? (
                    <div className="prose prose-invert max-w-none">
                      <Typewriter
                        options={{
                          delay: 30,
                          cursor: '',
                        }}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(message.text)
                            .start();
                        }}
                      />
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span>{message.text}</span>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-400 mb-6">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div
        className={`border-t border-gray-700 bg-gray-800 transition-all duration-500 ${
          hasInteracted ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto p-4">
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
};
