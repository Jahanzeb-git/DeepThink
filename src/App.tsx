import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import HistorySidebar from './components/Sidebar/Sidebar';
import { ChatContainer } from './components/Chat/ChatContainer';
import { MobileNav } from './components/Layout/MobileNav';
import { Chat } from './components/Chat/ChatArea';
import Login from './components/login';
import Signup from './components/signup';
import Terms from './components/terms';
import Initial from './components/initial';

interface Message {
  text: string;
  isBot: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [isInitialPage, setIsInitialPage] = useState(true); // New state for Initial Page
  const MAX_PROMPTS = 5;

  useEffect(() => {
    // Redirect from the Initial Page after 3 seconds
    const timer = setTimeout(() => {
      setIsInitialPage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isBot: false }]);
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      if (promptCount >= MAX_PROMPTS) {
        setMessages((prev) => [
          ...prev,
          { text: 'To continue, please login.', isBot: true },
        ]);
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

      setMessages((prev) => [
        ...prev,
        { text: data.response, isBot: true },
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

  if (isInitialPage) {
    return <Initial />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/loading" element={<Initial />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;












