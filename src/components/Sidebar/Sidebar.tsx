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
  timestamp?: string;
}

interface SidebarProps {
  onSelectChat: (sessionNumber: number) => void;
  onNewChat: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function Sidebar({
  onSelectChat,
  onNewChat,
  isDark,
  toggleTheme,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);

  // Load sessions from localStorage on initial mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data: HistoryResponse = await response.json();
      
      if (data.prompt && data.session_number) {
        // Check if session already exists
        setSessions(prev => {
          const sessionExists = prev.some(
            session => session.session_number === data.session_number
          );
          
          if (sessionExists) {
            return prev;
          }
          
          // Add new session to the beginning of the list
          return [
            {
              prompt: data.prompt,
              session_number: data.session_number,
              timestamp: new Date().toISOString()
            },
            ...prev
          ];
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

      const incResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const incData: SessionResponse = await incResponse.json();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchHistory();
      
      setActiveSession(null);
      onNewChat();
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  // Handle page leave/unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        await fetchHistory();
      } catch (error) {
        console.error('Error handling page unload:', error);
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

  const clearHistory = () => {
    setSessions([]);
    localStorage.removeItem('chatSessions');
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

      {/* Added clear history button */}
      <div className="px-4 mb-2">
        <button
          onClick={clearHistory}
          className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-2">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <HistoryItem
              key={session.session_number}
              title={session.prompt || `Chat ${session.session_number}`}
              isActive={session.session_number === activeSession}
              onClick={() => handleSelectChat(session.session_number)}
            />
          ))
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
