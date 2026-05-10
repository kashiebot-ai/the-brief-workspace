'use client';

import { Bell, Search, User, LogOut, Menu, Command } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Search */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search projects, tasks, or commands..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <kbd className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline-block">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* New Button */}
          <button className="hidden sm:flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
            <span>New Task</span>
          </button>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || 'Vianni'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
              {session?.user?.name?.[0] || 'V'}
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb / Context */}
      <div className="flex items-center space-x-1 border-t bg-gray-50/50 px-6 py-2 text-sm">
        <span className="font-medium text-gray-900">Mission Control</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">Dashboard</span>
        <span className="ml-auto text-xs text-gray-400">
          Last updated: {new Date().toLocaleDateString('en-NZ', { 
            day: 'numeric', 
            month: 'short', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </header>
  );
}
