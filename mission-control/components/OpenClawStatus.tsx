'use client';

import { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Loader2, Server, 
  RefreshCw, ExternalLink, Activity
} from 'lucide-react';

interface GatewayStatus {
  status: 'connected' | 'disconnected' | 'checking';
  message?: string;
  sessions?: number;
  version?: string;
}

export default function OpenClawStatus() {
  const [status, setStatus] = useState<GatewayStatus>({ status: 'checking' });
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = async () => {
    setStatus({ status: 'checking' });
    setIsRefreshing(true);
    
    try {
      // Try to fetch from the local API proxy
      const response = await fetch('/api/openclaw', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus({
          status: data.status === 'connected' ? 'connected' : 'disconnected',
          message: data.message,
          version: data.version,
        });
      } else {
        setStatus({
          status: 'disconnected',
          message: 'Gateway unreachable',
        });
      }
    } catch (error) {
      // Expected when running without local gateway
      setStatus({
        status: 'disconnected',
        message: 'Local gateway only',
      });
    } finally {
      setLastChecked(new Date());
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Check every 60 seconds
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status.status) {
      case 'connected':
        return {
          icon: <CheckCircle size={16} className="text-green-500" />,
          text: 'Connected',
          textClass: 'text-green-700',
          bgClass: 'bg-green-50',
        };
      case 'checking':
        return {
          icon: <Loader2 size={16} className="animate-spin text-gray-400" />,
          text: 'Checking...',
          textClass: 'text-gray-500',
          bgClass: 'bg-gray-50',
        };
      case 'disconnected':
        return {
          icon: <XCircle size={16} className="text-amber-500" />,
          text: 'Local Mode',
          textClass: 'text-amber-700',
          bgClass: 'bg-amber-50',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Server size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">OpenClaw Gateway</span>
        </div>
        <div className={`flex items-center space-x-1.5 rounded-full px-2.5 py-1 ${config.bgClass}`}>
          {config.icon}
          <span className={`text-xs font-medium ${config.textClass}`}>{config.text}</span>
        </div>
      </div>

      {status.message && (
        <p className="text-xs text-gray-500">{status.message}</p>
      )}

      <div className="flex items-center space-x-2">
        <button
          onClick={checkStatus}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-1 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
        
        <button
          onClick={() => window.open('http://localhost:18789', '_blank')}
          className="inline-flex items-center space-x-1 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          <ExternalLink size={12} />
          <span>Open UI</span>
        </button>
      </div>

      {lastChecked && (
        <p className="text-[10px] text-gray-400">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
