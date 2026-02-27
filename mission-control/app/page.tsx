import { Activity, TrendingUp, Users, Clock, Globe, Zap, BarChart3, Calendar, FileText, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import Widget from '@/components/Widget';
import OpenClawStatus from '@/components/OpenClawStatus';

const projectStatus = {
  phase: 'Pre-launch',
  daysToElection: 252,
  lastDecision: '2026-02-27',
  activeBlockers: 2,
};

const decisions = [
  { id: 1, date: '2026-02-27', decision: 'Pivot to civic news', status: 'confirmed' },
  { id: 2, date: '2026-02-27', decision: 'Start national (not local)', status: 'confirmed' },
  { id: 3, date: '2026-02-27', decision: 'Build control centre first', status: 'in-progress' },
];

const contentPipeline = [
  { id: 1, item: 'Project documentation', status: 'in-progress', priority: 'high' },
  { id: 2, item: 'Mission Control dashboard', status: 'in-progress', priority: 'high' },
  { id: 3, item: 'Name/branding finalization', status: 'blocked', priority: 'high' },
  { id: 4, item: 'Tech stack decision', status: 'blocked', priority: 'high' },
  { id: 5, item: 'First newsletter content', status: 'queued', priority: 'medium' },
];

const quickActions = [
  { icon: FileText, label: 'View Decisions', color: 'bg-blue-100 text-blue-700', href: '/projects/the-briefing/DECISIONS.md' },
  { icon: Target, label: 'Content Pipeline', color: 'bg-green-100 text-green-700', href: '/projects/the-briefing/CONTENT_PIPELINE.md' },
  { icon: Globe, label: 'Check Domain', color: 'bg-purple-100 text-purple-700', href: '#' },
  { icon: Calendar, label: 'Election Countdown', color: 'bg-orange-100 text-orange-700', href: '#' },
];

const blockers = [
  { id: 1, item: 'Name not finalized', impact: 'Can\'t buy domain', owner: 'user' },
  { id: 2, item: 'Tech stack unclear', impact: 'Can\'t start build', owner: 'user' },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">🎯 PRIMARY FOCUS</p>
            <h1 className="text-3xl font-bold">The Briefing</h1>
            <p className="mt-1 opacity-90">AI-powered translation layer between NZ government and citizens</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Election Day</p>
            <p className="text-4xl font-bold">{projectStatus.daysToElection}</p>
            <p className="text-sm opacity-90">days to go</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Phase</p>
              <p className="text-2xl font-bold">{projectStatus.phase}</p>
            </div>
            <Activity size={24} />
          </div>
          <p className="mt-2 text-sm opacity-90">Building foundation</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Decisions Made</p>
              <p className="text-3xl font-bold">{decisions.length}</p>
            </div>
            <CheckCircle2 size={24} />
          </div>
          <p className="mt-2 text-sm opacity-90">Last: {projectStatus.lastDecision}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">In Progress</p>
              <p className="text-3xl font-bold">{contentPipeline.filter(i => i.status === 'in-progress').length}</p>
            </div>
            <TrendingUp size={24} />
          </div>
          <p className="mt-2 text-sm opacity-90">Active tasks</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Blockers</p>
              <p className="text-3xl font-bold">{projectStatus.activeBlockers}</p>
            </div>
            <AlertCircle size={24} />
          </div>
          <p className="mt-2 text-sm opacity-90">Need your input</p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Widget title="Content Pipeline" colSpan={2}>
          <div className="space-y-3">
            {contentPipeline.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${
                    item.status === 'in-progress' ? 'bg-blue-500' :
                    item.status === 'blocked' ? 'bg-red-500' :
                    'bg-gray-300'
                  }`} />
                  <span className="text-gray-700">{item.item}</span>
                  {item.priority === 'high' && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">HIGH</span>
                  )}
                </div>
                <span className={`text-sm ${
                  item.status === 'in-progress' ? 'text-blue-600' :
                  item.status === 'blocked' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Widget>

        <Widget title="Quick Actions">
          <div className="space-y-3">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`flex w-full items-center space-x-3 rounded-lg p-3 ${action.color} transition-colors hover:opacity-90`}
              >
                <action.icon size={20} />
                <span className="font-medium">{action.label}</span>
              </a>
            ))}
          </div>
        </Widget>

        <Widget title="Recent Decisions" colSpan={2}>
          <div className="space-y-4">
            {decisions.map((d) => (
              <div key={d.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 size={18} className="text-green-500" />
                  <span className="text-gray-700">{d.decision}</span>
                </div>
                <span className="text-sm text-gray-500">{d.date}</span>
              </div>
            ))}
          </div>
        </Widget>

        <Widget title="Blockers (Need Your Input)">
          <div className="space-y-3">
            {blockers.map((b) => (
              <div key={b.id} className="rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="font-medium text-red-900">{b.item}</span>
                </div>
                <p className="mt-1 text-sm text-red-700">{b.impact}</p>
              </div>
            ))}
          </div>
        </Widget>

        <Widget title="System Status">
          <div className="space-y-4">
            <OpenClawStatus />
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Project Files</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">Ready</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Monitoring</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">Not started</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Domain</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">Not registered</span>
            </div>
          </div>
        </Widget>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h3 className="font-semibold text-gray-900">🎯 Today&apos;s Mission</h3>
        <p className="mt-2 text-gray-600">
          Project infrastructure complete. Control centre operational. Ready for strategic decisions on name, tech stack, and first content.
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <a 
            href="/projects/the-briefing/README.md"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 inline-block"
          >
            View Project Hub
          </a>
          <a 
            href="/projects/the-briefing/TECH_STACK.md"
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 inline-block"
          >
            Review Tech Options
          </a>
          <a 
            href="/projects/the-briefing/DECISIONS.md"
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 inline-block"
          >
            Decisions Log
          </a>
        </div>
      </div>
    </div>
  );
}
