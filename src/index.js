/**
 * Cloudflare Workers 메인 엔트리 포인트
 * @param {Request} request - 들어오는 HTTP 요청
 * @param {Object} env - 환경 변수 및 바인딩
 * @param {Object} ctx - 실행 컨텍스트
 * @returns {Response} HTTP 응답
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      // 라우팅
      switch (url.pathname) {
        case '/':
          return handleRoot(request, env);

        case '/api/status':
          return handleStatus(request, env);

        case '/api/tools':
          return handleTools(request, env);

        default:
          return new Response('Not Found', {
            status: 404,
            headers: corsHeaders
          });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
  },
};

/**
 * 루트 경로 핸들러
 */
async function handleRoot(request, env) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cloudflare Workers Tools</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          line-height: 1.6;
        }
        .header { text-align: center; margin-bottom: 2rem; }
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1rem 0;
          background: #f9f9f9;
        }
        .endpoint {
          font-family: monospace;
          background: #e1e5e9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛠️ Cloudflare Workers Tools</h1>
        <p>빌드 및 배포 도구 모음</p>
      </div>

      <div class="card">
        <h2>📡 API 엔드포인트</h2>
        <p><strong>상태 확인:</strong> <span class="endpoint">GET /api/status</span></p>
        <p><strong>도구 목록:</strong> <span class="endpoint">GET /api/tools</span></p>
      </div>

      <div class="card">
        <h2>🔧 개발 정보</h2>
        <p><strong>환경:</strong> ${env.ENVIRONMENT || 'development'}</p>
        <p><strong>타임스탬프:</strong> ${new Date().toISOString()}</p>
      </div>

      <div class="card">
        <h2>🚀 빠른 시작</h2>
        <ul>
          <li>로컬 개발: <code>npm run dev</code></li>
          <li>빌드: <code>npm run build</code></li>
          <li>배포: <code>npm run deploy</code></li>
        </ul>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

/**
 * 상태 확인 핸들러
 */
async function handleStatus(request, env) {
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT || 'development',
    version: '1.0.0',
    uptime: Math.floor(Date.now() / 1000),
  };

  return Response.json(status, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

/**
 * 도구 목록 핸들러
 */
async function handleTools(request, env) {
  const tools = [
    {
      name: 'Cloudflare Workers',
      description: 'Edge computing platform',
      status: 'active',
    },
    {
      name: 'Wrangler CLI',
      description: 'Cloudflare Workers development tool',
      status: 'active',
    },
    {
      name: 'KV Storage',
      description: 'Key-Value storage',
      status: 'available',
    },
    {
      name: 'R2 Storage',
      description: 'Object storage',
      status: 'available',
    },
  ];

  return Response.json({
    tools,
    count: tools.length,
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
