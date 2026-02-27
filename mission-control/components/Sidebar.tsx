import { Home, BarChart2, Calendar, FileText, Settings, Zap, Globe, Users, DollarSign } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', active: true, href: '/' },
  { icon: BarChart2, label: 'Analytics', href: '#' },
  { icon: DollarSign, label: 'Affiliate', href: '/affiliate' },
  { icon: Calendar, label: 'Calendar', href: '#' },
  { icon: FileText, label: 'Documents', href: '#' },
  { icon: Globe, label: 'Web Tools', href: '#' },
  { icon: Users, label: 'Team', href: '#' },
  { icon: Zap, label: 'Automations', href: '#' },
  { icon: Settings, label: 'Settings', href: '#' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-6">
      <div className="mb-8 flex items-center space-x-3">
        <div className="h-8 w-8 rounded-lg bg-blue-600" />
        <h1 className="text-xl font-bold">Mission Control</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${item.active
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto pt-8">
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
          <h3 className="font-semibold">Pro Tools</h3>
          <p className="text-sm opacity-90">Upgrade to unlock advanced features</p>
          <button className="mt-3 w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}