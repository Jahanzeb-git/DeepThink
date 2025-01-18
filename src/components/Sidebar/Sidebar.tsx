import React, { useEffect, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { HistoryItem } from './HistoryItem';

// Define interfaces at the top of the file
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
  onNewChat: () => void; // Keep original onNewChat for parent component notification
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

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        // Handle case when user is not logged in
        console.log('User not authenticated');
        return;
      }
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/history', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: HistoryResponse[] = await response.json(); // Assume the API returns an array of history items
      if (Array.isArray(data)) {
        // Append new history data to the existing sessions
        setSessions((prev) => [
          ...data.map((item) => ({
            prompt: item.prompt,
            session_number: item.session_number,
          })),
          ...prev, // Keep existing sessions
        ]);
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

      // First increment the session
      const incResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const incData: SessionResponse = await incResponse.json();

      // Wait for 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Then fetch the new history
      await fetchHistory();

      // Clear active session
      setActiveSession(null);
      onNewChat();
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  // Fetch initial history when component mounts
  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle page leave/unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc')
        .then(() => fetchHistory())
        .catch((error) => console.error('Error handling page unload:', error));
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

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          New chat
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
