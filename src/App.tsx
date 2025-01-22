import React, { useState, useCallback } from 'react';
import { ChatContainer } from './components/Chat/ChatContainer';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isTyped: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    const newMessage = { id: Date.now().toString(), text: message, isBot: false, isTyped: true };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('https://example.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) throw new Error('Error fetching response');

      const data = await response.json();
      const botMessage = { id: Date.now().toString(), text: data.response, isBot: true, isTyped: false };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: 'Error occurred. Try again.', isBot: true, isTyped: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <ChatContainer messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;





