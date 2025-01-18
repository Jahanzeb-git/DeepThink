import React, { useEffect, useReducer, useCallback } from 'react';
import { RotateCw } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { HistoryItem } from './HistoryItem';

// Interfaces
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

// Reducer for managing sessions
type Action =
  | { type: 'SET_SESSIONS'; payload: ChatSession[] }
  | { type: 'ADD_SESSION'; payload: ChatSession }
  | { type: 'CLEAR_SESSIONS' };

const sessionReducer = (state: ChatSession[], action: Action) => {
  switch (action.type) {
    case 'SET_SESSIONS':
      return action.payload;
    case 'ADD_SESSION':
      return [action.payload, ...state];
    case 'CLEAR_SESSIONS':
      return [];
    default:
      return state;
  }
};

export function Sidebar({
  onSelectChat,
  onNewChat,
  isDark,
  toggleTheme,
}: SidebarProps) {
  const [sessions, dispatch] = useReducer(sessionReducer, []);
  const [activeSession, setActiveSession] = React.useState<number | null>(null);

  // Save sessions to local storage
  const saveSessionsToLocalStorage = (sessions: ChatSession[]) => {
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
  };

  // Load sessions from local storage
  const loadSessionsFromLocalStorage = () => {
    const storedSessions = localStorage.getItem('chat_sessions');
    return storedSessions ? JSON.parse(storedSessions) : [];
  };

  // Fetch history from server
  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not authenticated');
        return;
      }
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: ChatSession[] = await response.json();
      dispatch({ type: 'SET_SESSIONS', payload: data });
      saveSessionsToLocalStorage(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, []);

  // Handle new chat creation
  const handleNewChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not authenticated');
        return;
      }

      // Increment session
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: ChatSession = await response.json();

      // Add new session to state
      dispatch({ type: 'ADD_SESSION', payload: data });
      saveSessionsToLocalStorage([...sessions, data]);

      // Clear active session
      setActiveSession(null);
      onNewChat();
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  // Load history on mount
  useEffect(() => {
    const storedSessions = loadSessionsFromLocalStorage();
    if (storedSessions.length > 0) {
      dispatch({ type: 'SET_SESSIONS', payload: storedSessions });
    } else {
      fetchHistory();
    }
  }, [fetchHistory]);

  const handleSelectChat = (sessionNumber: number) => {
    setActiveSession(sessionNumber);
    onSelectChat(sessionNumber);
  };

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Theme Toggle Button */}
      <div className="p-4">
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      {/* History List */}
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

