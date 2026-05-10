'use client';

import { usePathname } from 'next/navigation';
import { 
  Home, BarChart2, Calendar, FileText, Settings, 
  Zap, Globe, Users, DollarSign, GitBranch, 
  Sparkles, Shield, Target
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Target, label: 'The Brief', href: 'https://the-brief-odmv4zxa7-kashiebot-7409s-projects.vercel.app', external: true },
  { icon: GitBranch, label: 'GitHub', href: 'https://github.com/kashiebot-7409s-projects/the-brief', external: true },
  { icon: BarChart2, label: 'Analytics', href: '#', disabled: true },
  { icon: DollarSign, label: 'Affiliate', href: '/affiliate' },
  { icon: Calendar, label: 'Calendar', href: '#', disabled: true },
  { icon: FileText, label: 'Documents', href: '#', disabled: true },
  { icon: Globe, label: 'Web Tools', href: '#', disabled: true },
  { icon: Zap, label: 'Automations', href: '#', disabled: true },
  { icon: Settings, label: 'Settings', href: '#', disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Mission Control</h1>
            <p className="text-xs text-gray-500">Project Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4">
        <div className="mb-4">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Main</p>
        </div>
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          const Component = item.external ? 'a' : 'a';
          
          return (
            <Component
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={`group flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : item.disabled
                  ? 'cursor-not-allowed text-gray-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            >
              <item.icon 
                size={18} 
                className={`transition-colors ${
                  isActive ? 'text-indigo-600' : item.disabled ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-600'
                }`} 
              />
              <span>{item.label}</span>
              {item.external && (
                <svg className="ml-auto h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </Component>
          );
        })}

        <div className="mb-4 mt-6">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Tools</p>
        </div>
        {navItems.slice(4).map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <a
              key={item.label}
              href={item.href}
              className={`group flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : item.disabled
                  ? 'cursor-not-allowed text-gray-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            >
              <item.icon 
                size={18} 
                className={`transition-colors ${
                  isActive ? 'text-indigo-600' : item.disabled ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-600'
                }`} 
              />
              <span>{item.label}</span>
              {item.disabled && (
                <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                  Soon
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer Card */}
      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-4 text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-medium opacity-90">OpenClaw Connected</span>
          </div>
          <p className="mt-2 text-xs opacity-80">AI-powered project automation active</p>
          <div className="mt-3 flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium">System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
