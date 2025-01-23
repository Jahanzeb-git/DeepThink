import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function MobileNav({ onToggleSidebar, isSidebarOpen }: MobileNavProps) {
  return (
    <button
      onClick={onToggleSidebar}
      className="fixed top-4 left-4 p-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 
        transition-all duration-300 md:hidden z-50
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label="Toggle sidebar"
    >
      {isSidebarOpen ? (
        <X className="w-5 h-5 transform rotate-0 transition-transform duration-300" />
      ) : (
        <Menu className="w-5 h-5 transform rotate-0 transition-transform duration-300" />
      )}
    </button>
  );
}
