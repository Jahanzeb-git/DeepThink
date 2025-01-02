import React from 'react';
import { Brain } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatContainer({
  messages,
  isLoading,
  onSendMessage,
}: ChatContainerProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-800 dark:bg-gray-100">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900 mb-8">
            Hi, I'm DeepSeek
          </h1>
          <p className="text-gray-400 dark:text-gray-800 mb-12">
            How can I help you today?
          </p>
          <div className="w-full max-w-3xl px-4">
            <ChatInput onSendMessage={onSendMessage} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} isBot={msg.isBot} message={msg.text} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="animate-spin">
                  <Brain className="w-5 h-5" />
                </div>
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSendMessage={onSendMessage} />
            </div>
          </div>
        </>
      )}
      <p className="text-center text-gray-400 mb-2 text-sm">
        DeepThink can make mistakes. Check important info.
      </p>
    </div>
  );
}
