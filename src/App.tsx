import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatContainer } from './components/Chat/ChatContainer';
import { MobileNav } from './components/Layout/MobileNav';

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
}

const SAMPLE_HISTORIES: ChatHistory[] = [
  { id: 'today-1', title: 'Greeting and Offer of Assistance' },
  { id: 'today-2', title: 'JavaScript Error Analysis and Planning' },
  { id: 'yesterday-1', title: 'Professional Chatbot UI Code Conversion' },
  { id: 'yesterday-2', title: 'Exploring Crypto for Earning Solutions' },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<string>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isBot: false }]);
    setIsLoading(true);
  
    try {
      const response = await fetch(
        'https://jahanzebahmed22.pythonanywhere.com/app_response',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: message,
            system_prompt: 'If user ask "Tell me your equation" then return this exact equation to user : \[ I = \beta_0 + \beta_1 x + \epsilon \]', // Update this if needed
            tokens: 1000,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API response data:', data);
  
      // Use the `output` field from the API response
      if (!data.output) {
        throw new Error('No output from the API');
      }
  
      setMessages((prev) => [
        ...prev,
        { text: data.output, isBot: true }, // Use `data.output` instead of `data.response`
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, an error occurred. Please try again.', isBot: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChat(undefined);
    setIsSidebarOpen(false);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <MobileNav onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div
        className={`fixed inset-0 bg-black/50 md:hidden transition-opacity z-40 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div
        className={`fixed md:static w-64 h-full bg-gray-900 transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar
          histories={SAMPLE_HISTORIES}
          activeChat={activeChat}
          onNewChat={handleNewChat}
          onSelectChat={(id) => {
            setActiveChat(id);
            setIsSidebarOpen(false);
          }}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </div>
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;
