'use client';

import { useState } from 'react';
import { 
  DollarSign, TrendingUp, Calendar, FileText, Zap, 
  BarChart3, Plus, ExternalLink, Play, Pause, Clock
} from 'lucide-react';
import Widget from '@/components/Widget';

// Real affiliate programs data
const affiliatePrograms = [
  { 
    name: 'Notion', 
    category: 'Productivity', 
    commission: '50% recurring (12 mo)', 
    cookie: '30 days', 
    status: 'Active',
    earnings: '$0',
    clicks: 0
  },
  { 
    name: 'Copy.ai', 
    category: 'AI Writing', 
    commission: '45% first year', 
    cookie: '60 days', 
    status: 'Active',
    earnings: '$0',
    clicks: 0
  },
  { 
    name: 'Vercel', 
    category: 'Hosting', 
    commission: '$20-300 per signup', 
    cookie: '30 days', 
    status: 'Active',
    earnings: '$0',
    clicks: 0
  },
  { 
    name: 'Sanity', 
    category: 'CMS', 
    commission: '20% recurring', 
    cookie: '90 days', 
    status: 'Active',
    earnings: '$0',
    clicks: 0
  },
];

// Content ideas pipeline
const contentIdeas = [
  { id: 1, title: 'How I Built a Political Transparency Site with AI', status: 'Draft', date: 'Mar 5, 2026', type: 'Case Study' },
  { id: 2, title: 'Next.js 16 + Sanity: Full Stack Tutorial', status: 'Idea', date: 'Mar 10, 2026', type: 'Tutorial' },
  { id: 3, title: 'Automating NZ Parliament Data with OpenClaw', status: 'Idea', date: 'Mar 15, 2026', type: 'Technical' },
];

// Automation workflows
const workflows = [
  { 
    id: 1, 
    name: 'Content Research', 
    description: 'Daily scan for trending political/tech topics', 
    status: 'Active',
    lastRun: '2 hours ago'
  },
  { 
    id: 2, 
    name: 'Social Distribution', 
    description: 'Auto-post new content to Twitter/X', 
    status: 'Paused',
    lastRun: '3 days ago'
  },
  { 
    id: 3, 
    name: 'Analytics Report', 
    description: 'Weekly traffic and conversion summary', 
    status: 'Active',
    lastRun: '5 days ago'
  },
];

const metrics = [
  { label: 'Active Programs', value: '4', change: '+2', trend: 'up' },
  { label: 'Monthly Clicks', value: '0', change: '—', trend: 'neutral' },
  { label: 'Conversions', value: '0', change: '—', trend: 'neutral' },
  { label: 'Revenue', value: '$0', change: '—', trend: 'neutral' },
];

export default function AffiliatePage() {
  const [activeTab, setActiveTab] = useState('programs');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Affiliate Marketing</h2>
        <p className="text-gray-600">Track programs, plan content, and monitor performance.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`rounded-lg px-2 py-1 text-xs font-medium ${
                metric.trend === 'up' ? 'bg-green-100 text-green-700' : 
                metric.trend === 'down' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['programs', 'content', 'automations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 py-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {activeTab === 'programs' && (
          <>
            <Widget title="Affiliate Programs" subtitle="Active partnerships" colSpan={2}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3 font-medium">Program</th>
                      <th className="pb-3 font-medium">Commission</th>
                      <th className="pb-3 font-medium">Cookie</th>
                      <th className="pb-3 font-medium">Clicks</th>
                      <th className="pb-3 font-medium">Earnings</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliatePrograms.map((program) => (
                      <tr key={program.name} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-900">{program.name}</p>
                            <p className="text-xs text-gray-500">{program.category}</p>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{program.commission}</td>
                        <td className="py-4 text-sm text-gray-600">{program.cookie}</td>
                        <td className="py-4 text-sm text-gray-600">{program.clicks}</td>
                        <td className="py-4 text-sm font-medium text-gray-900">{program.earnings}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {program.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                  <span>Add Program</span>
                </button>
              </div>
            </Widget>
          </>
        )}

        {activeTab === 'content' && (
          <>
            <Widget title="Content Pipeline" subtitle="Ideas and drafts" colSpan={2}>
              <div className="space-y-4">
                {contentIdeas.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 h-2 w-2 rounded-full ${
                        item.status === 'Published' ? 'bg-green-500' : 
                        item.status === 'Draft' ? 'bg-yellow-500' : 
                        'bg-gray-300'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5">{item.type}</span>
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.status}</span>
                        </div>
                      </div>
                    </div>
                    <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex space-x-3">
                <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  + New Idea
                </button>
                <button className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  Generate with AI
                </button>
              </div>
            </Widget>
          </>
        )}

        {activeTab === 'automations' && (
          <>
            <Widget title="Active Workflows" subtitle="OpenClaw-powered automations" colSpan={2}>
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`rounded-full p-2 ${
                        workflow.status === 'Active' ? 'bg-green-100 text-green-600' : 
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {workflow.status === 'Active' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                        <p className="text-sm text-gray-500">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        workflow.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {workflow.status}
                      </span>
                      <p className="mt-1 text-xs text-gray-400 flex items-center justify-end space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{workflow.lastRun}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                Create New Workflow
              </button>
            </Widget>
          </>
        )}
      </div>
    </div>
  );
}
