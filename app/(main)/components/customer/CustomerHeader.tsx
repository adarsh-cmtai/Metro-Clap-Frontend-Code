"use client";

import { Menu } from 'lucide-react';

interface CustomerHeaderProps {
  onMenuClick: () => void;
}

export default function CustomerHeader({ onMenuClick }: CustomerHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-30">
      <div className="h-16 flex items-center px-4">
        <button onClick={onMenuClick} className="p-2 text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold ml-4">My Account</h1>
      </div>
    </header>
  );
}