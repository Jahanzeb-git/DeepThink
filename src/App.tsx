import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  imageBase64?: string;
}

const PROCESSING_MESSAGES = [
  "I'm generating your image. This usually takes about 4 minutes. I'll keep you updated on the progress...",
  "Analyzing your description and planning the image...",
  "Creating initial composition...",
  "Adding details and refining the image...",
  "Applying final touches and optimizing quality..."
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
  const processingMessageId = useRef<string>('');
  const processingInterval = useRef<NodeJS.Timeout | null>(null);
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

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    };
  }, []);

  // Update processing message
  const updateProcessingMessage = useCallback((newText: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === processingMessageId.current
        ? {
            ...msg,
            text: newText
          }
        : msg
    ));
  }, []);

  // Start processing message rotation
  const startProcessingMessages = useCallback(() => {
    const messageId = Math.random().toString(36).substring(7);
    processingMessageId.current = messageId;
    
    // Add initial message
    setMessages(prev => [...prev, {
      id: messageId,
      text: PROCESSING_MESSAGES[0],
      isBot: true,
      isTyped: true,
      isDeepThinkEnabled: false
    }]);
    
    setCurrentProcessingIndex(0);
    
    // Set up interval to rotate through messages
    processingInterval.current = setInterval(() => {
      setCurrentProcessingIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % (PROCESSING_MESSAGES.length - 1) + 1;
        updateProcessingMessage(PROCESSING_MESSAGES[nextIndex]);
        return nextIndex;
      });
    }, 500);
  }, [updateProcessingMessage]);

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
        // Start the processing message rotation
        startProcessingMessages();

        // Start image generation request
        const imageResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/image_generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ prompt: message }),
        });

        // Clear the processing message interval
        if (processingInterval.current) {
          clearInterval(processingInterval.current);
          processingInterval.current = null;
        }

        if (!imageResponse.ok) {
          throw new Error(`HTTP error! Status: ${imageResponse.status}`);
        }

        const imageData = await imageResponse.json();

        if (imageData.error) {
          throw new Error(imageData.error);
        }

        // Remove the processing message
        setMessages(prev => prev.filter(msg => msg.id !== processingMessageId.current));

        // Add the generated image message
        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).substring(7),
          text: 'Here is your generated image:',
          isBot: true,
          isTyped: true,
          isDeepThinkEnabled: false,
          imageBase64: imageData.output
        }]);
      } else {
        // Regular chat message handling...
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
      // Clear the processing message interval if there's an error
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
        processingInterval.current = null;
      }
      // Remove the processing message if it exists
      setMessages(prev => prev.filter(msg => msg.id !== processingMessageId.current));
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
  }, [promptCount, startProcessingMessages]);

  // Rest of the component remains the same...
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
