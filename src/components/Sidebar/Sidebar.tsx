import React from 'react';
import { RotateCw } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { HistoryItem } from './HistoryItem';

interface ChatHistory {
  id: string;
  title: string;
}

interface SidebarProps {
  histories: ChatHistory[];
  activeChat?: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  isDark: boolean; // Use global theme state
  toggleTheme: () => void; // Use global toggle function
}

export function Sidebar({
  histories,
  activeChat,
  onNewChat,
  onSelectChat,
  isDark,
  toggleTheme,
}: SidebarProps) {
  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
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

      {/* History Groups */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6">
        <div>
          <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
            Today
          </h2>
          <div className="space-y-1">
            {histories
              .filter((h) => h.id.startsWith('today'))
              .map((history) => (
                <HistoryItem
                  key={history.id}
                  title={history.title}
                  isActive={history.id === activeChat}
                  onClick={() => onSelectChat(history.id)}
                />
              ))}
          </div>
        </div>

        <div>
          <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
            Yesterday
          </h2>
          <div className="space-y-1">
            {histories
              .filter((h) => h.id.startsWith('yesterday'))
              .map((history) => (
                <HistoryItem
                  key={history.id}
                  title={history.title}
                  isActive={history.id === activeChat}
                  onClick={() => onSelectChat(history.id)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
