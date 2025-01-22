import React, { useState, useCallback } from 'react';
import { ChatContainer } from './components/Chat/ChatContainer';
import  HistorySidebar  from './components/Sidebar/Sidebar'; // Assuming this is your Sidebar component
import { Menu } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isTyped: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    const newMessage = { id: Date.now().toString(), text: message, isBot: false, isTyped: true };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
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

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 bg-gray-900 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0 md:static md:flex-shrink-0 md:w-64`}
      >
        <HistorySidebar />
      </div>

      {/* Mobile Hamburger Icon */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden p-2 bg-gray-800 rounded-md text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;






