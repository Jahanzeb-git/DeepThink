import React from 'react';
import { MessageSquare } from 'lucide-react';

interface HistoryItemProps {
  title: string;
  subtitle?: string;
  isActive: boolean;
  onClick: () => void;
}

export function HistoryItem({ title, subtitle, isActive, onClick }: HistoryItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-3
        ${isActive 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'hover:bg-gray-800'}`}
    >
      <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
      <div className="flex flex-col overflow-hidden">
        <span className="truncate text-sm">{title}</span>
        {subtitle && (
          <span className="text-xs text-gray-400 truncate">
            {subtitle}
          </span>
        )}
      </div>
    </button>
  );
}
