import React from 'react';
import { Menu } from 'lucide-react';

interface MobileNavProps {
  onToggleSidebar: () => void;
}

export function MobileNav({ onToggleSidebar }: MobileNavProps) {
  return (
    <button
      onClick={onToggleSidebar}
      className="fixed top-4 left-4 p-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors md:hidden z-50"
      aria-label="Toggle sidebar"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}