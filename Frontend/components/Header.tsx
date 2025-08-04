'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-pacifico text-blue-600">
              InvestAI
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/insights" className="text-gray-700 hover:text-blue-600 transition-colors">
                Insights
              </Link>
              <Link href="/suggestions" className="text-gray-700 hover:text-blue-600 transition-colors">
                Suggestions
              </Link>
              <Link href="/settings" className="text-gray-700 hover:text-blue-600 transition-colors">
                Settings
              </Link>
              <Link href="/gamification" className="text-gray-700 hover:text-blue-600 transition-colors">
                Challenges
              </Link>
            </nav>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
            >
              <i className="ri-user-fill text-blue-600 w-5 h-5 flex items-center justify-center"></i>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-2">
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  Account Settings
                </Link>
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}