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
  imageBase64?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const MAX_PROMPTS = 5;

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setIsSidebarOpen(false);
  }, []);

  const handleLoadHistory = useCallback(async (sessionNumber: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://jahanzebahmed25.pythonanywhere.com/history/${sessionNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const historyData = await response.json();
      
      const newMessages = [];
      const startIndex = historyData[0]?.prompt === null && historyData[0]?.response === null ? 1 : 0;
      
      for (let i = startIndex; i < historyData.length; i++) {
        const item = historyData[i];
        if (item.prompt) {
          newMessages.push({
            id: `history-${item.id}-prompt`,
            text: item.prompt,
            isBot: false,
            isTyped: true,
            isDeepThinkEnabled: false
          });
        }
        if (item.response) {
          newMessages.push({
            id: `history-${item.id}-response`,
            text: item.response,
            isBot: true,
            isTyped: true,
            isDeepThinkEnabled: false
          });
        }
      }

      setMessages(newMessages);
    } catch (error) {
      console.error('Error loading history:', error);
      setMessages([{
        id: 'error',
        text: 'Failed to load chat history.',
        isBot: true,
        isTyped: true,
        isDeepThinkEnabled: false
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleSendMessage = useCallback(async (message: string, isDeepThinkEnabled: boolean, isImageMode: boolean, model?: string) => {
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
        // Image generation logic remains unchanged
        const initialMessage = [
          "I'm generating your image. This usually takes about 4 minutes. I'll keep you updated on the progress...","..."
        ];

        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).substring(7),
          text: initialMessage,
          isBot: true,
          isTyped: true,
          isDeepThinkEnabled: false
        }]);

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

        const imageData = await imageResponse.json();

        if (imageData.error) {
          throw new Error(imageData.error);
        }

        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).substring(7),
          text: 'Here is your generated image:',
          isBot: true,
          isTyped: true,
          isDeepThinkEnabled: false,
          imageBase64: imageData.output
        }]);
      } else {
        // Handle streaming chat response
        const messageId = Math.random().toString(36).substring(7);
        setMessages((prev) => [...prev, {
          id: messageId,
          text: '',
          isBot: true,
          isTyped: true,
          isDeepThinkEnabled
        }]);

        const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(model && { model: model })
          },
          body: JSON.stringify({ prompt: message }),
        });

        if (!response.ok) {
          throw new Error(`It's looks like you are not Authorized! Please Login again: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream available');

        let accumulatedText = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Convert the chunk to text
          const chunk = new TextDecoder().decode(value);
          accumulatedText += chunk;

          // Update the message with accumulated text
          setMessages((prev) => prev.map((msg) => 
            msg.id === messageId 
              ? { ...msg, text: accumulatedText }
              : msg
          ));
        }
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

  const MainLayout = useMemo(() => () => (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <MobileNav onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div
        className={`fixed inset-0 bg-black/50 md:hidden transition-opacity duration-300 z-40 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <div
        className={`fixed md:static w-[280px] h-full bg-gray-900 transition-all duration-300 ease-in-out transform z-50
          ${isSidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full md:translate-x-0'}
          md:w-64 md:transition-none`}
      >
        <HistorySidebar onNewChat={handleNewChat} onLoadHistory={handleLoadHistory} />
      </div>

      <div className="flex-1 flex flex-col h-full relative">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  ), [isSidebarOpen, messages, isLoading, handleSendMessage, handleNewChat, handleLoadHistory]);

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
