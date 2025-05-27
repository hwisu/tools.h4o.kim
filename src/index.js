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
 * 공통 스타일 - 타이포그래피 중심의 종이같은 디자인
 */
const commonStyles = `
  * { box-sizing: border-box; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    line-height: 1.7;
    background: #fefefe;
    color: #333;
  }
  .header {
    margin-bottom: 3rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ddd;
  }
  .back-link {
    display: inline-block;
    margin-bottom: 1rem;
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;
  }
  .back-link:hover { text-decoration: underline; }
  .tool-container {
    margin-bottom: 2rem;
    padding: 2rem 0;
    border-bottom: 1px solid #eee;
  }
  .input-group {
    margin-bottom: 1.5rem;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: normal;
    color: #444;
    font-size: 1rem;
  }
  textarea, input[type="text"] {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    background: #fff;
  }
  textarea:focus, input[type="text"]:focus {
    outline: none;
    border-color: #666;
    box-shadow: 0 0 3px rgba(0,0,0,0.1);
  }
  button {
    background: #333;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    font-family: inherit;
  }
  button:hover { background: #555; }
  .result {
    background: #f9f9f9;
    padding: 1rem;
    margin-top: 1rem;
    border-left: 3px solid #333;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
  }
  .error {
    background: #fff5f5;
    border-left-color: #d33;
    color: #d33;
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
      <title>Tools - 유용한 웹 도구 모음</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .search-container {
          margin-bottom: 2rem;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 3px;
          font-family: inherit;
        }
        .search-input:focus {
          outline: none;
          border-color: #666;
          box-shadow: 0 0 3px rgba(0,0,0,0.1);
        }
        .category {
          margin-bottom: 2rem;
        }
        .category-title {
          font-size: 1.3rem;
          font-weight: normal;
          margin-bottom: 1rem;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5rem;
        }
        .tool-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .tool-item {
          margin-bottom: 0.5rem;
          padding-left: 1rem;
        }
        .tool-item::before {
          content: "- ";
          margin-left: -1rem;
          color: #666;
        }
        .tool-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
        }
        .tool-link:hover {
          text-decoration: underline;
        }
        .tool-description {
          color: #666;
          font-weight: normal;
        }
        .hidden {
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Tools</h1>
        <p>Miscellaneous web tools for daily use</p>
      </div>

      <div class="search-container">
        <input type="text" id="searchInput" class="search-input" placeholder="Search tools..." autofocus>
      </div>

      <div class="category" data-category="text">
        <h2 class="category-title">Text Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="text counter character word line count">
            <a href="/tools/text-counter" class="tool-link">Text Counter</a>
            <span class="tool-description"> : Count characters, words, and lines in real-time</span>
          </li>
          <li class="tool-item" data-keywords="url encoder decoder encode decode uri">
            <a href="/tools/url-encoder" class="tool-link">URL Encoder/Decoder</a>
            <span class="tool-description"> : Safely encode and decode URLs</span>
          </li>
        </ul>
      </div>

      <div class="category" data-category="developer">
        <h2 class="category-title">Developer Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="json formatter pretty print validate minify">
            <a href="/tools/json-formatter" class="tool-link">JSON Formatter</a>
            <span class="tool-description"> : Format, validate, and minify JSON</span>
          </li>
          <li class="tool-item" data-keywords="base64 encoder decoder encode decode">
            <a href="/tools/base64-converter" class="tool-link">Base64 Converter</a>
            <span class="tool-description"> : Encode and decode Base64 strings</span>
          </li>
        </ul>
      </div>

      <div class="category" data-category="utility">
        <h2 class="category-title">Utilities</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="qr code generator qrcode barcode">
            <a href="/tools/qr-generator" class="tool-link">QR Code Generator</a>
            <span class="tool-description"> : Generate QR codes from text or URLs</span>
          </li>
        </ul>
      </div>

      <script>
        const searchInput = document.getElementById('searchInput');
        const toolItems = document.querySelectorAll('.tool-item');
        const categories = document.querySelectorAll('.category');

        function filterTools() {
          const query = searchInput.value.toLowerCase();

          if (!query) {
            // Show all tools and categories
            toolItems.forEach(item => item.classList.remove('hidden'));
            categories.forEach(category => category.classList.remove('hidden'));
            return;
          }

          let hasVisibleItems = false;

          categories.forEach(category => {
            const categoryItems = category.querySelectorAll('.tool-item');
            let categoryHasVisible = false;

            categoryItems.forEach(item => {
              const keywords = item.dataset.keywords || '';
              const toolName = item.querySelector('.tool-link').textContent.toLowerCase();
              const description = item.querySelector('.tool-description').textContent.toLowerCase();

              if (keywords.includes(query) || toolName.includes(query) || description.includes(query)) {
                item.classList.remove('hidden');
                categoryHasVisible = true;
                hasVisibleItems = true;
              } else {
                item.classList.add('hidden');
              }
            });

            if (categoryHasVisible) {
              category.classList.remove('hidden');
            } else {
              category.classList.add('hidden');
            }
          });
        }

        searchInput.addEventListener('input', filterTools);

        // Focus on search input when any key is pressed
        document.addEventListener('keydown', function(e) {
          if (e.target !== searchInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (e.key.length === 1 || e.key === 'Backspace') {
              searchInput.focus();
            }
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
 * 텍스트 카운터
 */
function handleTextCounter() {
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <title>Text Counter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .stats {
          margin-top: 2rem;
          padding: 1rem 0;
          border-top: 1px solid #eee;
        }
        .stat-line {
          margin-bottom: 0.5rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
        }
        .stat-label {
          color: #666;
          display: inline-block;
          width: 120px;
        }
        .stat-number {
          font-weight: bold;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Text Counter</h1>
        <p>Count characters, words, and lines in real-time</p>
      </div>

      <div class="tool-container">
        <label for="text">Text input</label>
        <textarea id="text" placeholder="Enter your text here..." rows="12" autofocus></textarea>

        <div class="stats">
          <div class="stat-line">
            <span class="stat-label">Characters:</span>
            <span class="stat-number" id="chars">0</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">No spaces:</span>
            <span class="stat-number" id="charsNoSpace">0</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">Words:</span>
            <span class="stat-number" id="words">0</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">Lines:</span>
            <span class="stat-number" id="lines">0</span>
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
      <title>URL Encoder/Decoder</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${commonStyles}</style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>URL Encoder/Decoder</h1>
        <p>Safely encode and decode URLs</p>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">Input text</label>
          <textarea id="input" placeholder="Enter URL or text here..." rows="4" autofocus></textarea>
        </div>
        <button onclick="encode()">Encode</button>
        <button onclick="decode()">Decode</button>
        <button onclick="clear()">Clear</button>
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
            showError('Encoding failed: ' + e.message);
          }
        }

        function decode() {
          try {
            const decoded = decodeURIComponent(input.value);
            showResult(decoded);
          } catch (e) {
            showError('Decoding failed: ' + e.message);
          }
        }

        function clear() {
          input.value = '';
          result.style.display = 'none';
        }

        function showResult(text) {
          result.innerHTML = 'Result:<br>' + text;
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
      <title>JSON Formatter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        .json-output {
          background: #f5f5f5;
          padding: 1rem;
          font-family: 'Monaco', 'Menlo', monospace;
          white-space: pre-wrap;
          overflow-x: auto;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>JSON Formatter</h1>
        <p>Format, validate, and minify JSON</p>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">JSON input</label>
          <textarea id="input" placeholder='{"key": "value"}' rows="6" autofocus></textarea>
        </div>
        <button onclick="format()">Format</button>
        <button onclick="minify()">Minify</button>
        <button onclick="validate()">Validate</button>
        <button onclick="clear()">Clear</button>
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
            showError('JSON parsing error: ' + e.message);
          }
        }

        function minify() {
          try {
            const obj = JSON.parse(input.value);
            const minified = JSON.stringify(obj);
            showResult('<div class="json-output">' + minified + '</div>');
          } catch (e) {
            showError('JSON parsing error: ' + e.message);
          }
        }

        function validate() {
          try {
            JSON.parse(input.value);
            showResult('Valid JSON');
          } catch (e) {
            showError('Invalid JSON: ' + e.message);
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
      <title>Base64 Converter</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${commonStyles}</style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>Base64 Converter</h1>
        <p>Encode and decode Base64 strings</p>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">Input text</label>
          <textarea id="input" placeholder="Enter text here..." rows="4" autofocus></textarea>
        </div>
        <button onclick="encode()">Encode</button>
        <button onclick="decode()">Decode</button>
        <button onclick="clear()">Clear</button>
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
            showError('Encoding failed: ' + e.message);
          }
        }

        function decode() {
          try {
            const decoded = decodeURIComponent(escape(atob(input.value)));
            showResult(decoded);
          } catch (e) {
            showError('Decoding failed: Invalid Base64 string');
          }
        }

        function clear() {
          input.value = '';
          result.style.display = 'none';
        }

        function showResult(text) {
          result.innerHTML = 'Result:<br>' + text;
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
      <title>QR Code Generator</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${commonStyles}
        #qrcode {
          text-align: center;
          margin: 2rem 0;
          padding: 1rem 0;
          border-top: 1px solid #eee;
        }
        .size-controls {
          margin: 1rem 0;
        }
        .size-controls label {
          display: block;
          margin-bottom: 0.5rem;
        }
        .size-controls input[type="range"] {
          width: 100%;
          margin-top: 0.5rem;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <a href="/" class="back-link">← Back</a>
        <h1>QR Code Generator</h1>
        <p>Generate QR codes from text or URLs</p>
      </div>

      <div class="tool-container">
        <div class="input-group">
          <label for="input">Text or URL</label>
          <textarea id="input" placeholder="Enter text or URL to convert..." rows="3" autofocus></textarea>
        </div>

        <div class="size-controls">
          <label for="size">Size: <span id="sizeValue">200</span>px</label>
          <input type="range" id="size" min="100" max="400" value="200">
        </div>

        <button onclick="generate()">Generate</button>
        <button onclick="download()">Download</button>
        <button onclick="clear()">Clear</button>

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
            alert('Please enter text or URL.');
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
              qrcodeDiv.innerHTML = '<div class="result error">QR code generation failed: ' + error + '</div>';
            } else {
              qrcodeDiv.appendChild(canvas);
              currentCanvas = canvas;
            }
          });
        }

        function download() {
          if (!currentCanvas) {
            alert('Please generate a QR code first.');
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
