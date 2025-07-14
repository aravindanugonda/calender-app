"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Image from 'next/image';
import Link from 'next/link';

export default function AuthStatus() {
  const { user, error, isLoading } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  // console.log("AuthStatus user:", user);

  if (isLoading) {
    return <div className="animate-pulse w-8 h-8 bg-gray-200 rounded-full" />;
  }

  // If user is missing, always show sign-in button, even if error exists (prevents 'Error: Unauthorized' after signout)
  if (!user) {
    return null;
  }

  // Only show error if user exists and there is an error (rare)
  if (error) {
    let errorMsg: string;
    if (typeof error === 'object' && error && 'message' in error) {
      errorMsg = (error as { message: string }).message;
    } else {
      errorMsg = String(error);
    }
    return <div className="text-red-500 text-sm">Error: {errorMsg}</div>;
  }

  // User is present
  const userName = user.name ?? '';
  const userPicture = user.picture ?? '';
  const userEmail = user.email ?? '';
  
  // Check if name and email are the same to avoid showing duplicate
  const displayName = userName && userName !== userEmail ? userName : null;
  
  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        aria-label="User menu"
      >
        {userPicture ? (
          <Image 
            src={userPicture} 
            alt={userName || 'Profile'} 
            width={32} 
            height={32} 
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            {userName.charAt(0).toUpperCase()}
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
              {displayName && (
                <p className="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </p>
              )}
              {userEmail && (
                <p className={`text-sm truncate ${displayName ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                  {userEmail}
                </p>
              )}
            </div>
            {/* Actions */}
            <div className="py-1">
              <Link
                href="/auth/logout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Sign out
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
