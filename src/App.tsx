import React, { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';
import { ChatContainer } from './components/Chat/ChatContainer';
import HistorySidebar from './components/Sidebar/Sidebar';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isTyped: boolean;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-900 dark:bg-gray-50">
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? 'opacity-100 z-30' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <HistorySidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-gray-700/50 dark:border-gray-200/50">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 text-gray-400 dark:text-gray-600"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Chat Container */}
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
}

export default App;






