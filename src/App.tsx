import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  imageBase64?: string; // Changed from imageUrl to imageBase64
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const MAX_PROMPTS = 5;

  // Initialize theme based on system preference and localStorage
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === null) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleSendMessage = useCallback(async (message: string, isDeepThinkEnabled: boolean, isImageMode: boolean) => {
    // Add user message
    setMessages((prev) => [...prev, {
      id: Math.random().toString(36).substring(7),
      text: message,
      isBot: false,
      isTyped: true,
      isDeepThinkEnabled: false
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
      if (isImageMode) {
        // Add initial loading message
        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).substring(7),
          text: "I'm generating your image. This usually takes about 4 minutes. I'll keep you updated on the progress...",
          isBot: true,
          isTyped: true,
          isDeepThinkEnabled: false
        }]);

        // Progress updates
        const progressUpdates = [
          "Analyzing your description and planning the image...",
          "Creating initial composition...",
          "Adding details and refining the image...",
          "Applying final touches and optimizing quality..."
        ];

        // Start image generation request
        const imageResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/image_generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ prompt: message }),
        });

        if (!imageResponse.ok) {
          throw new Error(`HTTP error! Status: ${imageResponse.status}`);
        }

        // Show progress updates while waiting for the response
        for (const update of progressUpdates) {
          await new Promise(resolve => setTimeout(resolve, 45000)); // 45 seconds between updates
          setMessages((prev) => [...prev, {
            id: Math.random().toString(36).substring(7),
            text: update,
            isBot: true,
            isTyped: true,
            isDeepThinkEnabled: false
          }]);
        }

        const imageData = await imageResponse.json();

        if (imageData.error) {
          throw new Error(imageData.error);
        }

        // Add the generated image message
        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).substring(7),
          text: 'Here is your generated image:',
          isBot: true,
          isTyped: true,
          isDeepThinkEnabled: false,
          imageBase64: imageData.output // Use the base64 string from the response
        }]);
      } else {
        // Regular chat message
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
          isDeepThinkEnabled
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, {
        id: Math.random().toString(36).substring(7),
        text: `Sorry, an error occurred: ${error.message}`,
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
  }, []);

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
