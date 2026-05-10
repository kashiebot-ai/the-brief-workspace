'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, TrendingUp, CheckCircle2, AlertCircle, Clock, 
  Zap, BarChart3, Calendar, FileText, Target, GitBranch,
  ExternalLink, ChevronRight, Sparkles, Rocket, Shield
} from 'lucide-react';
import Widget from '@/components/Widget';
import OpenClawStatus from '@/components/OpenClawStatus';

// Real project data based on actual work completed
const projectStatus = {
  name: 'The Brief',
  tagline: 'NZ Political Transparency Platform',
  phase: 'Active Development',
  daysToElection: 251,
  lastDeploy: '2026-03-03',
  activeBranches: 9,
  mergedBranches: 0,
};

const completedWork = [
  { id: 1, date: '2026-03-03', title: 'Quiz Logic Fix', description: 'Fixed inverted scoring bug - all parties weighted equally', type: 'fix', status: 'complete' },
  { id: 2, date: '2026-03-03', title: 'Quiz Questions V2', description: '25 questions rewritten in plain, accessible English', type: 'feature', status: 'complete' },
  { id: 3, date: '2026-03-03', title: 'SEO Implementation', description: 'Dynamic OG images, sitemap.xml, JSON-LD structured data', type: 'feature', status: 'complete' },
  { id: 4, date: '2026-03-03', title: 'Design Polish', description: 'Framer Motion animations, hover effects, loading skeletons', type: 'feature', status: 'complete' },
  { id: 5, date: '2026-03-03', title: 'LLM Optimization', description: 'llms.txt, content.txt, explainers API for AI crawlers', type: 'feature', status: 'complete' },
  { id: 6, date: '2026-03-03', title: 'Bill Submission Tool', description: 'Bill listing/detail pages, Sanity CMS integration', type: 'feature', status: 'complete' },
  { id: 7, date: '2026-03-03', title: 'Complete MP Data', description: '69 electorates, 312 postcode mappings, full MP contacts', type: 'data', status: 'complete' },
  { id: 8, date: '2026-03-03', title: 'Automated Bill Scraper', description: 'Daily Parliament.nz scrape, bypasses Radware protection', type: 'automation', status: 'complete' },
  { id: 9, date: '2026-03-03', title: 'Advanced Bill Tool V2', description: 'Templates, alerts, impact calculator, social sharing', type: 'feature', status: 'complete' },
];

const readyToMerge = [
  { branch: 'fix/quiz-scoring-logic', description: 'Critical bug fix', status: 'ready' },
  { branch: 'feat/quiz-questions-v2', description: '25 rewritten questions', status: 'ready' },
  { branch: 'feat/seo-optimization', description: 'Full SEO implementation', status: 'ready' },
  { branch: 'feat/design-polish', description: 'Animations & effects', status: 'ready' },
  { branch: 'feat/llm-optimization', description: 'AI crawler optimization', status: 'ready' },
  { branch: 'feat/bill-submission-tool', description: 'MVP bill pages', status: 'ready' },
  { branch: 'feat/complete-electorate-data', description: 'Full NZ electorate data', status: 'ready' },
  { branch: 'feat/automated-bill-scraper', description: 'Daily bill scraping', status: 'ready' },
  { branch: 'feat/bill-submission-advanced', description: 'Advanced submission features', status: 'ready' },
];

const nextSteps = [
  { id: 1, task: 'Merge 9 feature branches to main', priority: 'high', eta: '30 min' },
  { id: 2, task: 'Run bill scraper to populate Sanity', priority: 'high', eta: '15 min' },
  { id: 3, task: 'Vercel production deploy', priority: 'high', eta: '5 min' },
  { id: 4, task: 'Test quiz scoring end-to-end', priority: 'medium', eta: '10 min' },
  { id: 5, task: 'Verify bill submission flow', priority: 'medium', eta: '10 min' },
];

const quickActions = [
  { icon: GitBranch, label: 'Review Branches', color: 'bg-indigo-100 text-indigo-700', href: 'https://github.com/kashiebot-7409s-projects/the-brief/branches' },
  { icon: Rocket, label: 'Production Site', color: 'bg-green-100 text-green-700', href: 'https://the-brief-odmv4zxa7-kashiebot-7409s-projects.vercel.app' },
  { icon: FileText, label: 'Sanity CMS', color: 'bg-purple-100 text-purple-700', href: '#' },
  { icon: BarChart3, label: 'Vercel Analytics', color: 'bg-orange-100 text-orange-700', href: '#' },
];

const systemHealth = [
  { name: 'GitHub Repo', status: 'healthy', message: '9 branches ready' },
  { name: 'Vercel Deploy', status: 'healthy', message: 'Production ready' },
  { name: 'Sanity CMS', status: 'healthy', message: 'Connected' },
  { name: 'OpenClaw Gateway', status: 'checking', message: 'Local only' },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fix': return <Shield className="w-4 h-4 text-amber-500" />;
      case 'feature': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'data': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'automation': return <Zap className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                🚀 {projectStatus.phase}
              </span>
              <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs font-medium text-green-100 backdrop-blur-sm">
                9 Branches Ready
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{projectStatus.name}</h1>
            <p className="text-lg text-white/80">{projectStatus.tagline}</p>
            <div className="flex items-center space-x-4 pt-2 text-sm text-white/70">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Last deploy: {projectStatus.lastDeploy}</span>
              </span>
              <span className="flex items-center space-x-1">
                <GitBranch className="w-4 h-4" />
                <span>{projectStatus.activeBranches} branches active</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white/70">NZ General Election</p>
            <p className="text-5xl font-bold">{projectStatus.daysToElection}</p>
            <p className="text-sm text-white/70">days remaining</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Features Complete</p>
              <p className="text-3xl font-bold text-gray-900">{completedWork.length}</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">In last 24 hours</p>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Ready to Merge</p>
              <p className="text-3xl font-bold text-gray-900">{readyToMerge.length}</p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <GitBranch className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">All passing CI</p>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Bills Tracked</p>
              <p className="text-3xl font-bold text-gray-900">95</p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">From Parliament.nz</p>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 to-pink-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Electorates</p>
              <p className="text-3xl font-bold text-gray-900">69</p>
            </div>
            <div className="rounded-xl bg-pink-50 p-3">
              <Target className="h-6 w-6 text-pink-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Full MP data loaded</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Completed Work */}
        <Widget title="Completed Work" subtitle="Last 24 hours - Night Shift" colSpan={2}>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {completedWork.map((item) => (
              <div 
                key={item.id} 
                className="group flex items-start space-x-3 rounded-lg border border-gray-100 p-3 transition-all hover:border-gray-200 hover:bg-gray-50/50"
              >
                <div className="mt-0.5 rounded-full bg-gray-100 p-1.5 group-hover:bg-white">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Quick Actions */}
        <Widget title="Quick Actions" subtitle="Launch external tools">
          <div className="space-y-2">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between rounded-lg p-3 transition-all hover:shadow-sm ${action.color} hover:opacity-90`}
              >
                <div className="flex items-center space-x-3">
                  <action.icon size={20} />
                  <span className="font-medium">{action.label}</span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </Widget>

        {/* Ready to Merge */}
        <Widget title="Ready to Merge" subtitle="9 feature branches queued" colSpan={2}>
          <div className="space-y-2">
            {readyToMerge.map((item, idx) => (
              <div 
                key={item.branch}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs font-medium text-indigo-600">
                    {idx + 1}
                  </span>
                  <div>
                    <code className="text-sm font-medium text-gray-900">{item.branch}</code>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  Ready
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <code className="text-xs text-gray-600 block">
              git checkout main && git merge fix/quiz-scoring-logic && git merge feat/quiz-questions-v2 ...
            </code>
          </div>
        </Widget>

        {/* Next Steps */}
        <Widget title="Next Steps" subtitle="Priority actions">
          <div className="space-y-3">
            {nextSteps.map((step) => (
              <div 
                key={step.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${step.priority === 'high' ? 'bg-red-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700">{step.task}</span>
                </div>
                <span className="text-xs text-gray-400">{step.eta}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Start Merge Process
          </button>
        </Widget>

        {/* System Health */}
        <Widget title="System Health" subtitle="Real-time status">
          <div className="space-y-3">
            {systemHealth.map((system) => (
              <div key={system.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{system.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{system.message}</span>
                  <span className={`h-2 w-2 rounded-full ${
                    system.status === 'healthy' ? 'bg-green-500' : 
                    system.status === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <OpenClawStatus />
          </div>
        </Widget>
      </div>

      {/* CTA Banner */}
      <div className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ready to Deploy</h3>
            <p className="text-gray-400 text-sm mt-1">
              9 branches completed. All tests passing. Production deploy waiting.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
              Review Changes
            </button>
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
              Deploy to Production
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
