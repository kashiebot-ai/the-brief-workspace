'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Server } from 'lucide-react';
import { checkGatewayConnection } from '@/lib/openclaw';

export default function OpenClawStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = async () => {
    setStatus('checking');
    const isConnected = await checkGatewayConnection();
    setStatus(isConnected ? 'connected' : 'disconnected');
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkStatus();
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-700 flex items-center space-x-2">
          <Server size={16} />
          <span>OpenClaw Gateway</span>
        </span>
        <div className="flex items-center space-x-2">
          {status === 'checking' && (
            <>
              <Loader2 size={16} className="animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">Checking...</span>
            </>
          )}
          {status === 'connected' && (
            <>
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-800">Connected</span>
            </>
          )}
          {status === 'disconnected' && (
            <>
              <XCircle size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-800">Disconnected</span>
            </>
          )}
        </div>
      </div>
      
      {lastChecked && (
        <div className="text-xs text-gray-500">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={checkStatus}
          disabled={status === 'checking'}
          className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-md transition disabled:opacity-50"
        >
          Check Now
        </button>
        <button
          onClick={() => window.open('http://localhost:18789', '_blank')}
          className="text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md transition"
        >
          Open Gateway UI
        </button>
      </div>
    </div>
  );
}