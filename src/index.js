/**
 * Tools Platform - 유용한 웹 도구 모음
 * 모든 처리는 클라이언트 사이드에서 수행 (Workers 무료 티어 CPU 제한 고려)
 */

// 도구 모듈 임포트
import { handleTextCounter } from './tools/text-counter.js';
import { handleUrlEncoder } from './tools/url-encoder.js';
import { handleJsonFormatter } from './tools/json-formatter.js';
import { handleBase64Converter } from './tools/base64-converter.js';
import { handleQrGenerator } from './tools/qr-generator.js';
import { handleSqlFormatter } from './tools/sql-formatter.js';
import { handleTimestampConverter } from './tools/timestamp-converter.js';
import { handleTextDiff } from './tools/text-diff.js';
import { handleTimezoneConverter } from './tools/timezone-converter.js';
import { handleImageConverter } from './tools/image-converter.js';
import { handleHashGenerator } from './tools/hash-generator.js';
import { handlePasswordGenerator } from './tools/password-generator.js';
import { commonStyles } from './common/styles.js';

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

        case '/tools/sql-formatter':
          return handleSqlFormatter();

        case '/tools/timestamp-converter':
          return handleTimestampConverter();

        case '/tools/text-diff':
          return handleTextDiff();

        case '/tools/timezone-converter':
          return handleTimezoneConverter();

        case '/tools/image-converter':
          return handleImageConverter();

        case '/tools/hash-generator':
          return handleHashGenerator();

        case '/tools/password-generator':
          return handlePasswordGenerator();

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
          <li class="tool-item" data-keywords="text diff compare difference">
            <a href="/tools/text-diff" class="tool-link">Text Diff</a>
            <span class="tool-description"> : Compare two text strings and highlight differences</span>
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
          <li class="tool-item" data-keywords="sql formatter prettify query">
            <a href="/tools/sql-formatter" class="tool-link">SQL Formatter</a>
            <span class="tool-description"> : Format and prettify SQL queries</span>
          </li>
          <li class="tool-item" data-keywords="timestamp converter unix time date">
            <a href="/tools/timestamp-converter" class="tool-link">Timestamp Converter</a>
            <span class="tool-description"> : Convert between Unix timestamps and dates</span>
          </li>
          <li class="tool-item" data-keywords="hash generator md5 sha1 sha256">
            <a href="/tools/hash-generator" class="tool-link">Hash Generator</a>
            <span class="tool-description"> : Generate MD5, SHA1, SHA256 hashes from text or files</span>
          </li>
        </ul>
      </div>

      <div class="category" data-category="utility">
        <h2 class="category-title">Utility Tools</h2>
        <ul class="tool-list">
          <li class="tool-item" data-keywords="qr code generator qrcode">
            <a href="/tools/qr-generator" class="tool-link">QR Code Generator</a>
            <span class="tool-description"> : Generate QR codes from text or URLs</span>
          </li>
          <li class="tool-item" data-keywords="timezone converter time zone">
            <a href="/tools/timezone-converter" class="tool-link">Timezone Converter</a>
            <span class="tool-description"> : Convert time between different timezones</span>
          </li>
          <li class="tool-item" data-keywords="image converter format resize">
            <a href="/tools/image-converter" class="tool-link">Image Converter</a>
            <span class="tool-description"> : Convert image format and resize images</span>
          </li>
          <li class="tool-item" data-keywords="password generator secure">
            <a href="/tools/password-generator" class="tool-link">Password Generator</a>
            <span class="tool-description"> : Generate secure passwords with customizable options</span>
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
            toolItems.forEach(item => item.classList.remove('hidden'));
            categories.forEach(category => category.classList.remove('hidden'));
            return;
          }

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
 * 상태 확인 API
 */
function handleStatus() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    tools: 12
  });
}
