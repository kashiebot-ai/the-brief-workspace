import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'The Brief'
  const description = searchParams.get('description') || 'NZ Politics Without The Spin'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
          padding: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              background: '#fff',
              marginRight: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 'bold',
              color: '#1e3a5f',
            }}
          >
            B
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#fff',
            }}
          >
            The Brief
          </span>
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: '#fff',
            margin: '0 0 20px 0',
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 32,
            color: '#b8d4f0',
            margin: 0,
            maxWidth: 800,
          }}
        >
          {description}
        </p>
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 60,
            fontSize: 24,
            color: '#7ba3c9',
          }}
        >
          thebrief.nz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
