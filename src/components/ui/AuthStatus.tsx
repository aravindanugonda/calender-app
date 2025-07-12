"use client";
import { useUser } from "@auth0/nextjs-auth0";
import Image from 'next/image';
import { useState } from 'react';

export default function AuthStatus() {
  const { user, error, isLoading } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  if (isLoading) {
    return <div className="animate-pulse w-8 h-8 bg-gray-200 rounded-full" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error: {error.message}</div>;
  }

  if (user) {
    return (
      <div className="relative">
        {/* Avatar button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="User menu"
        >
          {user.picture ? (
            <Image 
              src={user.picture} 
              alt={user.name || 'Profile'} 
              width={32} 
              height={32} 
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* Dropdown menu */}
        {showDropdown && (
          <>
            {/* Overlay to close dropdown when clicking outside */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown content */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50">
              {/* User info */}
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                {user.email && (
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                )}
              </div>
              
              {/* Actions */}
              <div className="py-1">
                <a
                  href="/api/auth/logout"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign out
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <a 
      href="/api/auth/login"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      Sign in
    </a>
  );
}
