import { DollarSign, TrendingUp, Calendar, FileText, Zap, BarChart3 } from 'lucide-react';
import Widget from '@/components/Widget';

// Mock data for affiliate programs
const affiliatePrograms = [
  { name: 'Notion', category: 'Productivity', commission: '50% recurring for 12 months', cookie: '30 days', status: 'Active' },
  { name: 'ClickUp', category: 'Project Management', commission: '20%', cookie: '30 days', status: 'Active' },
  { name: 'Jasper', category: 'AI Writing', commission: '25‑30% recurring for 1 year', cookie: '30 days', status: 'Pending' },
  { name: 'Copy.ai', category: 'AI Writing', commission: '45% first year', cookie: '60 days', status: 'Active' },
  { name: 'HeadshotPro', category: 'AI Headshots', commission: '30%', cookie: '?', status: 'Active' },
  { name: 'Shopify', category: 'E‑commerce', commission: 'Up to 30%', cookie: '30 days', status: 'Active' },
  { name: 'Bluehost', category: 'Web Hosting', commission: '70%', cookie: '30 days', status: 'Active' },
];

// Mock content calendar
const contentCalendar = [
  { id: 1, title: 'Notion vs ClickUp: Which is Better in 2026?', status: 'Published', date: 'Feb 22, 2026' },
  { id: 2, title: 'Jasper AI Review: Is It Still Worth It?', status: 'Draft', date: 'Feb 25, 2026' },
  { id: 3, title: 'Top 10 AI Productivity Tools for Solopreneurs', status: 'Scheduled', date: 'Mar 1, 2026' },
  { id: 4, title: 'How to Automate Affiliate Marketing with OpenClaw', status: 'Idea', date: 'Mar 5, 2026' },
  { id: 5, title: 'Copy.ai vs Jasper: Head‑to‑Head Comparison', status: 'Idea', date: 'Mar 10, 2026' },
];

// Performance metrics
const metrics = [
  { label: 'Total Programs', value: '12', change: '+3' },
  { label: 'Active Campaigns', value: '7', change: '+2' },
  { label: 'Monthly Commissions', value: '$0', change: '—' },
  { label: 'Content Pieces', value: '5', change: '+1' },
];

export default function AffiliatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Affiliate Marketing Dashboard</h2>
        <p className="text-gray-600">Monitor programs, track content, and automate your income stream.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-white p-5 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-3xl font-bold mt-1">{metric.value}</p>
              </div>
              <div className={`rounded-full px-3 py-1 text-sm font-medium ${metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Affiliate Programs Table */}
        <Widget title="Affiliate Programs" subtitle="Tracked programs & commission details">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3">Program</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Commission</th>
                  <th className="pb-3">Cookie</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {affiliatePrograms.map((program) => (
                  <tr key={program.name} className="border-b last:border-0">
                    <td className="py-4 font-medium">{program.name}</td>
                    <td className="py-4 text-gray-600">{program.category}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        {program.commission}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">{program.cookie}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${program.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {program.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Add Program
            </button>
            <button className="ml-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Run Analysis
            </button>
          </div>
        </Widget>

        {/* Content Calendar */}
        <Widget title="Content Calendar" subtitle="Upcoming posts & ideas">
          <div className="space-y-4">
            {contentCalendar.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${item.status === 'Published' ? 'bg-green-500' : item.status === 'Draft' ? 'bg-yellow-500' : item.status === 'Scheduled' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.date} • {item.status}</p>
                  </div>
                </div>
                <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Edit
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-3">
            <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              + New Idea
            </button>
            <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Generate Outline
            </button>
          </div>
        </Widget>

        {/* Quick Actions */}
        <Widget title="Quick Actions">
          <div className="space-y-3">
            <button className="flex w-full items-center space-x-3 rounded-lg bg-blue-50 p-3 text-blue-700 transition-colors hover:bg-blue-100">
              <Zap size={20} />
              <span className="font-medium">Run Commission Report</span>
            </button>
            <button className="flex w-full items-center space-x-3 rounded-lg bg-green-50 p-3 text-green-700 transition-colors hover:bg-green-100">
              <FileText size={20} />
              <span className="font-medium">Generate Blog Post</span>
            </button>
            <button className="flex w-full items-center space-x-3 rounded-lg bg-purple-50 p-3 text-purple-700 transition-colors hover:bg-purple-100">
              <BarChart3 size={20} />
              <span className="font-medium">Analyze Competitors</span>
            </button>
            <button className="flex w-full items-center space-x-3 rounded-lg bg-orange-50 p-3 text-orange-700 transition-colors hover:bg-orange-100">
              <Calendar size={20} />
              <span className="font-medium">Schedule Social Posts</span>
            </button>
          </div>
        </Widget>

        {/* Automation Pipeline */}
        <Widget title="Automation Pipeline" subtitle="OpenClaw‑powered workflows">
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Keyword Research</h4>
                  <p className="text-sm text-gray-500">Daily scan for trending AI‑tool keywords</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">Active</span>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Content Generation</h4>
                  <p className="text-sm text-gray-500">Auto‑generate outlines & drafts</p>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">Paused</span>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Social Sharing</h4>
                  <p className="text-sm text-gray-500">Auto‑post to Twitter & LinkedIn</p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">Not Started</span>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Performance Tracking</h4>
                  <p className="text-sm text-gray-500">Monitor clicks, conversions, revenue</p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">Not Started</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 font-semibold text-white hover:opacity-90">
              Launch Automation Builder
            </button>
          </div>
        </Widget>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h3 className="font-semibold text-gray-900">Today&apos;s Affiliate Task</h3>
        <p className="mt-2 text-gray-600">
          Research 5 more high‑commission AI‑tool affiliate programs, update the database, and generate two blog post outlines (Notion vs ClickUp, Jasper review).
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Run Research Script
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
            View Full Plan
          </button>
          <a 
            href="/affiliate_marketing_plan.md"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 inline-block"
          >
            Open Master Plan
          </a>
        </div>
      </div>
    </div>
  );
}