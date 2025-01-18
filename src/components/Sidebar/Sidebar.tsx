import React, { useEffect, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { HistoryItem } from './HistoryItem';

interface HistoryResponse {
  prompt: string;
  session_number: number;
}

interface SessionResponse {
  message: string;
  session_number: number;
}

interface ChatSession {
  prompt: string;
  session_number: number;
  timestamp: string;
}

interface SidebarProps {
  onSelectChat: (sessionNumber: number) => void;
  onNewChat: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const LOCAL_STORAGE_KEY = 'chat_history';

export function Sidebar({
  onSelectChat,
  onNewChat,
  isDark,
  toggleTheme,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    // Initialize from local storage
    const storedSessions = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedSessions ? JSON.parse(storedSessions) : [];
  });
  const [activeSession, setActiveSession] = useState<number | null>(null);

  // Save to local storage whenever sessions change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not authenticated');
        return;
      }
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/history', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: HistoryResponse[] = await response.json();
      
      if (Array.isArray(data)) {
        // Process new history items
        const newSessions = data.map((item) => ({
          prompt: item.prompt,
          session_number: item.session_number,
          timestamp: new Date().toISOString(), // Add timestamp for sorting
        }));

        // Merge new sessions with existing ones, avoiding duplicates
        setSessions((prevSessions) => {
          const existingSessionNumbers = new Set(prevSessions.map(s => s.session_number));
          const uniqueNewSessions = newSessions.filter(
            session => !existingSessionNumbers.has(session.session_number)
          );
          
          return [...uniqueNewSessions, ...prevSessions]
            .sort((a, b) => b.session_number - a.session_number); // Sort by session number descending
        });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not authenticated');
        return;
      }

      // Increment session
      const incResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const incData: SessionResponse = await incResponse.json();

      // Wait for backend to process
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch updated history
      await fetchHistory();

      // Clear active session and notify parent
      setActiveSession(null);
      onNewChat();
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  // Initial fetch and page leave handling
  useEffect(() => {
    fetchHistory();

    const handleBeforeUnload = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          await fetchHistory();
        } catch (error) {
          console.error('Error handling page unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSelectChat = (sessionNumber: number) => {
    setActiveSession(sessionNumber);
    onSelectChat(sessionNumber);
  };

  const formatSessionTitle = (session: ChatSession) => {
    const date = new Date(session.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format date based on when the chat occurred
    let dateStr = '';
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateStr = 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return {
      title: session.prompt || `Chat ${session.session_number}`,
      subtitle: dateStr
    };
  };

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          New chat
        </button>
      </div>

      <div className="p-4">
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-2">
        {sessions.length > 0 ? (
          sessions.map((session) => {
            const { title, subtitle } = formatSessionTitle(session);
            return (
              <HistoryItem
                key={session.session_number}
                title={title}
                subtitle={subtitle}
                isActive={session.session_number === activeSession}
                onClick={() => handleSelectChat(session.session_number)}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <p>No chat history found</p>
            <p className="mt-2">Start a new chat to begin!</p>
          </div>
        )}
      </div>
    </div>
  );
}
