import React from 'react';

interface HistoryItemProps {
  title: string;
  isActive?: boolean;
  onClick: () => void;
}

export function HistoryItem({ title, isActive, onClick }: HistoryItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-300 hover:bg-gray-700/50'
      }`}
    >
      {title}
    </button>
  );
}