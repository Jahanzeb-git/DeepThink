import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  // Your existing states and functions remain unchanged

  const MainLayout = useMemo(
    () => () => (
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
    ),
    [isSidebarOpen, messages, isLoading, handleSendMessage, handleNewChat]
  );

  return (
    <Router>
      <Routes>
        {/* Redirect "/" to the Initial page */}
        <Route path="/" element={<InitialPage />} />
        <Route path="/main" element={<MainLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/loading" element={<Initial />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Wrapper Component to handle initial navigation
const InitialPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/main'); // Navigate to MainLayout after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [navigate]);

  return <Initial />;
};

export default App;











