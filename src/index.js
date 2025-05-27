/**
 * Tools Platform - 유용한 웹 도구 모음
 * 모든 처리는 클라이언트 사이드에서 수행 (Workers 무료 티어 CPU 제한 고려)
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
      // 라우팅 - 빠른 응답을 위해 단순 switch 사용
      switch (url.pathname) {
        case '/':
          return handleHome();

        case '/tools/text-counter':
          return handleTextCounter();

        case '/tools/url-encoder':
          return handleUrlEncoder();

        case '/tools/json-formatter':
          return handleJsonFormatter();

        case '/tools/base64-converter':
          return handleBase64Converter();

        case '/tools/qr-generator':
          return handleQrGenerator();

        case '/api/status':
          return handleStatus();

        default:
          return new Response('Not Found', {
            status: 404,
            headers: corsHeaders
          });
      }
    } catch (error) {
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders
      });
    }
  },
};

/**
 * 공통 스타일 - 중복 제거로 응답 크기 최적화
 */
const commonStyles = `
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    line-height: 1.6;
    background: #f8f9fa;
  }
  .header {
    text-align: center;
    margin-bottom: 2rem;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .back-link {
    display: inline-block;
    margin-bottom: 1rem;
    color: #3498db;
    text-decoration: none;
  }
  .back-link:hover { text-decoration: underline; }
  .tool-container {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
  }
  .input-group {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
  }
  textarea, input[type="text"] {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
  }
  textarea:focus, input[type="text"]:focus {
    outline: none;
    border-color: #3498db;
  }
  button {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
  button:hover { background: #2980b9; }
  .result {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    border-left: 4px solid #3498db;
  }
  .error {
    background: #fee;
    border-left-color: #e74c3c;
    color: #c0392b;
  }
`;

/**
 * 메인 홈페이지
 */
function handleHome() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>🛠️ Tools - 유용한 웹 도구 모음</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .tool-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s;
          text-decoration: none;
          color: inherit;
        }
        .tool-card:hover { transform: translateY(-2px); }
        .tool-icon { font-size: 2rem; margin-bottom: 1rem; }
        .tool-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; }
        .tool-description { color: #7f8c8d; font-size: 0.9rem; }
        .category-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 0.5rem;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛠️ Tools</h1>
        <p>광고 없는 유용한 웹 도구 모음</p>
      </div>

      <h2 class="category-title">📝 텍스트 도구</h2>
      <div class="tools-grid">
        <a href="/tools/text-counter" class="tool-card">
          <div class="tool-icon">📊</div>
          <div class="tool-title">텍스트 카운터</div>
          <div class="tool-description">글자 수, 단어 수, 줄 수 실시간 계산</div>
        </a>
        <a href="/tools/url-encoder" class="tool-card">
          <div class="tool-icon">🔗</div>
          <div class="tool-title">URL 인코더/디코더</div>
          <div class="tool-description">URL 안전 인코딩/디코딩</div>
        </a>
      </div>

      <h2 class="category-title">🔧 개발자 도구</h2>
      <div class="tools-grid">
        <a href="/tools/json-formatter" class="tool-card">
          <div class="tool-icon">📋</div>
          <div class="tool-title">JSON 포맷터</div>
          <div class="tool-description">JSON 포맷팅 및 검증</div>
        </a>
        <a href="/tools/base64-converter" class="tool-card">
          <div class="tool-icon">🔄</div>
          <div class="tool-title">Base64 변환기</div>
          <div class="tool-description">Base64 인코딩/디코딩</div>
        </a>
      </div>

      <h2 class="category-title">🎨 유틸리티</h2>
      <div class="tools-grid">
        <a href="/tools/qr-generator" class="tool-card">
          <div class="tool-icon">📱</div>
          <div class="tool-title">QR 코드 생성기</div>
          <div class="tool-description">텍스트/URL을 QR 코드로 변환</div>
        </a>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * 텍스트 카운터
 */
function handleTextCounter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>📊 텍스트 카운터</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .stat-card {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #3498db;
        }
        .stat-label {
          color: #7f8c8d;
          font-size: 0.9rem;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← 홈으로</a>
        <h1>📊 텍스트 카운터</h1>
      </div>

      <div class="tool-container">
        <textarea id="text" placeholder="텍스트를 입력하세요..." rows="8"></textarea>
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number" id="chars">0</div>
            <div class="stat-label">글자 수</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="charsNoSpace">0</div>
            <div class="stat-label">공백 제외</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="words">0</div>
            <div class="stat-label">단어 수</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="lines">0</div>
            <div class="stat-label">줄 수</div>
          </div>
        </div>
      </div>

      <script>
        const text = document.getElementById('text');
        const chars = document.getElementById('chars');
        const charsNoSpace = document.getElementById('charsNoSpace');
        const words = document.getElementById('words');
        const lines = document.getElementById('lines');

        function update() {
          const val = text.value;
          chars.textContent = val.length;
          charsNoSpace.textContent = val.replace(/\s/g, '').length;
          words.textContent = val.trim() ? val.trim().split(/\s+/).length : 0;
          lines.textContent = val ? val.split('\n').length : 0;
        }

        text.addEventListener('input', update);
        update();
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * URL 인코더/디코더
 */
function handleUrlEncoder() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>🔗 URL 인코더/디코더</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${commonStyles}</style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← 홈으로</a>
        <h1>🔗 URL 인코더/디코더</h1>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">입력 텍스트</label>
          <textarea id="input" placeholder="URL이나 텍스트를 입력하세요..." rows="4"></textarea>
        </div>
        <button onclick="encode()">인코딩</button>
        <button onclick="decode()">디코딩</button>
        <button onclick="clear()">지우기</button>
        <div id="result" class="result" style="display:none;"></div>
      </div>

      <script>
        const input = document.getElementById('input');
        const result = document.getElementById('result');

        function encode() {
          try {
            const encoded = encodeURIComponent(input.value);
            showResult(encoded);
          } catch (e) {
            showError('인코딩 실패: ' + e.message);
          }
        }

        function decode() {
          try {
            const decoded = decodeURIComponent(input.value);
            showResult(decoded);
          } catch (e) {
            showError('디코딩 실패: ' + e.message);
          }
        }

        function clear() {
          input.value = '';
          result.style.display = 'none';
        }

        function showResult(text) {
          result.innerHTML = '<strong>결과:</strong><br>' + text;
          result.className = 'result';
          result.style.display = 'block';
        }

        function showError(text) {
          result.innerHTML = text;
          result.className = 'result error';
          result.style.display = 'block';
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * JSON 포맷터
 */
function handleJsonFormatter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>📋 JSON 포맷터</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .json-output {
          background: #2d3748;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
          font-family: 'Monaco', 'Menlo', monospace;
          white-space: pre-wrap;
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← 홈으로</a>
        <h1>📋 JSON 포맷터</h1>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">JSON 입력</label>
          <textarea id="input" placeholder='{"key": "value"}' rows="6"></textarea>
        </div>
        <button onclick="format()">포맷팅</button>
        <button onclick="minify()">압축</button>
        <button onclick="validate()">검증</button>
        <button onclick="clear()">지우기</button>
        <div id="result" class="result" style="display:none;"></div>
      </div>

      <script>
        const input = document.getElementById('input');
        const result = document.getElementById('result');

        function format() {
          try {
            const obj = JSON.parse(input.value);
            const formatted = JSON.stringify(obj, null, 2);
            showResult('<div class="json-output">' + formatted + '</div>');
          } catch (e) {
            showError('JSON 파싱 오류: ' + e.message);
          }
        }

        function minify() {
          try {
            const obj = JSON.parse(input.value);
            const minified = JSON.stringify(obj);
            showResult('<div class="json-output">' + minified + '</div>');
          } catch (e) {
            showError('JSON 파싱 오류: ' + e.message);
          }
        }

        function validate() {
          try {
            JSON.parse(input.value);
            showResult('✅ 유효한 JSON입니다!');
          } catch (e) {
            showError('❌ 유효하지 않은 JSON: ' + e.message);
          }
        }

        function clear() {
          input.value = '';
          result.style.display = 'none';
        }

        function showResult(html) {
          result.innerHTML = html;
          result.className = 'result';
          result.style.display = 'block';
        }

        function showError(text) {
          result.innerHTML = text;
          result.className = 'result error';
          result.style.display = 'block';
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * Base64 변환기
 */
function handleBase64Converter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>🔄 Base64 변환기</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${commonStyles}</style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← 홈으로</a>
        <h1>🔄 Base64 변환기</h1>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">입력 텍스트</label>
          <textarea id="input" placeholder="텍스트를 입력하세요..." rows="4"></textarea>
        </div>
        <button onclick="encode()">Base64 인코딩</button>
        <button onclick="decode()">Base64 디코딩</button>
        <button onclick="clear()">지우기</button>
        <div id="result" class="result" style="display:none;"></div>
      </div>

      <script>
        const input = document.getElementById('input');
        const result = document.getElementById('result');

        function encode() {
          try {
            const encoded = btoa(unescape(encodeURIComponent(input.value)));
            showResult(encoded);
          } catch (e) {
            showError('인코딩 실패: ' + e.message);
          }
        }

        function decode() {
          try {
            const decoded = decodeURIComponent(escape(atob(input.value)));
            showResult(decoded);
          } catch (e) {
            showError('디코딩 실패: 유효하지 않은 Base64 문자열');
          }
        }

        function clear() {
          input.value = '';
          result.style.display = 'none';
        }

        function showResult(text) {
          result.innerHTML = '<strong>결과:</strong><br>' + text;
          result.className = 'result';
          result.style.display = 'block';
        }

        function showError(text) {
          result.innerHTML = text;
          result.className = 'result error';
          result.style.display = 'block';
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * QR 코드 생성기
 */
function handleQrGenerator() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>📱 QR 코드 생성기</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        #qrcode {
          text-align: center;
          margin: 1rem 0;
        }
        .size-controls {
          margin: 1rem 0;
        }
        .size-controls label {
          display: inline;
          margin-right: 1rem;
        }
        .size-controls input[type="range"] {
          width: 200px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← 홈으로</a>
        <h1>📱 QR 코드 생성기</h1>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">텍스트 또는 URL</label>
          <textarea id="input" placeholder="QR 코드로 변환할 텍스트나 URL을 입력하세요..." rows="3"></textarea>
        </div>

        <div class="size-controls">
          <label for="size">크기: <span id="sizeValue">200</span>px</label>
          <input type="range" id="size" min="100" max="400" value="200">
        </div>

        <button onclick="generate()">QR 코드 생성</button>
        <button onclick="download()">다운로드</button>
        <button onclick="clear()">지우기</button>

        <div id="qrcode"></div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
      <script>
        const input = document.getElementById('input');
        const sizeSlider = document.getElementById('size');
        const sizeValue = document.getElementById('sizeValue');
        const qrcodeDiv = document.getElementById('qrcode');
        let currentCanvas = null;

        sizeSlider.addEventListener('input', function() {
          sizeValue.textContent = this.value;
          if (input.value) generate();
        });

        function generate() {
          if (!input.value.trim()) {
            alert('텍스트를 입력해주세요.');
            return;
          }

          qrcodeDiv.innerHTML = '';

          QRCode.toCanvas(input.value, {
            width: parseInt(sizeSlider.value),
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          }, function (error, canvas) {
            if (error) {
              qrcodeDiv.innerHTML = '<div class="result error">QR 코드 생성 실패: ' + error + '</div>';
            } else {
              qrcodeDiv.appendChild(canvas);
              currentCanvas = canvas;
            }
          });
        }

        function download() {
          if (!currentCanvas) {
            alert('먼저 QR 코드를 생성해주세요.');
            return;
          }

          const link = document.createElement('a');
          link.download = 'qrcode.png';
          link.href = currentCanvas.toDataURL();
          link.click();
        }

        function clear() {
          input.value = '';
          qrcodeDiv.innerHTML = '';
          currentCanvas = null;
        }

        input.addEventListener('input', function() {
          if (this.value.trim()) {
            generate();
          }
        });
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * 상태 확인 API
 */
function handleStatus() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    tools: 5
  });
}
