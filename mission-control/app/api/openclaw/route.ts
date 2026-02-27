import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

export async function POST(request: NextRequest) {
  // Check if gateway token is configured
  if (!GATEWAY_TOKEN) {
    return NextResponse.json(
      { error: 'OpenClaw gateway token not configured' },
      { status: 500 }
    );
  }

  try {
    // Parse the request body
    const body = await request.json();
    
    // Extract the tool and args from the request
    const { tool, action, args, sessionKey = 'main' } = body;
    
    if (!tool) {
      return NextResponse.json(
        { error: 'Missing required field: tool' },
        { status: 400 }
      );
    }

    // Forward the request to the OpenClaw gateway
    const response = await fetch(`${GATEWAY_URL}/tools/invoke`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool,
        action,
        args,
        sessionKey,
      }),
    });

    // Get the response from the gateway
    const data = await response.json();
    
    // Return the gateway response
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Error proxying to OpenClaw gateway:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with OpenClaw gateway' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // For GET requests, we can provide a simple status check
  try {
    if (!GATEWAY_TOKEN) {
      return NextResponse.json(
        { status: 'error', message: 'Gateway token not configured' },
        { status: 500 }
      );
    }

    // Try to fetch gateway status
    const response = await fetch(`${GATEWAY_URL}/tools/invoke`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'sessions_list',
        args: {},
      }),
    });

    if (response.ok) {
      return NextResponse.json({
        status: 'connected',
        message: 'OpenClaw gateway is reachable',
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Gateway returned error',
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'disconnected',
      message: 'Cannot connect to OpenClaw gateway',
    }, { status: 503 });
  }
}