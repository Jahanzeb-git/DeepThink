import React, { useState, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HistorySidebar from './components/Sidebar/Sidebar';
import { ChatContainer } from './components/Chat/ChatContainer';
import { MobileNav } from './components/Layout/MobileNav';
import Login from './components/login';
import Signup from './components/signup';
import Terms from './components/terms';
import LoadingPage from './components/LoadingPage';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  isTyped: boolean;
  isDeepThinkEnabled: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const MAX_PROMPTS = 5;

  const handleSendMessage = useCallback(async (message: string, isDeepThinkEnabled: boolean) => {
    // Add user message
    setMessages((prev) => [...prev, {
      id: Math.random().toString(36).substring(7),
      text: message,
      isBot: false,
      isTyped: true,
      isDeepThinkEnabled: false // User messages don't need this flag
    }]);
    
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      if (promptCount >= MAX_PROMPTS) {
        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).substring(7),
          text: 'To continue, please login.',
          isBot: true,
          isTyped: true,
          isDeepThinkEnabled: false
        }]);
        setIsLoading(false);
        return;
      }
      setPromptCount((prev) => prev + 1);
    }

    try {
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error('No output from the API');
      }

      setMessages((prev) => [...prev, {
        id: Math.random().toString(36).substring(7),
        text: data.response,
        isBot: true,
        isTyped: false,
        isDeepThinkEnabled // Pass the flag to bot responses
      }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [...prev, {
        id: Math.random().toString(36).substring(7),
        text: 'Sorry, an error occurred. Please try again.',
        isBot: true,
        isTyped: true,
        isDeepThinkEnabled: false
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [promptCount]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setIsSidebarOpen(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle('dark', !isDark);
  }, [isDark]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const MainLayout = useMemo(() => () => (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <MobileNav onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 md:hidden transition-opacity duration-300 z-40 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed md:static w-[280px] h-full bg-gray-900 transition-all duration-300 ease-in-out transform z-50
          ${isSidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full md:translate-x-0'}
          md:w-64 md:transition-none`}
      >
        <HistorySidebar onNewChat={handleNewChat} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  ), [isSidebarOpen, messages, isLoading, handleSendMessage, handleNewChat]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/main" element={<MainLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;












