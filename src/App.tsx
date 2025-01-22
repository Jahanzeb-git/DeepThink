import React, { useState, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HistorySidebar from './components/Sidebar/Sidebar'; // Updated import
import { ChatContainer } from './components/Chat/ChatContainer';
import { MobileNav } from './components/Layout/MobileNav';
import { Chat } from './components/Chat/ChatArea';
import Login from './components/login';
import Signup from './components/signup';
import Terms from './components/terms';

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
  const MAX_PROMPTS = 5;

  // Memoized function for sending messages
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

  // Memoized function for starting a new chat
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setIsSidebarOpen(false);
  }, []);

  // Memoized theme toggler
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle('dark', !isDark);
  }, [isDark]);

  // Memoized sidebar toggle function
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Memoized MainLayout component
  const MainLayout = useMemo(() => () => (
    <div className="flex h-screen bg-gray-900">
      <MobileNav onToggleSidebar={toggleSidebar} />
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
        {/* Replace Sidebar with HistorySidebar */}
        <HistorySidebar />
      </div>
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  ), [isSidebarOpen, messages, isLoading, handleSendMessage]);

  return (
    <Router>
      <Routes>
        {/* Main App Route */}
        <Route path="/" element={<MainLayout />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />

        {/* Terms Page */}
        <Route path="/terms" element={<Terms />} />

        {/* Redirect any unknown route to the main page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;










