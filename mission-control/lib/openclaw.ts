/**
 * Utility functions for interacting with OpenClaw Gateway via proxy
 */

export interface ToolInvokeRequest {
  tool: string;
  action?: string;
  args?: Record<string, any>;
  sessionKey?: string;
}

export interface ToolInvokeResponse {
  ok: boolean;
  result?: any;
  error?: {
    type: string;
    message: string;
  };
}

/**
 * Invoke an OpenClaw tool via the proxy API
 */
export async function invokeTool<T = any>(
  request: ToolInvokeRequest
): Promise<ToolInvokeResponse> {
  try {
    const response = await fetch('/api/openclaw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return await response.json();
  } catch (error) {
    console.error('Error invoking tool:', error);
    return {
      ok: false,
      error: {
        type: 'network_error',
        message: 'Failed to connect to API',
      },
    };
  }
}

/**
 * Get sessions list from OpenClaw
 */
export async function getSessions() {
  return invokeTool({
    tool: 'sessions_list',
    args: {},
  });
}

/**
 * Get cron jobs from OpenClaw
 */
export async function getCronJobs() {
  return invokeTool({
    tool: 'cron',
    args: { action: 'list' },
  });
}

/**
 * Get gateway status
 */
export async function getGatewayStatus() {
  return invokeTool({
    tool: 'gateway',
    args: { action: 'status' },
  });
}

/**
 * Get memory search results
 */
export async function searchMemory(query: string, maxResults = 5) {
  return invokeTool({
    tool: 'memory_search',
    args: {
      query,
      maxResults,
    },
  });
}

/**
 * Check if OpenClaw gateway is reachable
 */
export async function checkGatewayConnection(): Promise<boolean> {
  try {
    const response = await fetch('/api/openclaw', {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.status === 'connected';
    }
    return false;
  } catch {
    return false;
  }
}